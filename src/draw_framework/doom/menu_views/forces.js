import { useState, useEffect } from 'react';
import { Vector as MathVector, Point as MathPoint, Line as MathLine, Force as MathForce } from '../../js/lib/drawing_elements';
import { PointEditor } from './points';
import Button from 'react-bootstrap/Button';
import Editor from './edit';

class SelectedForce {
	constructor(force, index) {
		this.force = force;
		this.index = index;
		this.force_changed = true;
	}
}

const ForceEditor = ({ SelectedForce, refresherParent, refreshParent }) => {
	const deleteForce = () => {
		window.get_forces().splice(SelectedForce.index, 1);
		refreshParent(refresherParent + 1);
		window.refresh();
	}

	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === "name") {
			SelectedForce.force.name = value;
		}

		refreshParent(refresherParent + 1);
	};

	return (
		<div className="editor">
			<div className="force-editor">
				<label>
					Name: 
					<input 
						name="name" 
						value={SelectedForce.force.name} 
						onChange={handleChange}
						className='w-100'
					/>
				</label>
				<Button variant="danger" onClick={deleteForce}>Usuń</Button>
			</div>
		</div>
	);
}

const Force = ({ setActiveView }) => {
	const [selectedForce, setSelectedForce] = useState(null);
	const [forces, setForces] = useState(window.get_forces()); 
	const [refresher, refresh] = useState(1);
	const renderForces = () => {
		if (!Array.isArray(forces)) {
			return null;
		}

		return forces.map((force, index) => (
			<div className="menu-item" key={index} onClick={() => setSelectedForce(new SelectedForce(force, index))}>
				{force.name}
			</div>
		));
	};

	const AddForce = () => {
		window.add_object(MathForce.default());
		refresh(refresher + 1);
	}

	const SetDirection = (vector) => {
		selectedForce.force.direction = vector.copy();
		selectedForce.force.direction.unit();
	}

	const SetPoint = (point) => {
		selectedForce.force.point = point.copy();
	}

	return (
		<>
			<div className="d-flex w-100 h-100">
				<div className="d-flex w-50 h-100 flex-column">
					{renderForces()}
				</div>

				<div className="d-flex w-50 h-100 flex-column">
					{selectedForce ? (
						<>
							<ForceEditor SelectedForce={selectedForce} refreshParent={refresh} refresherParent={refresher} />
							<div className="menu-item m-10" onClick={() => setActiveView(<><Editor ObjectType={'Point'} ObjectSetter={SetPoint}/></>)}>
								Edytuj punkt zaczepienia
							</div>
							<div className="menu-item m-10" onClick={() => setActiveView(<><Editor ObjectType={'Vector'} ObjectSetter={SetDirection}/></>)}>
								Edytuj kierunek
							</div>
						</>
					) : (
						<p>Wybierz Siłę do edycji</p>
					)}
					<div className="menu-item m-10" onClick={AddForce}>
						Dodaj Siłę
					</div>
				</div>
			</div>
		</>
	);
};


export default Force;