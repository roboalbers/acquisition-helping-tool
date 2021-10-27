import React from "react";
import PropTypes from "prop-types";
import Accordion from "react-bootstrap/Accordion";
import Item from "./Item";

const Items = ({ jobs, onDelete }) => {
	return (
		<Accordion className="app-accordion" defaultActiveKey="0">
			{jobs.map((job, index) => (
				<Item key={index} index={index} job={job} onDelete={onDelete} />
			))}
		</Accordion>
	)
}

Items.defaultProps = {
	jobs: [],
	onDelete: () => { return console.log("Missing property onDelete.") }
}
Items.propTypes = {
	jobs: PropTypes.array.isRequired,
	onDelete: PropTypes.func
}

export default Items;
