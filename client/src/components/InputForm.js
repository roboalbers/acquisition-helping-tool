import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Row, Col, Form, Button } from "react-bootstrap";

const InputForm = ({ onCreate, locations, validated, isNotChecked }) => {
	const [formData, setFormData] = useState({
		title: null,
		client: null,
		accountManager: null,
		location: [],
	});
	const formRef = useRef(null);
	useEffect(() => {
		if (validated) {
			setFormData({
				title: null,
				client: null,
				accountManager: null,
				location: [],
			});
		}
	}, [validated])
	const handleInputChange = (e) => {
		const { checked, type, name, value } = e.target;
		if (type === "checkbox") {
			if (checked) {
				//Add new entry to the location.
				setFormData({ ...formData, location: [...formData.location, name] });
			} else {
				//Filter the remaining locations, not equal to the location unchecked.
				setFormData({
					...formData,
					location: formData.location.filter((city) => city !== name),
				});
			}
		} else {
			//Input value, add value or null.
			setFormData({ ...formData, [name]: value ? value : null });
		}
	};
	return (
		<div className="app-form">
			<h4 className="mb-5">Add new job</h4>
			<Form
				ref={formRef} validated={validated}
				onSubmit={(e) => {

					onCreate(e, formData, formRef)
				}}
				onKeyPress={(e) => {
					if (e.key === "Enter") {
						onCreate(e, formData, formRef);
					}
				}}
			>
				<Row className="mb-1">
					<Col>
						<Form.Label>Title</Form.Label>
						<Form.Control
							className="app-form-control"
							name="title"
							placeholder="E.g .NET developer"
							onChange={handleInputChange}
							required
						/>
					</Col>
					<Col>
						<Form.Label>Client</Form.Label>
						<Form.Control
							className="app-form-control"
							name="client"
							placeholder="Client AB"
							onChange={handleInputChange}
							required
						/>
					</Col>
				</Row>
				<Row className="mb-5">
					<Col>
						<Form.Label>Account manager</Form.Label>
						<Form.Control
							className="app-form-control"
							type="email"
							name="accountManager"
							placeholder="example@example.com"
							onChange={handleInputChange}
							required
						/>
					</Col>
					<Col></Col>
				</Row>
				<Row className="mb-5">
					<Form.Label>Location</Form.Label>
					<Col>
						{locations.map((value, index) => {
							return (
								<Form.Check
									key={index}
									inline="true"
									type="checkbox"
									isInvalid={isNotChecked}
									feedback="Hello"
									label={value}
									name={value}
									onChange={handleInputChange}
									id={`${value}Checkbox`}
								/>
							);
						})}
					</Col>
				</Row>
				<Row className="mb-5">
					<Col>
						<Button variant="outline-secondary" type="submit">
							Create
						</Button>
					</Col>
				</Row>
			</Form>
		</div >
	);
};
InputForm.defaultProps = {
	onCreate: () => {
		return console.log("Missing prop for Inputform");
	},
	locations: [],
	validated: false,
	isNotChecked: false
};
InputForm.propTypes = {
	onCreate: PropTypes.func,
	locations: PropTypes.array,
	validated: PropTypes.bool,
	isNotChecked: PropTypes.bool
};
export default InputForm;
