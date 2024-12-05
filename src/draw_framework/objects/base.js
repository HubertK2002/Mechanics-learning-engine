export class Base {
	contains(value) {
		for (const key in this) {
			if (this[key] == value) {
				return true;
			}
		}
		return false;
	}
}