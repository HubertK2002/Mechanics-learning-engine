import {Point, Line, Triangle} from "./drawing_elements.js";

export default class draw {
	constructor(glutils, ShapesContainer) {
		this.glutils = glutils;
		this.ShapesContainer = ShapesContainer;
		this.update = this.update.bind(this);
		window.addEventListener('resize', this.update);
		window.refresh = this.update;
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
	
		var aPosition = this.getgl().getAttribLocation(this.getprogram(), 'aPosition');
		if (aPosition < 0) {
		  console.log('Failed to get the storage location of aPosition');
		  return -1;
		}
	
		this.getgl().vertexAttribPointer(aPosition, 3, this.getgl().FLOAT, false, 0, 0);
		this.getgl().enableVertexAttribArray(aPosition);
	  }

	  draw_points(points) {
		var float_array = Array();
		points.forEach(point => {
			float_array.push(point.x);
			float_array.push(point.y);
			float_array.push(point.z);
			const pointName = document.createElement("p");
			pointName.innerHTML = point.name;
			pointName.style.top = (100 - ((parseFloat(point.y) + 1) / 2 * 100 )) + "%";
			pointName.style.left = ((parseFloat(point.x) + 1) / 2 * 100 )+ "%";
			this.glutils.current.textDiv.appendChild(pointName);
		});
		this.initBuffers(float_array);
		this.getgl().drawArrays(this.getgl().POINTS, 0, points.length);
	}
	
	draw_lines(Lines) {
		var float_array = Array();
		var points = Array();
		Lines.forEach(line => {
			float_array.push(line.start.x);
			float_array.push(line.start.y);
			float_array.push(line.z);
			float_array.push(line.end.x);
			float_array.push(line.end.y);
			float_array.push(line.z);
			if(line.draw_points) points.push(line.start, line.end);
		});
		this.initBuffers(float_array);
		this.getgl().drawArrays(this.getgl().LINES, 0, Lines.length * 2);
		this.draw_points(points);
	}

	draw_triangles(Triangles) {
		var float_array = Array();
		Triangles.forEach(triangle => {
			float_array.push(triangle.A.x);
			float_array.push(triangle.A.y);
			float_array.push(triangle.z);
			float_array.push(triangle.B.x);
			float_array.push(triangle.B.y);
			float_array.push(triangle.z);
			float_array.push(triangle.C.x);
			float_array.push(triangle.C.y);
			float_array.push(triangle.z);
		});
		this.initBuffers(float_array);
		this.getgl().drawArrays(this.getgl().TRIANGLES, 0, Triangles.length * 3);
	}

	update() {
		this.glutils.current.textDiv.innerHTML = "";
		this.getgl().clear(this.getgl().COLOR_BUFFER_BIT);
		this.draw_points(this.getShapesContainer().getPoints());
		this.draw_lines(this.getShapesContainer().getLines());
		this.draw_triangles(this.getShapesContainer().getTriangles());
	}
}