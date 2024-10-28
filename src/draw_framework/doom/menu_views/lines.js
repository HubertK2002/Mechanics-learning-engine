import { useState, useEffect } from 'react';
import { Point as MathPoint, Line as MathLine } from '../../js/lib/drawing_elements';
import { PointEditor } from './points';
import Button from 'react-bootstrap/Button';

class SelectedLine {
	constructor(line, index) {
		this.line = line;
		this.index = index;
		this.line_changed = true;
	}
}

const LineEditor = ({ SelectedLine, refresherParent, refreshParent }) => {
	const [selectedPoint, setSelectedPoint] = useState(null);
	useEffect(() => {
		window.refresh();
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === "name") {
			SelectedLine.line.name = value;
		} else if (name === "Start") {
			setSelectedPoint(SelectedLine.line.start);
			SelectedLine.line_changed = false;
		} else if (name === "End") {
			setSelectedPoint(SelectedLine.line.end);
			SelectedLine.line_changed = false;
		} else if (name === "draw-points") {
			SelectedLine.line.draw_points = !SelectedLine.line.draw_points;
		}

		refreshParent(refresherParent + 1);
	};

	const deleteLine = () => {
		window.get_lines().splice(SelectedLine.index, 1);
		refreshParent(refresherParent + 1);
	}

	return (
		<div className="editor">
			<div className="line-editor">
				<div className="w-75 d-flex flex-column" style={{margin: '0px auto'}}>
					<Button variant="light" name="Start" onClick={handleChange} style={{margin: "3px 0"}}>Start</Button>
					<Button variant="light" name="End" onClick={handleChange}>End</Button>
				</div>
				<label>
					Name: 
					<input 
						name="name" 
						value={SelectedLine.line.name} 
						onChange={handleChange}
						className='w-100'
					/>
				</label>
				<Button variant="danger" onClick={deleteLine}>Usuń</Button>
			</div>
			<div className="line-point-editor">
				{selectedPoint && !SelectedLine.line_changed ? (
				<PointEditor point={selectedPoint} refreshParent={refreshParent} refresherParent={refresherParent}/>
				) : ""}
			</div>
			<label>Rysuj punkty: <input type="checkbox" name="draw-points" checked={SelectedLine.line.draw_points} onChange={handleChange}/></label>
		</div>
	);
};

const Line = () => {
	const [selectedLine, setSelectedLine] = useState(null);
	const [lines, setLines] = useState(window.get_lines()); 
	const [refresher, refresh] = useState(1);
	const renderLines = () => {
		if (!Array.isArray(lines)) {
			return null;
		}

		return lines.map((line, index) => (
			<div className="menu-item" key={index} onClick={() => setSelectedLine(new SelectedLine(line, index))}>
				<p>{line.start.name}, {line.end.name}</p>
			</div>
		));
	};

	const AddPoint = () => {
		window.add_object(new MathLine(new MathPoint(-1,-1), new MathPoint(1,1)));
		refresh(refresher + 1);
	}

	return (
		<>
			<div className="d-flex w-100 h-100">
				<div className="d-flex w-50 h-100 flex-column">
					{renderLines()}
				</div>

				<div className="d-flex w-50 h-100 flex-column">
					{selectedLine ? (
						<LineEditor SelectedLine={selectedLine} refreshParent={refresh} refresherParent={refresher} />
					) : (
						<p>Wybierz linie do edycji</p>
					)}
					<div className="menu-item m-10" onClick={AddPoint}>
						Dodaj linie
					</div>
				</div>
			</div>
		</>
	);
};


export default Line;