import Point from "./points";
import Line from "./lines";
import Vector from "./vector";
import Force from "./forces";
import SuperPosition from "./super_position";

const Elements = ({ setActiveView }) => {
	return(
		<>
			<div className="d-flex w-100 h-100">
				<div className="d-flex w-50 h-100 flex-column">
					<div className="menu-item" onClick={() => setActiveView(<Point setActiveView={setActiveView} />)}>Punkt</div>
					<div className="menu-item" onClick={() => setActiveView(<Line setActiveView={setActiveView} />)}>Prosta</div>
					<div className="menu-item">Trójkąt</div>
					<div className="menu-item" onClick={() => setActiveView(<Vector setActiveView={setActiveView} />)}>Wektor</div>
					<div className="menu-item" onClick={() => setActiveView(<Force setActiveView={setActiveView} />)}>Siły</div>
					<div className="menu-item" onClick={() => setActiveView(<SuperPosition setActiveView={setActiveView} />)}>Super Pozycje</div>
				</div>
				<div className="d-flex w-50 h-100 flex-column">

				</div>
			</div>
		</>
	);
}

export default Elements;