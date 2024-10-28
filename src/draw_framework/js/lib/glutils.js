import { VSHADER_SOURCE, FSHADER_SOURCE } from "./shaders";

class glutils {
	constructor() {
		this.update = this.update.bind(this);
		this.canvas = document.getElementById("glcanvas");
		this.textDiv = document.getElementById("textdiv");
		this.checkWebGL();
		this.gl.clearColor(0, 1, 1, 1);
		var vertexShader = this.getShader(this.gl.VERTEX_SHADER, VSHADER_SOURCE);
		var fragment_shader = this.getShader(this.gl.FRAGMENT_SHADER, FSHADER_SOURCE);
		this.createProgram(vertexShader, fragment_shader);
		window.addEventListener('resize', this.update);
		this.update();
	}
	checkWebGL() {
		var contexts = ["webgl2", "experimental-webgl", "webkit-3d", "moz-webgl"];
		for (var i=0; i < contexts.length; i++) {
			try {
				this.gl = this.canvas.getContext(contexts[i]);
			} catch(e) {}
			if (this.gl) {
				break;
			}
		}
		if (!this.gl) {
			alert("WebGL not available, sorry! Please use a new version of Chrome or Firefox.");
		}
	}
	createProgram(vertexShader, fragmentShader) {
		this.program = this.gl.createProgram();
		
		this.gl.attachShader(this.program, vertexShader);
		this.gl.attachShader(this.program, fragmentShader);
		this.gl.linkProgram(this.program);

		if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
			var error = this.gl.getProgramInfoLog(this.program);
			console.log('Failed to link program: ' + error);
			this.gl.deleteProgram(this.program);
			this.gl.deleteShader(fragmentShader);
			this.gl.deleteShader(vertexShader);
		}
		this.gl.useProgram(this.program);
	}

	getShader(type,source) {
		var shader = this.gl.createShader(type);
		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			console.log("An error occurred compiling the shaders:" + this.gl.getShaderInfoLog(shader));
			this.gl.deleteShader(shader);
			return null;
		}
		return shader;
	}

	update() {
		this.canvas.width = document.body.clientWidth;
		this.canvas.height = window.innerHeight;
		this.textDiv.width = document.body.clientWidth;
		this.textDiv.height = window.innerHeight;
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	}

}

export default glutils;