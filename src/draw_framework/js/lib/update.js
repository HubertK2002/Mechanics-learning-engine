import { line_cross_points, in_range } from "./lines_cross_point";
import { Line } from "./drawing_elements";

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
		gravitations.forEach(gf => {
			bars.forEach(bar => {
				var collide = false;
				bonds.forEach(bond => {
					var barEndPositionCopy = bar.EndPosition.copy();
					barEndPositionCopy.move(gf.gravitaionVector);
					var crossPoint = line_cross_points.fromLines(bond.Vec.line, new Line(bar.Position, bar.EndPosition));
					console.log(in_range(crossPoint[0], bar.Position.x, barEndPositionCopy.x));
					if( !collide && in_range(crossPoint[0], bar.Position.x, bar.EndPosition.x)) {
						collide = true;
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