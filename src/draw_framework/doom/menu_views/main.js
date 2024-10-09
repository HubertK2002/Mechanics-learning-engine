import Point from "./points";
import Line from "./lines";
const Main = ({ setActiveView }) => {
	return(
		<>
			<div className="d-flex w-100 h-100">
				<div className="d-flex w-50 h-100 flex-column">
					<div className="menu-item" onClick={() => setActiveView(<Point setActiveView={setActiveView} />)}>Punkt</div>
					<div className="menu-item" onClick={() => setActiveView(<Line setActiveView={setActiveView} />)}>Prosta</div>
					<div className="menu-item">Trójkąt</div>
				</div>
				<div className="d-flex w-50 h-100 flex-column">

				</div>
			</div>
		</>
	);
}

export default Main;