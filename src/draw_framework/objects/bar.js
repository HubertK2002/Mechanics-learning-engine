import "../math/vec3";
import { Base } from "./base";
import { Point, Vector } from "../js/lib/drawing_elements";

export class Bar extends Base {
	constructor(point, LengthVector) {
		super();
		this.Position = point;
		this.Length = LengthVector;
		this.mass = 1;
		this.name ="belka";
	}

	get EndPosition() {
		var endPosition = this.Position.copy();
		endPosition.move(this.Length);
		return endPosition;
	}

	static deserialize(obj) {
		var Position = Point.deserialize(obj.Position);
		var Length = Vector.deserialize(obj.Length);
		let b = new Bar(Position, Length);
		b.mass = Number(obj.mass);
		b.name = obj.name;
		return b;
	}
}