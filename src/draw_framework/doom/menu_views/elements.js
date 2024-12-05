import Element from "./element_manager";

const Elements = ({ setActiveView }) => {
	return(
		<>
			<div className="d-flex w-100 h-100">
				<div className="d-flex w-50 h-100 flex-column">
					<div className="menu-item" onClick={() => setActiveView(<Element elementType={"Point"} />)}>Punkty</div>
					<div className="menu-item" onClick={() => setActiveView(<Element elementType={"Line"} setActiveView={setActiveView} />)}>Prosta</div>
					<div className="menu-item" onClick={() => setActiveView(<Element elementType={"Vector"} setActiveView={setActiveView} />)}>Wektor</div>
					<div className="menu-item" onClick={() => setActiveView(<Element elementType={"Force"} setActiveView={setActiveView} />)}>Siły</div>
					<div className="menu-item" onClick={() => setActiveView(<Element elementType={"SuperPosition"} setActiveView={setActiveView} />)}>Super pozycje</div>
					<div className="menu-item" onClick={() => setActiveView(<Element elementType={"Bar"} setActiveView={setActiveView} />)}>Belki</div>
					<div className="menu-item" onClick={() => setActiveView(<Element elementType={"Gravity"} setActiveView={setActiveView} />)}>Pola grawitacyjne</div>
					<div className="menu-item" onClick={() => setActiveView(<Element elementType={"Bonds"} setActiveView={setActiveView} />)}>Więzy</div>
				</div>
				<div className="d-flex w-50 h-100 flex-column">
					<div className="menu-item" onClick={() => {window.Play = true}}>Play</div>
					<div className="menu-item" onClick={() => {window.Play = false}}>Pause</div>
				</div>
			</div>
		</>
	);
}

export default Elements;