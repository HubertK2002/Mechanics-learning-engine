export class Point {
	constructor(x,y,z = 0) {
		this.x = Number(x);
		this.y = Number(y);
		this.z = Number(z);
		this.name = "";
	}

	set(cords) {
		this.x = cords.x;
		this.y = cords.y;
		this.z = cords.z;
	}

	move(vector) {
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
	}

	copy() {
		return new Point(this.x, this.y, this.z);
	}

	static deserialize(obj) {
		var p = new Point(obj.x, obj.y, obj.z);
		p.name = obj.name;
		return p;
	}
}

export class Line {
	constructor(start, end, z = 0) {
		this.start = start;
		this.end = end;
		this.z = z;
		this.name = "";
		this.draw_points = true;
	}

	copy() {
		return new Line(this.start.copy(), this.end.copy());
	}

	rcopy() {
		return new Line(this.end.copy(), this.start.copy());
	}

	static deserialize(obj) {
		var p1 = Point.deserialize(obj.start);
		var p2 = Point.deserialize(obj.end);
		var l = new Line(p1, p2, obj.z);
		l.name = obj.name;
		l.draw_points = obj.draw_points;
		return l;
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

export class Vector {
	constructor(line, name = "") {
		this.line = line;
		this.line.name = name;
		this.x = line.end.x - line.start.x;
		this.y = line.end.y - line.start.y;
		this.z = line.end.z - line.start.z;
		this.name = name;
	}

	copy() {
		return new Vector(this.line.copy(), this.name);
	}

	get length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	cross(Vector2) {
		var i = this.y * Vector2.z - Vector2.y * this.z;
		var j = Vector2.x * this.z - Vector2.z * this.x;
		var k = this.x * Vector2.y - Vector2.x * this.y;
		var line = new Line(new Point(0,0,0), new Point(i,j,k));
		return new Vector(line);
	}

	attach(point) {
		this.line.start.set(point);
		this.line.end.set(point);
		this.line.end.move(new Point(this.x, this.y, this.z));
	}

	rotate2D(angle) {
		angle = 360 - angle;
		var angle_radians = Math.PI * angle / 180;
		this.line.end.x += -Number(Math.cos(angle_radians)) + Number(Math.sin(angle_radians));
		this.line.end.y += - Number(Math.sin(angle_radians)) - Number(Math.cos(angle_radians));
		this.x = this.line.end.x - this.line.start.x;
		this.y = this.line.end.y - this.line.start.y;
	}

	unit() {
		var len = this.length;
		this.x /= len;
		this.y /= len;
		this.z /= len;
		this.attach(this.line.start);
	}

	multiply(number) {
		this.x *= number;
		this.y *= number;
		this.z *= number;
		this.attach(this.line.start);
	}

	static deserialize(obj) {
		var v = new Vector(Line.deserialize(obj.line));
		v.name = obj.name;
		return v;
	}

	static default() {
		return new Vector(new Line(new Point(-1,-1), new Point(1,1)));
	}

	static zero() {
		return new Vector(new Line(new Point(0,0), new Point(0,0)));
	}
}

export class Force {
	constructor(point, vector, value, name="") {
		this.point = point;
		this.direction = vector;
		this.direction.unit();
		this.value = Number(value);
		this.name = name;
	}

	static deserialize(obj) {
		var f = new Force(Point.deserialize(obj.point), Vector.deserialize(obj.direction), obj.value);
		f.name = obj.name;
		return f;
	}

	static default() {
		return new Force(new Point(0,0), Vector.default(), 5);
	}
}

export class SuperPosition {
	constructor() {
		this.Vectors = Array();
		this.name = "";
	}

	add(vector) {
		this.Vectors.push(vector);
		this.count_super();
	}

	count_super() {
		this.super_vector = Vector.zero();
		this.Vectors.forEach(vector => {
			this.super_vector.x += vector.x;
			this.super_vector.y += vector.y;
			this.super_vector.z += vector.z;
		})

		let super_end = this.Vectors[0].line.start.copy();
		super_end.move(this.super_vector);
		this.super_vector = new Vector(new Line(new Point(this.Vectors[0].line.start), new Point(this.super_end)));
	}

	set_start_point(point) {
		this.start_point = point;
	}

	static deserialize(vectors_arr, super_position) {
		let sp = new SuperPosition();
		sp.name = super_position.name;
		if(super_position.start_point != null)
			sp.start_point = Point.deserialize(super_position.start_point);

		super_position.Vectors.forEach(vector => {
			sp.add(Vector.deserialize(vector));
		})
		return sp;
	}
}

export class ShapeContainer {
	constructor(shapeStorage) {
		this.shapeStorage = shapeStorage;
		this.shapes = JSON.parse(localStorage.getItem(shapeStorage));
		if(this.shapes != null) {
			["points", "lines", "triangles", "vectors", "forces", "super_positions"].forEach(element => {
				if (!this.shapes[element]) {
					this.shapes[element] = [];
				}
			});
			this.shapes = {
				points: this.shapes.points.map(point => Point.deserialize(point)),
				lines: this.shapes.lines.map(line => Line.deserialize(line)),
				vectors: this.shapes.vectors.map(vector => Vector.deserialize(vector)),
				triangles: this.shapes.triangles,
				forces: this.shapes.forces.map(force => Force.deserialize(force)),
				super_positions: this.shapes.super_positions
			};
			this.shapes.super_positions = this.shapes.super_positions.map(sp => SuperPosition.deserialize(this.shapes.vectors, sp));
		} else {
			this.shapes = {};
			["points", "lines", "triangles", "vectors", "forces", "super_positions"].forEach(element => {
				if (!this.shapes[element]) {
					this.shapes[element] = [];
				}
			});
		}

		this.bind();
	}

	bind() {
		this.add = this.add.bind(this);
		this.save_storage = this.save_storage.bind(this);
		window.add_object = this.add;
		window.save = this.save_storage;
		window.get_points = this.getPoints.bind(this);
		window.get_lines = this.getLines.bind(this);
		window.get_triangles = this.getTriangles.bind(this);
		window.get_vectors = this.getVectors.bind(this);
		window.get_forces = this.getForces.bind(this);
		window.get_super_positions = this.getSuperPositions.bind(this);
		window.set_elements = true;
	}

	add(shape) {
		if (shape instanceof Point) {
			this.shapes.points.push(shape);
		} else if (shape instanceof Line) {
			this.shapes.lines.push(shape);
		} else if (shape instanceof Triangle) {
			this.shapes.triangles.push(shape);
		} else if (shape instanceof Vector) {
			if(this.shapes.vectors == undefined)
				this.shapes.vectors = Array();
			this.shapes.vectors.push(shape);
		} else if(shape instanceof Force) {
			this.shapes.forces.push(shape);
		} else if (shape instanceof SuperPosition) {
			this.shapes.super_positions.push(shape);
		} else {
			throw new Error("Unknown shape type");
		}
	}

	save_storage() {
		localStorage.setItem(this.shapeStorage, JSON.stringify(this.shapes));
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
	getVectors() {
		return this.shapes.vectors;
	}
	getForces() {
		return this.shapes.forces;
	}
	getSuperPositions() {
		return this.shapes.super_positions;
	}
}