import { line_parameters_from_points } from "../../js/lib/lines_cross_point";
import { Point, Line} from "../../js/lib/drawing_elements";

export class line {
	static get_free_parameter(point, a) {
		if(a == Infinity) return 0;
		return point.y - a * point.x;
	}

	static get_line_from_parameters(a, b) {
		if(a == Infinity) return new Line(new Point(0,0), new Point(0,5));
		var p1 = new Point(1, a * 1 + b);
		var p2 = new Point(5, a * 5 + b);
		var L = new Line(p1, p2);
		return L;
	}
}

export class perpendicular_line {
	static get_directional_coefficient(line) {
		var res = line_parameters_from_points.count(line);
		return -1/res[0];

	}
}