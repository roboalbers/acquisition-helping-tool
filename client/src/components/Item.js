import React from "react";
import PropTypes from "prop-types";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
const Item = ({ index, job, onDelete }) => {
	return (
		<Accordion.Item eventKey={index}>
			<Accordion.Header as="div" className="app-accordion-header">
				<div className="app-accordion-header__title">
					<h5>{job.title}</h5>
				</div>
				<div className="app-accordion-header__subtitle">
					{job.location.length > 0 && job.location.map((city, index) => (
						<span key={index}>{city}{job.location.length - 1 !== index ? ", " : ""}</span>
					))}
				</div>
			</Accordion.Header>
			<Accordion.Body>
				<p>Client: {job.client}</p>
				<a href={`mailto:${job.accountManager}`}>{job.accountManager}</a>
				<div style={{ textAlign: "right" }}>
					<Button variant="outline-danger" data-guid={job.id} onClick={() => onDelete(job.id)}>Delete</Button>
				</div>
			</Accordion.Body>
		</Accordion.Item>
	)
}

Item.defaultProps = {
	index: 0,
	job: {},
	onDelete: () => { return console.log("Missing property onDelete.") }
}
Item.propTypes = {
	index: PropTypes.number,
	job: PropTypes.object.isRequired,
	onDelete: PropTypes.func
}

export default Item;
