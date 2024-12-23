import {Point, Line, Triangle, Vector} from "./drawing_elements.js";

export default class draw {
	constructor(glutils) {
		this.glutils = glutils;
		this.update = this.update.bind(this);
		window.addEventListener('resize', this.update);
		window.refreshScene = this.update;
		this.rotation = [0, 1];
		this.relative_start = [0,0];
		this.update();
	}

	getgl() {
		return this.glutils.current.gl;
	}
	getprogram() {
		return this.glutils.current.program;
	}
	
	initBuffers(points_array) {
		var vertices = new Float32Array(points_array);
		// Create a buffer object
		var vertexBuffer = this.getgl().createBuffer();
		if (!vertexBuffer) {
		  console.log('Failed to create the buffer object');
		  return -1;
		}
	
		this.getgl().bindBuffer(this.getgl().ARRAY_BUFFER, vertexBuffer);
		this.getgl().bufferData(this.getgl().ARRAY_BUFFER, vertices, this.getgl().STATIC_DRAW);
	
		this.aPosition = this.getgl().getAttribLocation(this.getprogram(), 'a_position');
		if (this.aPosition < 0) {
		  console.log('Failed to get the storage location of aPosition');
		  return -1;
		}

		var color = [0.3, 0.1, 0.4, 1];
		var colorLocation = this.getgl().getUniformLocation(this.getprogram(), "u_color");
		var rotationLocation = this.getgl().getUniformLocation(this.getprogram(), "u_rotation");
		var resolutionUniformLocation = this.getgl().getUniformLocation(this.getprogram(), "u_resolution");
		var relative_start = this.getgl().getUniformLocation(this.getprogram(), "relative_start");

		this.getgl().vertexAttribPointer(this.aPosition, 2, this.getgl().FLOAT, false, 0, 0);
		this.getgl().enableVertexAttribArray(this.aPosition);
		this.getgl().uniform4fv(colorLocation, color);
		this.getgl().uniform2f(resolutionUniformLocation, this.getgl().canvas.width, this.getgl().canvas.height);
		this.getgl().uniform2fv(rotationLocation, this.rotation);
		this.getgl().uniform2fv(relative_start, this.relative_start);
	}

	draw_points(points) {
		var float_array = Array();
		points.forEach(point => {
			float_array.push(point.x);
			float_array.push(point.y);
			const pointName = document.createElement("p");
			pointName.innerHTML = point.name;
			pointName.style.top = (100 - ((parseFloat(point.y/this.getgl().canvas.height) + 1) / 2 * 100 )) + "%";
			pointName.style.left = ((parseFloat(point.x/this.getgl().canvas.width) + 1) / 2 * 100 )+ "%";
			this.glutils.current.textDiv.appendChild(pointName);
		});
		this.initBuffers(float_array);
		this.getgl().drawArrays(this.getgl().POINTS, 0, points.length);
	}
	
	draw_lines(Lines) {
		Lines.forEach(line => {
			var float_array = Array();
			var points = Array();
			float_array.push(line.start.x);
			float_array.push(line.start.y);
			float_array.push(line.end.x);
			float_array.push(line.end.y);
			if(line.draw_points) points.push(line.start, line.end);
			this.relative_start[0] = line.start.x;
			this.relative_start[1] = line.start.y;
			this.initBuffers(float_array);
			this.getgl().drawArrays(this.getgl().LINES, 0, 2);
			this.draw_points(points);
		});
		this.relative_start = [0,0];
	}

	draw_triangles(Triangles) {
		var float_array = Array();
		Triangles.forEach(triangle => {
			float_array.push(triangle.A.x);
			float_array.push(triangle.A.y);
			float_array.push(triangle.B.x);
			float_array.push(triangle.B.y);
			float_array.push(triangle.C.x);
			float_array.push(triangle.C.y);
		});
		this.initBuffers(float_array);
		this.getgl().drawArrays(this.getgl().TRIANGLES, 0, Triangles.length * 3);
	}

	draw_vectors(Vectors) {
		var first_arrows = Array();
		var second_arrows = Array();
		var lines = Array();
		Vectors.forEach(vector => {
			var first_arrow = new Vector(vector.line.rcopy());
			var second_arrow = new Vector(vector.line.rcopy());
			var line = vector.line.copy();
			line.draw_points = false;
			lines.push(line);
			first_arrow.unit();
			second_arrow.unit();
			first_arrow.multiply(35);
			second_arrow.multiply(35);
			first_arrow.line.draw_points = false;
			second_arrow.line.draw_points = false;
			first_arrows.push(first_arrow.line);
			second_arrows.push(second_arrow.line);
		});

		this.updateAngle(30);
		this.draw_lines(first_arrows);
		this.updateAngle(-30);
		this.draw_lines(second_arrows);
		this.updateAngle(0);
		this.draw_lines(lines);
	}

	draw_forces(Forces) {
		var vectors = Array();
		Forces.forEach(force => {
			var vector = force.direction.copy();
			vector.multiply(100);
			vector.attach(force.Anchor_point);
			vectors.push(vector);
		})
		this.draw_vectors(vectors);
	}

	draw_super_positions(Sps) {
		Sps.forEach(Sp => {
			this.draw_super_position(Sp);
		})
	}

	draw_super_position(Sp) {
		if(Sp.Vectors.length == 0) return;
		var vectors = Array();
		var last_end;
		if(Sp.start_point != null) {
			last_end = Sp.start_point.copy();
			last_end.move(Sp.Vectors[0]);
			var vec = new Vector(new Line(Sp.start_point, last_end));
			vectors.push(vec);
		}
		else {
			last_end = Sp.Vectors[0].line.end;
			vectors.push(Sp.Vectors[0]);
		}

		for(let i = 1; i < Sp.Vectors.length; i++) {
			var new_end = last_end.copy();
			new_end.move(Sp.Vectors[i]);
			var vec = new Vector(new Line(last_end, new_end));
			vectors.push(vec);
			last_end = new_end;
		}
		this.draw_vectors(vectors);
	}

	draw_bars(bars) {
		var lines = Array();
		bars.forEach(bar => {
			lines.push(new Line(bar.Position, bar.EndPosition));
		})
		this.draw_lines(lines);
	}

	draw_bonds(bonds) {
		bonds.forEach(bond => {
			this.draw_vectors(Array(bond.Vec));
		})
	}

	update() {
		this.glutils.current.textDiv.innerHTML = "";
		this.relative_start = [0,0];
		this.getgl().clear(this.getgl().COLOR_BUFFER_BIT);
		if(!window.set_elements) return;
		this.draw_points(window.get_points());
		this.draw_lines(window.get_lines());
		this.draw_triangles(window.get_triangles());
		this.draw_vectors(window.get_vectors());
		this.draw_forces(window.get_forces());
		this.draw_super_positions(window.get_super_positions());
		this.draw_bars(window.get_bars());
		this.draw_bonds(window.get_bonds());
	}

	updateAngle(angle) {
		var angleInDegrees = 360 - angle;
		var angleInRadians = angleInDegrees * Math.PI / 180;
		this.rotation[0] = Math.sin(angleInRadians);
		this.rotation[1] = Math.cos(angleInRadians);
	}
}