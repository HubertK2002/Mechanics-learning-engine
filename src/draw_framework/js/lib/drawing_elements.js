export class Point {
	constructor(x,y,z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.name = "";
	}
}

export class Line {
	constructor(start, end, z = 0) {
		this.start = start;
		this.end = end;
		this.z = z;
	}
}

export class Triangle {
	constructor(a,b,c, z = 0) {
		this.A = a;
		this.B = b;
		this.C = c;
		this.z = 0;
	}
}

export class ShapeContainer {
	constructor() {
		this.shapes = JSON.parse(localStorage.getItem('shapes'));
		if(this.shapes == null) {
			this.shapes = {
				points: [],
				lines: [],
				triangles: []
			};
		}
		this.add = this.add.bind(this);
		this.save_storage = this.save_storage.bind(this);
		window.add_object = this.add;
		window.save = this.save_storage;
		window.get_points = this.getPoints.bind(this);
	}

	add(shape) {
		if (shape instanceof Point) {
			this.shapes.points.push(shape);
		} else if (shape instanceof Line) {
			this.shapes.lines.push(shape);
		} else if (shape instanceof Triangle) {
			this.shapes.triangles.push(shape);
		} else {
			throw new Error("Unknown shape type");
		}
	}

	save_storage() {
		localStorage.setItem('shapes', JSON.stringify(this.shapes));
	}

	getPoints() {
		return this.shapes.points;
	}
  
	getLines() {
		return this.shapes.lines;
	}
  
	getTriangles() {
		return this.shapes.triangles;
	}
}