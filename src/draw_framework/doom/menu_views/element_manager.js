import { useState, useEffect, useRef } from 'react';
import { Point, Line, Triangle, Vector, Force, SuperPosition } from '../../js/lib/drawing_elements';
import Button from 'react-bootstrap/Button';
import { Bar } from '../../objects/bar';
import { Gravitational_field } from '../../objects/gravitational_field';
import { linear_bond } from '../../objects/bonds/linear_bond';
import { line_cross_points } from '../../js/lib/lines_cross_point';

function isPrimitive(value) {
	const type = typeof value;

	if (
		type === 'string' ||
		type === 'number' ||
		type === 'boolean'
	) {
		return true;
	}

	return false;
}

class SelectedElement {
	constructor(element, index) {
		this.element = element;
		this.index = index;
		this.changed = true;
	}
}

const TextInput = ({customKey, element, handleChange}) => {
	const [refresher, refresh] = useState(1);
	return <label key={customKey}>
		{customKey}:
		<input
			name={customKey}
			value={element[customKey]}
			onChange={(event) => {
				handleChange(event.target.name, event.target.value); 
				refresh(refresher + 1)}}
			className="w-100"
		/>
	  </label>
}

const BoolInput = ({customKey, element, handleChange}) => {
	const [refresher, refresh] = useState(1);
	return <label>
		{customKey}: 
		<input 
			type="checkbox" 
			name={customKey} 
			checked={element[customKey]} 
			onChange={(event) => {
				handleChange(event.target.name, event.target.checked); 
				refresh(refresher + 1)}}/>
	</label>
	
}

const ObjectChanger = ({Element, parent}) => {
	const Objects = new Set();
	const ObjectSetter = (object) => {
		Element.set(object);
	}
	switch(Element.constructor.name) {
		case 'Point':
			window.get_points().forEach(point => Objects.add(point));
			window.get_lines().forEach(line => {
				if(!parent.contains(line.start))
					Objects.add(line.start);
				if(!parent.contains(line.end))
					Objects.add(line.end);
			});
			break;
		case 'Line':
			window.get_lines().forEach(line => Objects.add(line));
			break;
		case 'Vector':
			window.get_vectors().forEach(vector => Objects.add(vector));
			break;
		case 'SuperPosition':
			window.get_vectors().forEach(vector => Objects.add(vector));
			break;
		default:
			break;
	}

	const arr = Array.from(Objects).map((object, index) => (
		<div className="menu-item" key={index} onClick={() => {ObjectSetter(object); window.refreshScene();}}>
			<p>{object.name}</p>
		</div>
	));
	return <>{arr}</>;
}

const ElementEditor = ({element, refresherParent, refreshParent, setActiveView, parent}) => {
	const [Arr, setArr] = useState([]);

	useEffect(() => {
		const arra = Object.entries(element).map(([key, value]) => {
			if (isPrimitive(value)) {
				switch(typeof(value)) {
					case 'string':
					case 'number':
						return <TextInput key={key} element={element} handleChange={handleChange} customKey={key}/>;
					case 'boolean':
						return <BoolInput key={key} element={element} handleChange={handleChange} customKey={key}/>;
				}
			}
			else {
				switch(typeof value) {
					default:
						return <div key={key} className="w-75 d-flex flex-column" style={{margin: '0px auto'}}>
								<Button 
									key={key}
									variant="light" 
									name="ElementEditor" 
									onClick={ () =>
										setActiveView(<><ElementEditor 
											element={value}
											refreshParent={refreshParent}
											refresherParent={refresherParent}
											setActiveView={setActiveView}
											/><h5>Skopiuj parametry z wybranego obiektu</h5><ObjectChanger Element={value} parent={element}/></>)
										} 
									style={{margin: "3px 0"}}>{key}
								</Button>
							</div>
				}
			}
		});
			setArr(arra);
	}, [element]);

	const handleChange = (name, value) => {
		element[name] = value;
		refreshParent((prev) => prev + 1);
		window.refreshScene();
	}

	return <div className="editor">{Arr}</div>
}

const ElementDeleter = ({ index, refresherParent, refreshParent, elements }) => {
	useEffect(() => {
		window.refreshScene();
	});

	const deleteElement = () => {
		elements.splice(index, 1);
		refreshParent(refresherParent + 1);
	}
	return (<Button variant="danger" onClick={deleteElement} className="w-75" style={{margin: "5px auto"}}>Usuń</Button>)
}

const getElementContainer = (elementType) => {
	switch(elementType) {
		case 'Point':
			return window.get_points();
		case 'Line':
			return window.get_lines();
		case 'Vector':
			return window.get_vectors();
		case 'Force':
			return window.get_forces();
		case 'SuperPosition':
			return window.get_super_positions();
		case 'Bar':
			return window.get_bars();
		case 'Gravity':
			return window.get_gravitations();
		case 'Bonds':
			return window.get_bonds();
	}
}

const Element = ({elementType, setActiveView}) => {
	const [selectedElement, setSelectedElement] = useState(null);
	const [refresher, refresh] = useState(1);
	const getElements = () => getElementContainer(elementType)

	const [elements, setElements] = useState(getElements(elementType)); 

	const AddElement = () => {
		var obj;
		switch(elementType) {
			case 'Point':
				obj = new Point(0,0);
				break;
			case 'Line':
				obj = new Line(new Point(-1,-1), new Point(1,1));
				break;
			case 'Vector':
				obj = Vector.default();
				break;
			case 'Force':
				obj = Force.default();
				break;
			case 'SuperPosition':
				obj = new SuperPosition();
				break;
			case 'Bar':
				obj = new Bar(new Point(0,0), Vector.default());
				break;
			case 'Gravity':
				obj = new Gravitational_field(Vector.default());
				break;
			case 'Bonds':
				obj = new linear_bond(Vector.default());
				break;
		}
		window.add_object(obj);
		refresh(refresher + 1);
	}

	const renderElements = () => {
		if (!Array.isArray(elements)) {
			return null;
		}

		return elements.map((element, index) => (
			<div className="menu-item" key={index} onClick={() => setSelectedElement(new SelectedElement(element, index))}>
				<p>{element.name}</p>
			</div>
		));
	};

	return (
		<>
			<div className="d-flex w-100 h-100">
				{/* Lista punktów */}
				<div className="d-flex w-50 h-100 flex-column">
					{renderElements()}
				</div>

				{/* Editor dla wybranego punktu */}
				<div className="d-flex w-50 h-100 flex-column">
					{selectedElement ? (
						<>
							<ElementEditor element={selectedElement.element} refreshParent={refresh} refresherParent={refresher} setActiveView={setActiveView}/>
							<ElementDeleter index={selectedElement.index} refreshParent={refresh} refresherParent={refresher} elements={elements} />
						</>
					) : (
						<p>Wybierz element do edycji</p>
					)}
					<div className="menu-item m-10" onClick={AddElement}>
						Dodaj element
					</div>
				</div>
			</div>
		</>
	);

}

export default Element;