import React, { useState, useEffect } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import Main from './menu_views/main';
import '../css/objects_menu.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Menu = () => {
	// Stan do kontrolowania widoczności paska bocznego
	const [show, setShow] = useState(false);
	const [permanent, setPermanent] = useState(false);

	const handleClose = () => {
	setShow(false);
	
	}
	const handleShow = () => {
		setShow(true);
	}

	const handleCheckboxChange = () => {
		setPermanent(!permanent);
		if (!permanent) document.body.classList.add('offcanvas-open');
		else document.body.classList.remove('offcanvas-open');
		window.dispatchEvent(new Event('resize'));
	};

	const [viewStack, setViewStack] = useState([]);
	
	const goBack = () => {
        setViewStack((prev) => prev.slice(0, prev.length - 1)); // Usuń ostatni widok
    };

	const addViewToStack = (view) => {
		setViewStack((prev) => [...prev, view]);
	};	
	// Dodaj domyślny widok Main do stacku, kiedy offcanvas się otworzy
	const renderActiveView = () => {
		if (viewStack.length === 0) {
		    addViewToStack(<Main setActiveView={addViewToStack} />); // Dodaj Main do stacku
		}
		return viewStack[viewStack.length - 1]; // Renderuj ostatni widok
	};
	const handleClick = () => {
		window.save();
	}

	return (
		<>
			<Button variant="primary" onClick={handleShow} className="close-btn">
				Otwórz pasek boczny
			</Button>

			<Offcanvas 
				show={show} 
				onHide={handleClose} 
				placement="end" 
				backdrop={!permanent}
				keyboard={!permanent}
				id="sidebar"
			>
				<Offcanvas.Header>
					<Button variant="secondary" onClick={goBack} children="Powrót" className='me-3'/>
					<div className="switch-container">
						<label style={{ marginRight: '10px', cursor: 'pointer' }} htmlFor="permament-sidebar">
							Zostaw otwarte
						</label>
						<label className="switch">
							<input
								type="checkbox"
								checked={permanent}
								onChange={handleCheckboxChange}
								id="permament-sidebar"
							/>
							<span className="slider"></span>
						</label>
					</div>
					<Button variant="secondary" onClick={handleClick} children="Zapisz" className='ms-1'/>
				</Offcanvas.Header>
				<hr className='m-0'></hr>
				<Offcanvas.Body>
					{renderActiveView()}
				</Offcanvas.Body>
			</Offcanvas>
		</>
	);
};

export default Menu;
