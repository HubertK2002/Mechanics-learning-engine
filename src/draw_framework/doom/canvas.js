import '../css/style.css';
import glutils from '../js/lib/glutils.js';
import draw from '../js/lib/draw.js';
import { update } from '../js/lib/update.js';

import React, { useEffect, useRef } from 'react';

function Canvas() {
	const canvasRef = useRef(null);
	const gl = useRef(null);
	const dr = useRef(null);
	const up = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		gl.current = new glutils(canvas);
		dr.current = new draw(gl);
		up.current = new update();

	}, []);

	return (
		<div>
			<canvas id="glcanvas" ref={canvasRef}></canvas>
			<div id="textdiv"><p>test</p></div>
		</div>
	);
}

export default Canvas;
