import '../css/style.css';
import glutils from '../js/lib/glutils.js';
import draw from '../js/lib/draw.js';
import { ShapeContainer } from '../js/lib/drawing_elements.js';

import React, { useEffect, useRef } from 'react';

function Canvas() {
	const canvasRef = useRef(null);
	const gl = useRef(null);
	const shapeContainer = useRef(null);
	const dr = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		gl.current = new glutils(canvas);
		shapeContainer.current = new ShapeContainer();
		dr.current = new draw(gl, shapeContainer);
	}, []);

	return (
		<div>
			<canvas id="glcanvas" ref={canvasRef}></canvas>
		</div>
	);
}

export default Canvas;
