import { useState, useEffect } from 'react';
import { Point as MathPoint } from '../../js/lib/drawing_elements';
import Button from 'react-bootstrap/Button';

const PointEditor = ({ SelectedPoint, refresherParent, refreshParent }) => {
	useEffect(() => {
		window.refresh();
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === 'x') {
			SelectedPoint.point.x = value;
			refreshParent(refresherParent+1);
		} else if (name === 'y') {
			SelectedPoint.point.y = value;
			refreshParent(refresherParent+1);
		} else if (name === "name") {
			SelectedPoint.point.name = value;
			refreshParent(refresherParent+1);
		}
	};

	const deletePoint = () => {
		window.get_points().splice(SelectedPoint.index, 1);
		refreshParent(refresherParent + 1);
	}

	return (
		<div className="editor">
			<label>
				X: 
				<input 
					name="x" 
					value={SelectedPoint.point.x} 
					onChange={handleChange}
					className='w-100'
				/>
			</label>
			<label>
				Y: 
				<input 
					name="y" 
					value={SelectedPoint.point.y} 
					onChange={handleChange}
					className='w-100'
				/>
			</label>
			<label>
				Name: 
				<input 
					name="name" 
					value={SelectedPoint.point.name} 
					onChange={handleChange}
					className='w-100'
				/>
			</label>
			<Button variant="danger" onClick={deletePoint}>Usuń</Button>
		</div>
	);
};

class SelectedPoint {
	constructor(point, index) {
		this.point = point;
		this.index = index;
	}
}

const Point = () => {
	const [selectedPoint, setSelectedPoint] = useState(null);
	const [points, setPoints] = useState(window.get_points()); 
	const [refresher, refresh] = useState(1);
	const renderPoints = () => {
		if (!Array.isArray(points)) {
			return null;
		}

		return points.map((point, index) => (
			<div className="menu-item" key={index} onClick={() => setSelectedPoint(new SelectedPoint(point, index))}>
				<p>{point.x}, {point.y}</p>
			</div>
		));
	};

	const AddPoint = () => {
		window.add_object(new MathPoint(0,0));
		refresh(refresher + 1);
	}

	return (
		<>
			<div className="d-flex w-100 h-100">
				{/* Lista punktów */}
				<div className="d-flex w-50 h-100 flex-column">
					{renderPoints()}
				</div>

				{/* Editor dla wybranego punktu */}
				<div className="d-flex w-50 h-100 flex-column">
					{selectedPoint ? (
						<PointEditor SelectedPoint={selectedPoint} refreshParent={refresh} refresherParent={refresher} />
					) : (
						<p>Wybierz punkt do edycji</p>
					)}
					<div className="menu-item m-10" onClick={AddPoint}>
						Dodaj punkt
					</div>
				</div>
			</div>
		</>
	);
};


export default Point;