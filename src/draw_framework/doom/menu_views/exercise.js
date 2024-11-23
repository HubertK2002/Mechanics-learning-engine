import { useState, useEffect } from 'react';
import Elements from './elements';
import { ShapeContainer } from '../../js/lib/drawing_elements';

const Exercise = ({ exerciseName, setActiveView  }) => {
	const [CurrentStep, SetCurrentStep] = useState(null);
	const [refresher, refresh] = useState(1);
	const [drawChangeName, setDrawChangeName] = useState(false);
	const ExerciseName = exerciseName;
	const [SP, setSP] = useState(null);
	var steps = JSON.parse(localStorage.getItem(exerciseName));
	if(steps == null) {
		steps = Array();
	}

	const Steps_render = () => {
		return steps.map((step, index) => (
			<div className="menu-item" key={index} onClick={() => SetCurrentStep(index)}>
				{step}
			</div>
		));
	}

	const AddStep = () => {
		steps.push("");
		localStorage.setItem(exerciseName, JSON.stringify(steps));
		refresh(refresher + 1);
	}

	const EditStep = () => {
		if(CurrentStep != null) {
			setSP(new ShapeContainer(exerciseName + CurrentStep));
			setActiveView(<Elements setActiveView={setActiveView}/>)
			window.refreshScene();
		}
	}

	const ChangeName = () => {
		setDrawChangeName(!drawChangeName);
	}

	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === "name") {
			steps[CurrentStep] = value;
			localStorage.setItem(exerciseName, JSON.stringify(steps));
		}

		refresh(refresher + 1);
	}

	const ChangeNameElement = () => {
		return (
		<>
			<label>
				Name: 
				<input 
					name="name" 
					value={steps[CurrentStep]} 
					onChange={handleChange}
					className='w-100'
				/>
			</label>
		</>)
	}

	return <>
		<div className="d-flex w-100 h-100">
			<div className="d-flex w-50 h-100 flex-column">
				<Steps_render/>
			</div>
			<div className="d-flex w-50 h-100 flex-column">
				<div className="menu-item m-10" onClick={AddStep}>
					Dodaj krok
				</div>
				<div className="menu-item m-10" onClick={ChangeName}>
					Zmień nazwę
				</div>
				<div className="menu-item m-10" onClick={EditStep}>
					Edytuj
				</div>
				{
					drawChangeName ? (CurrentStep !== null ? (<ChangeNameElement/>) : <p>Wybierz krok do zmiany nazwy</p> ): (<></>)
				}
			</div>
		</div>
	</>
}

export default Exercise;