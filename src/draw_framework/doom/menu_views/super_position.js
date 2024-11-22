import { useState, useEffect } from 'react';
import { Vector as MathVector, Point as MathPoint, Line as MathLine, SuperPosition as MathSuperPosition } from '../../js/lib/drawing_elements';
import { PointEditor } from './points';
import Button from 'react-bootstrap/Button';
import Editor from './edit';

class SelectedSuperPosition {
	constructor(superPosition, index) {
		this.superPosition = superPosition;
		this.index = index;
		this.super_position_changed = true;
	}
}

const SuperPositionEditor = ({ SelectedSuperPosition, refresherParent, refreshParent }) => {
	const DeleteSuperPosition = () => {
		window.get_super_positions().splice(SelectedSuperPosition.index, 1);
		refreshParent(refresherParent + 1);
		window.refresh();
	}

	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === "name") {
			SelectedSuperPosition.superPosition.name = value;
		}

		refreshParent(refresherParent + 1);
	};

	return (
		<div className="editor">
			<div className="sp-editor">
				<label>
					Name: 
					<input 
						name="name" 
						value={SelectedSuperPosition.superPosition.name} 
						onChange={handleChange}
						className='w-100'
					/>
				</label>
				<Button variant="danger" onClick={DeleteSuperPosition}>Usuń</Button>
			</div>
		</div>
	);
}

const SuperPosition = ({ setActiveView }) => {
	const [selectedSuperPosition, setSelectedSuperPosition] = useState(null);
	const [superPositions, setSuperPositions] = useState(window.get_super_positions()); 
	const [refresher, refresh] = useState(1);
	const renderSuperPositions = () => {
		if (!Array.isArray(superPositions)) {
			return null;
		}

		return superPositions.map((sp, index) => (
			<div className="menu-item" key={index} onClick={() => setSelectedSuperPosition(new SelectedSuperPosition(sp, index))}>
				{sp.name}
			</div>
		));
	};

	const AddSuperPosition = () => {
		window.add_object(new MathSuperPosition());
		refresh(refresher + 1);
	}

	const AddVector = (vector) => {
		selectedSuperPosition.superPosition.add(vector);
	}

	const SPVectors = () => {
		const [refresher, refresh] = useState(1);
		var arr = selectedSuperPosition.superPosition.Vectors.map((object, index) => (
			<div className="menu-item" key={index} onClick={() => {DeleteSpVector(index, refresh, refresher)}}>
				<p>{object.name}</p>
			</div>
		));
		return <>{arr}</>;
	}

	const SetStartPoint = (point) => {
		selectedSuperPosition.superPosition.start_point = point;
	}

	const DeleteSpVector = (index, refreshParent, refresherParent) => {
		selectedSuperPosition.superPosition.Vectors.splice(index, 1);
		refreshParent(refresherParent + 1);
		window.refresh();
	}

	return (
		<>
			<div className="d-flex w-100 h-100">
				<div className="d-flex w-50 h-100 flex-column">
					{renderSuperPositions()}
				</div>

				<div className="d-flex w-50 h-100 flex-column">
					{selectedSuperPosition ? (
						<>
							<SuperPositionEditor SelectedSuperPosition={selectedSuperPosition} refreshParent={refresh} refresherParent={refresher} />
							<div className="menu-item m-10" onClick={() => setActiveView(<><Editor ObjectType={'SuperPosition'} ObjectSetter={AddVector}/></>)}>
								Edytuj
							</div>
							<div className="menu-item m-10" onClick={() => setActiveView(<><SPVectors/></>)}>
								Usuń Wektor
							</div>
							<div className="menu-item m-10" onClick={() => setActiveView(<><Editor ObjectType={'Point'} ObjectSetter={SetStartPoint}/></>)}>
								Ustaw punkt startu
							</div>
						</>
					) : (
						<p>Wybierz Wektor do edycji</p>
					)}
					<div className="menu-item m-10" onClick={AddSuperPosition}>
						Dodaj superPozycje
					</div>
				</div>
			</div>
		</>
	);
};


export default SuperPosition;