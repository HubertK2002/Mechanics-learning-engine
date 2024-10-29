import {Point, Line, Triangle, Vector} from "./drawing_elements.js";

export default class draw {
	constructor(glutils, ShapesContainer) {
		this.glutils = glutils;
		this.ShapesContainer = ShapesContainer;
		this.update = this.update.bind(this);
		window.addEventListener('resize', this.update);
		window.refresh = this.update;
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
	getShapesContainer() {
		return this.ShapesContainer.current;
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
			vector.attach(force.point);
			vectors.push(vector);
		})
		this.draw_vectors(vectors);
	}

	update() {
		this.glutils.current.textDiv.innerHTML = "";
		this.relative_start = [0,0];
		this.getgl().clear(this.getgl().COLOR_BUFFER_BIT);
		this.draw_points(this.getShapesContainer().getPoints());
		this.draw_lines(this.getShapesContainer().getLines());
		this.draw_triangles(this.getShapesContainer().getTriangles());
		this.draw_vectors(this.getShapesContainer().getVectors());
		this.draw_forces(this.getShapesContainer().getForces());
	}

	updateAngle(angle) {
		var angleInDegrees = 360 - angle;
		var angleInRadians = angleInDegrees * Math.PI / 180;
		this.rotation[0] = Math.sin(angleInRadians);
		this.rotation[1] = Math.cos(angleInRadians);
	}
}