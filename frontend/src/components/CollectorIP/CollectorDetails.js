import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CollectorList from "./CollectorList";

const CollectorDetails = () => {
    const {id} = useParams();
	useEffect(() => {
		if(id !== 0){
        	fetch(`${process.env.REACT_APP_BACKEND_URL}/collectors/view/${id}`).then( res => res.json() ).then( data => {setCollectorValue(data.collector)});
		}else{
			resetForm();
		}
		fetch(`${process.env.REACT_APP_BACKEND_URL}/collectors`).then( res => res.json() ).then( data => {setCollectorList(data.collectorList)});
    },[id]);

	const [collectorId, setCollectorId] = useState('');
	const [collectorName, setCollectorName] = useState('');
	const [collectorIP, setCollectorIP] = useState('');
	const [collectorPort, setCollectorPort] = useState('');
	const [message, setMessage] = useState({color: null, text : null});
	const [isLoading, setIsLoading] = useState(false);
	const [collectorList, setCollectorList] = useState([]);
	const IP_REGEX = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	const PORT_REGEX = /^\d{4,5}$/;
	const navigate = useNavigate();

	const setCollectorValue = (data) => {
		setCollectorName(data.collectorName);
		setCollectorIP(data.collectorIP);
		setCollectorPort(data.collectorPort);
		setCollectorId(data._id); 
		setIsLoading(false)
	}

	const saveCollector = () => {
		if(validateForm()){
			setIsLoading(true);

			const collectorObj = {
				collectorName, 
				collectorIP,
				collectorPort
			}

			if(collectorId){
				collectorObj.collectorId = collectorId;
			}

			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(collectorObj)
			};

			if(collectorId){
				fetch(`${process.env.REACT_APP_BACKEND_URL}/collectors/update`, requestOptions).then( res => res.json() ).then( data => handleData(data));
			}else{
				fetch(`${process.env.REACT_APP_BACKEND_URL}/collectors/save`, requestOptions).then( res => res.json() ).then( data => handleData(data));
			}
		}
	}

	const handleData = (data) => {
		if(data.collector){
			setMessage(prev => {prev.color = 'green'; prev.text = data.message; return prev;});
			fetch(`${process.env.REACT_APP_BACKEND_URL}/collectors`).then( res => res.json() ).then( data => {setCollectorList(data.collectorList)});
			resetForm();
		}else{
			setMessage(prev => {prev.color = 'red'; prev.text = data.message; return prev;})
		}
		setIsLoading(false);
	}

	const resetForm = () => {
		setCollectorName('');
		setCollectorIP('');
		setCollectorPort('');
		setCollectorId(0);
		navigate('/collectors/0');
	}

	const validateForm = () => {
		if(!collectorName.trim()){
			setMessage({color : 'red', text : 'Enter collector name'});
			return false;
		}
		if(!IP_REGEX.test(collectorIP)){
			setMessage({color : 'red', text : 'Invalid IP address'});
			return false;
		}
		if(!PORT_REGEX.test(collectorPort)){
			setMessage({color : 'red', text : 'Invalid Port'});
			return false;
		}
		return true;
	}

    return (
		<div>
        <div className="col-sm-9">
		<div className = "row">
			<div className ="col-lg-6 col-md-6 col-sm-6 container justify-content-center card">
				<h2 className = "text-left"> Create New Log Collector </h2>
				<div className = "card-body">
						<div className ="form-group">
							<label> Log Collector Name </label>
							<input
							type = "text"
							name = "name"
							value={collectorName}
							onChange={e => setCollectorName(e.target.value)}
							className = "form-control"
							placeholder="Enter Log Collector Name" 
							disabled={collectorId}
							/>
						</div>
						
						<div className ="form-group">
							<label> Collector IP </label>
							<input
							type = "text"
							name = "collectorIp"
							value={collectorIP}
							onChange={e => setCollectorIP(e.target.value)}
							className = "form-control"
							placeholder="Enter Log Collector Ip" 
							/>
						</div>
						
						<div className ="form-group">
							<label> Collector Port </label>
							<input
							type = "text"
							name = "collectorPort"
							value={collectorPort}
							onChange={e => setCollectorPort(e.target.value)}
							className = "form-control"
							placeholder="Enter Log Collector Port" 
							/>
						</div>
						
						<div className = "box-footer">
							<button className = "btn btn-primary" onClick={saveCollector}>
								Submit
							</button>
							<button className="btn btn-outline-warning" onClick={() => {resetForm(); navigate('/collectors/0')}}>Cancel</button>
						</div>
						</div>
						{ message.text &&
							<div style={{color:message.color}}>{message.text}</div>
						}
			</div>
		</div>
	</div>
		<CollectorList collectorList={collectorList} />
	</div>
    );
}

export default CollectorDetails;