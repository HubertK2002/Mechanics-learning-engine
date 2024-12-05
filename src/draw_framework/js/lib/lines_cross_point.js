export const in_range = (number, r1, r2) => {
	console.log(number, r1, r2);
	if(r1 < r2)
		return number >= r1 && number <= r2;
	else
		return number >= r2 && number <= r1;
}

export class line_cross_points {
	static fromLines(line1, line2) {
		var line1_params = line_parameters_from_points.count(line1);
		var line2_params = line_parameters_from_points.count(line2);
		console.log(line1_params, line2_params);
		console.log(line1, line2);
		var variables = [[-line1_params[0], 1], [-line2_params[0], 1]];
		var results = [line1_params[1], line2_params[1]];
		var m2d = new Matrix2D(variables, results);
		return [m2d.X, m2d.Y];
	}

	static fromVectors(vec1, vec2) {
		return line_cross_points.fromLines(vec1.line, vec2.line);
	}
}

export class line_parameters_from_points {
	static count(line) {
		var a = (line.start.y - line.end.y) / (line.start.x - line.end.x)
		var b = line.start.y - a * line.start.x;
		return [a, b];
	}
} 

export class Matrix2D {
	constructor(variables, results) {
		this.variables = variables;
		this.results = results;
	}

	get determinant() {
		return this.variables[0][0] * this.variables[1][1] - this.variables[0][1] * this.variables[1][0];
	}

	get Xdeterminant() {
		return this.results[0] * this.variables[1][1] - this.results[1] * this.variables[0][1];
	}

	get Ydeterminant() {
		return this.variables[0][0] * this.results[1] - this.variables[0][1] * this.results[0];
	}

	get X() {
		return this.Xdeterminant / this.determinant;
	}

	get Y() {
		return this.Ydeterminant / this.determinant;
	}
}