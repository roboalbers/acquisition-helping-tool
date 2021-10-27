import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Items from "./components/Items";
import InputForm from "./components/InputForm";
import config from "./config/config";
import "./scss/App.scss";

const getFilteredJobs = async (cities) => {
	try {
		const result = await fetch(`${config.SERVER_URL}/jobs`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(cities),
		});
		const jsonData = await result.json();
		return jsonData;
	} catch (err) {
		console.error(err);
		return [];
	}
};
const fetchJobs = async () => {
	try {
		const result = await fetch(`${config.SERVER_URL}/`, {});
		const jsonData = await result.json();
		return jsonData;
	} catch (err) {
		console.error(err);
		return [];
	}
};

function App() {

	const availableLocations = ["Stockholm", "Halmstad", "Malmö"];

	const [jobs, setJobs] = useState([]);
	const [locations, setLocations] = useState([]);
	const [validated, setValidated] = useState(false);
	const [isNotChecked, setIsNotChecked] = useState(false);

	useEffect(() => {
		const getJobs = async () => {
			const data = await fetchJobs();
			setJobs(data);
		};
		getJobs();
	}, []);
	useEffect(() => {
		const filterJobs = async (cities) => {
			const data = await getFilteredJobs(cities);
			setJobs(data);
		};
		filterJobs(locations);
	}, [locations]);

	const onCreate = async (e, formData, formRef) => {
		e.preventDefault();
		if (formData.location.length > 0) {
			const result = await fetch(`${config.SERVER_URL}/add-job`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			})
				.then((response) => response.json())
				.catch(() => {
					console.error("Error when trying to connect to server...");
				});
			setJobs(origJobs => ([...origJobs, result]));
			setIsNotChecked(false);
			setValidated(true);
			handleReset(formRef);
		}
		else {
			setValidated(false);
			setIsNotChecked(true);
			return false;
		}
	};
	const deleteJob = async (guid) => {
		try {
			const result = await fetch(`${config.SERVER_URL}/job/${guid}`, {
				method: "DELETE",
			});
			await result.json();
			setJobs(origJobs => origJobs.filter((job) => job.id !== guid));
		} catch (err) {
			console.error(err);
			return [];
		}
	};
	const handleReset = (ref) => {
		ref.current.reset();
		setValidated(false);
	};
	const onFilterChange = (e) => {
		const { checked, name } = e.target;
		if (checked) {
			//Add new entry to the location.
			setLocations(origLocations => ([...origLocations, name]));
		} else {
			//Filter the remaining locations, not equal to the location unchecked.
			setLocations(origLocations => (origLocations.filter((city) => city !== name)));
		}
	};

	return (
		<>
			<Container className="app-container">
				<Row className="mt-5">
					<Col xs={12} md={7} className="pb-5">
						<Row className="mb-5">
							<Form.Label>Location</Form.Label>
							<Col>
								{availableLocations.map((value, index) => {
									return (
										<Form.Check
											key={index}
											inline="true"
											type="checkbox"
											label={value}
											name={value}
											onChange={onFilterChange}
											id={`${value}FilterCheckbox`}
										/>
									);
								})}
							</Col>
						</Row>
						{jobs.length > 0 ? (
							<Items jobs={jobs} onDelete={deleteJob} />
						) : (
							<div className="m-3">
								<div className="d-flex align-items-center bd-highlight">
									<div className="box w-100">
										<h3>
											<em>No Jobs to show...</em>
										</h3>
									</div>
								</div>
							</div>
						)}
					</Col>
					<Col xs={12} md={5}>
						<InputForm onCreate={onCreate} locations={availableLocations} validated={validated} isNotChecked={isNotChecked} />
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default App;
