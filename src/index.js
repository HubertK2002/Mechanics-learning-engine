import React from 'react';
import ReactDOM from 'react-dom/client';
import Canvas from './draw_framework/doom/canvas';
import Menu from './draw_framework/doom/menu';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
	<Canvas/>
    <Menu />
  </React.StrictMode>
);

