import { line_cross_points, in_range, line_parameters_from_points } from "./lines_cross_point";
import { Point, Line, Vector, Force } from "./drawing_elements";
import { line, perpendicular_line } from "../../objects/bonds/perpendicular_line";

export class update {
	constructor() {
		setInterval(update.upd, 200);
	}

	static upd() {
		if(!window.Play) return;
		if(!window.set_elements) return;
		var bars = window.get_bars();
		if(bars.count == 0) return;
		var gravitations = window.get_gravitations();
		var bonds = window.get_bonds();
		if(gravitations.count == 0) return;
		window.get_forces().length = 0;
		gravitations.forEach(gf => {
			bars.forEach(bar => {
				var collide = false;
				bonds.forEach(bond => {
					var barEndPositionCopy = bar.EndPosition.copy();
					barEndPositionCopy.move(gf.gravitaionVector);
					var crossPoint = line_cross_points.fromLines(bond.Vec.line, new Line(bar.Position, bar.EndPosition));
					if(in_range(crossPoint[0], bar.Position.x, bar.EndPosition.x)) {
						collide = true;
						var a = perpendicular_line.get_directional_coefficient(bond.Vec.line);
						var b = line.get_free_parameter(crossPoint, a);
						var l = line.get_line_from_parameters(a,b);
						var vector = new Vector(l);
						var f = new Force(new Point(crossPoint[0], crossPoint[1]), vector, 5);
						f.set_start_point(new Point(crossPoint[0], crossPoint[1]));
						window.add_object(f);
					}
				})
				if(!collide) {
					bar.Position.move(gf.gravitaionVector);
				}
			})
		})
		window.refreshScene();
	}
}