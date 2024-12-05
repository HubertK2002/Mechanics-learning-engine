import { Vec3 } from "../../math/vec3";
import { Bar } from "../../objects/bar";
import { Base } from "../../objects/base";
import { linear_bond } from "../../objects/bonds/linear_bond";
import { Gravitational_field } from "../../objects/gravitational_field";

export class Point extends Base {
	constructor(x,y,z = 0) {
		super();
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

export class Line extends Base {
	constructor(start, end, z = 0) {
		super();
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

	set(line) {
		this.start.set(line.start);
		this.end.set(line.end);
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

export class Vector extends Base {
	constructor(line, name = "") {
		super();
		this.line = line;
		this.line.name = name;
		this.name = name;
	}

	copy() {
		return new Vector(this.line.copy(), this.name);
	}

	get x() {
		return this.line.end.x - this.line.start.x;
	}

	get y() {
		return this.line.end.y - this.line.start.y;
	}

	get z() {
		return this.line.end.z - this.line.start.z;
	}

	get length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	set(vector) {
		this.line.set(vector.line);
	}

	cross(Vector2) {
		var i = this.y * Vector2.z - Vector2.y * this.z;
		var j = Vector2.x * this.z - Vector2.z * this.x;
		var k = this.x * Vector2.y - Vector2.x * this.y;
		var line = new Line(new Point(0,0,0), new Point(i,j,k));
		return new Vector(line);
	}

	attach(point) {
		var x = this.x;
		var y = this.y;
		var z = this.z;
		this.line.start.set(point);
		this.line.end.set(point);
		this.line.end.move(new Point(x, y, z));
	}

	rotate2D(angle) {
		angle = 360 - angle;
		var angle_radians = Math.PI * angle / 180;
		this.line.end.x += -Number(Math.cos(angle_radians)) + Number(Math.sin(angle_radians));
		this.line.end.y += - Number(Math.sin(angle_radians)) - Number(Math.cos(angle_radians));
	}

	unit() {
		var len = this.length;
		var x = this.x / len;
		var y = this.y / len;
		var z = this.z / len;
		this.line.end.set(this.line.start);
		this.line.end.move(new Vec3(x,y,z));
	}

	multiply(number) {
		var x = this.x * number;
		var y =  this.y * number;
		var z =  this.z * number;

		this.line.end.set(this.line.start);
		this.line.end.move(new Vec3(x,y,z));
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

export class Force extends Base {
	constructor(point, vector, value, name="") {
		super();
		this.direction = vector;
		this.direction.unit();
		this.value = Number(value);
		this.name = name;
		this.Anchor_point = point;
		this.hook = false;
	}

	static deserialize(obj) {
		var f = new Force(Point.deserialize(obj.Anchor_point), Vector.deserialize(obj.direction), obj.value);
		f.name = obj.name;
		return f;
	}

	static default() {
		return new Force(new Point(0,0), Vector.default(), 5);
	}

	set_start_point(point) {
		this.Anchor_point = point.copy();
		this.hook = true;
	}
}

export class SuperPosition extends Base {
	constructor() {
		super();
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
			["points", "lines", "triangles", "vectors", "forces", "super_positions", "bars", "gf", "lb"].forEach(element => {
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
				super_positions: this.shapes.super_positions,
				bars: this.shapes.bars.map(bar => Bar.deserialize(bar)),
				gf: this.shapes.gf.map(gfi => Gravitational_field.deserialize(gfi)),
				lb: this.shapes.lb.map(lbi => linear_bond.deserialize(lbi))

			};
			this.shapes.super_positions = this.shapes.super_positions.map(sp => SuperPosition.deserialize(this.shapes.vectors, sp));
		} else {
			this.shapes = {};
			["points", "lines", "triangles", "vectors", "forces", "super_positions", "bars", "gf", "lb"].forEach(element => {
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
		window.get_bars = this.getBars.bind(this);
		window.get_gravitations = this.getGravitationalFields.bind(this);
		window.get_bonds = this.getLinearBonds.bind(this);
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
		} else if (shape instanceof Bar) {
			this.shapes.bars.push(shape);
		} else if (shape instanceof Gravitational_field) {
			this.shapes.gf.push(shape);
		} else if (shape instanceof linear_bond) {
			this.shapes.lb.push(shape);
		} else {
			console.log(shape);
			throw new Error("Unknown shape type" + shape);
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
	getBars() {
		return this.shapes.bars;
	}
	getGravitationalFields() {
		return this.shapes.gf;
	}
	getLinearBonds() {
		return this.shapes.lb;
	}
}