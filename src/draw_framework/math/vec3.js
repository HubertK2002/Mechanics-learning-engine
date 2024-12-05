export class Vec3 {
	constructor(i, j, k) {
		this.i = i;
		this.j = j;
		this.k = k;
	}

	get length() {
		Math.sqrt(this.i * this.i + this.j * this.j + this.k * this.k);
	}

	get x() {
		return this.i;
	}

	get y() {
		return this.j;
	}

	get z() {
		return this.k;
	}
}