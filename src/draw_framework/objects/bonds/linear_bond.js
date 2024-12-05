import "../../math/vec3";
import { Base } from "../base";
import { Vector } from "../../js/lib/drawing_elements";

export class linear_bond extends Base {
	constructor(bondVector) {
		super();
		this.Vec = bondVector;
		this.name = "Więzy";
	}

	static deserialize(obj) {
		var Vec = Vector.deserialize(obj.Vec);
		Vec.name = obj.name;
		return new linear_bond(Vec);
	}
}