import { useState, useEffect } from 'react';
import { Vector as MathVector, Point as MathPoint, Line as MathLine } from '../../js/lib/drawing_elements';
import { PointEditor } from './points';
import Button from 'react-bootstrap/Button';
import Editor from './edit';

class SelectedVector {
	constructor(vector, index) {
		this.vector = vector;
		this.index = index;
		this.vector_changed = true;
	}
}

const VectorEditor = ({ SelectedVector, refresherParent, refreshParent }) => {
	const deleteVector = () => {
		window.get_vectors().splice(SelectedVector.index, 1);
		refreshParent(refresherParent + 1);
		window.refresh();
	}

	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === "name") {
			SelectedVector.vector.name = value;
		}

		refreshParent(refresherParent + 1);
	};

	return (
		<div className="editor">
			<div className="vector-editor">
				<label>
					Name: 
					<input 
						name="name" 
						value={SelectedVector.vector.name} 
						onChange={handleChange}
						className='w-100'
					/>
				</label>
				<Button variant="danger" onClick={deleteVector}>Usuń</Button>
			</div>
		</div>
	);
}

const Vector = ({ setActiveView }) => {
	const [selectedVector, setSelectedVector] = useState(null);
	const [vectors, setVectors] = useState(window.get_vectors()); 
	const [refresher, refresh] = useState(1);
	const renderVectors = () => {
		if (!Array.isArray(vectors)) {
			return null;
		}

		return vectors.map((vector, index) => (
			<div className="menu-item" key={index} onClick={() => setSelectedVector(new SelectedVector(vector, index))}>
				{vector.name}
			</div>
		));
	};

	const AddVector = () => {
		window.add_object(new MathVector(new MathLine(new MathPoint(-1,-1), new MathPoint(1,1))));
		refresh(refresher + 1);
	}

	const SetLine = (line) => {
		selectedVector.vector.line = line;
	}

	return (
		<>
			<div className="d-flex w-100 h-100">
				<div className="d-flex w-50 h-100 flex-column">
					{renderVectors()}
				</div>

				<div className="d-flex w-50 h-100 flex-column">
					{selectedVector ? (
						<>
							<VectorEditor SelectedVector={selectedVector} refreshParent={refresh} refresherParent={refresher} />
							<div className="menu-item m-10" onClick={() => setActiveView(<><Editor ObjectType={'Line'} ObjectSetter={SetLine}/></>)}>
								Edytuj
							</div>
						</>
					) : (
						<p>Wybierz Wektor do edycji</p>
					)}
					<div className="menu-item m-10" onClick={AddVector}>
						Dodaj Wektor
					</div>
				</div>
			</div>
		</>
	);
};


export default Vector;