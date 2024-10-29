const Editor = ({ObjectType, ObjectSetter}) => {
	return (
		<>
			<ObjectChanger ObjectType={ObjectType} ObjectSetter={ObjectSetter}/>
		</>
	);
}

const ObjectChanger = ({ObjectType, ObjectSetter}) => {
	const Objects = new Set();
	switch(ObjectType) {
		case 'Point':
			window.get_points().forEach(point => Objects.add(point));
			window.get_lines().forEach(line => {
				Objects.add(line.start);
				Objects.add(line.end);
			});
			break;
		case 'Line':
			window.get_lines().forEach(line => Objects.add(line));
			break;
		case 'Vector':
			window.get_vectors().forEach(vector => Objects.add(vector));
	}

	const arr = Array.from(Objects).map((object, index) => (
		<div className="menu-item" key={index} onClick={() => {ObjectSetter(object); window.refresh();}}>
			<p>{object.name}</p>
		</div>
	));
	return <>{arr}</>;
}

export default Editor;
