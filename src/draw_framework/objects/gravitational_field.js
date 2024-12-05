import "../math/vec3";
import { Base } from "./base";
import { Vector } from "../js/lib/drawing_elements";

export class Gravitational_field extends Base {
	constructor(gravitaionVector) {
		super();
		this.gravitaionVector = gravitaionVector;
		this.name = "Grawitacja";
	}

	static deserialize(obj) {
		var gravitaionVector = Vector.deserialize(obj.gravitaionVector);
		gravitaionVector.name = obj.name;
		return new Gravitational_field(gravitaionVector);
	}
}