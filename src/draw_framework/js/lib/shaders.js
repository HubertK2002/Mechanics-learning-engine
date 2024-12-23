export const VSHADER_SOURCE = `#version 300 es
in vec2 a_position;
uniform vec2 relative_start;

uniform vec2 u_rotation;
uniform vec2 u_resolution;

void main() {
	vec2 posedit = a_position - relative_start;

	vec2 rotatedPosition = vec2(
		posedit.x * u_rotation.y + posedit.y * u_rotation.x,
		posedit.y * u_rotation.y - posedit.x * u_rotation.x);
	rotatedPosition.x += relative_start.x;
	rotatedPosition.y += relative_start.y;
	vec2 zeroToOne = rotatedPosition / u_resolution;
	gl_Position = vec4(zeroToOne, 0, 1);
	gl_PointSize = 4.0;
}
`;

export const FSHADER_SOURCE = `#version 300 es
	precision highp float;
	uniform vec4 u_color;
	out vec4 outColor;

	void main() {
		outColor = u_color;
	}
`;