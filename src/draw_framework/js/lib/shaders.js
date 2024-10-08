export const VSHADER_SOURCE = `
	attribute vec4 aPosition;
	void main() {
		gl_Position = aPosition;
		gl_PointSize = 5.0;
	}
`;

export const FSHADER_SOURCE = `
	void main() {
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
`;