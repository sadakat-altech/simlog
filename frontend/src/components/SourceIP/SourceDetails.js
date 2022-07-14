import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SourceList from "./SourceList";

const SourceDetails = () => {
	const {id} = useParams();
	useEffect(() => {
		if(id != 0){
        	fetch(`${process.env.REACT_APP_BACKEND_URL}/sources/view/${id}`).then( res => res.json() ).then( data => {setSourceValue(data.source)});
		}else{
			resetForm();
		}
		fetch(`${process.env.REACT_APP_BACKEND_URL}/sources`).then( res => res.json() ).then( data => {setSourceList(data.sourceList)});
    },[id]);

	const [sourceId, setSourceId] = useState('');
	const [sourceName, setSourceName] = useState('');
	const [fromIP, setFromIP] = useState('');
	const [toIP, setToIP] = useState('');
	const [message, setMessage] = useState({color: null, text : null});
	const [isLoading, setIsLoading] = useState(false);
	const [sourceList, setSourceList] = useState([]);
	const IP_REGEX = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	const navigate = useNavigate();

	const setSourceValue = (data) => {
		setSourceName(data.sourceName);
		setFromIP(data.fromIP);
		setToIP(data.toIP);
		setSourceId(data._id); 
		setIsLoading(false)
	}

	const saveSource = () => {
		if(validateForm()){
			setIsLoading(true);

			const sourceObj = {
				sourceName, 
				fromIP,
				toIP
			}

			if(sourceId){
				sourceObj.sourceId = sourceId;
			}

			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(sourceObj)
			};

			if(sourceId){
				fetch(`${process.env.REACT_APP_BACKEND_URL}/sources/update`, requestOptions).then( res => res.json() ).then( data => handleData(data));
			}else{
				fetch(`${process.env.REACT_APP_BACKEND_URL}/sources/save`, requestOptions).then( res => res.json() ).then( data => handleData(data));
			}
		}
	}

	const handleData = (data) => {
		if(data.source){
			setMessage(prev => {prev.color = 'green'; prev.text = data.message; return prev;});
			fetch(`${process.env.REACT_APP_BACKEND_URL}/sources`).then( res => res.json() ).then( data => {setSourceList(data.sourceList)});
			resetForm();
		}else{
			setMessage(prev => {prev.color = 'red'; prev.text = data.message; return prev;})
		}
		setIsLoading(false);
	}

	const resetForm = () => {
		setSourceName('');
		setFromIP('');
		setToIP('');
		setSourceId(0); 
		navigate('/sources/0');
	}

	const validateForm = () => {
		if(!sourceName.trim()){
			setMessage({color : 'red', text : 'Enter source name'});
			return false;
		}
		if(!IP_REGEX.test(fromIP)){
			setMessage({color : 'red', text : 'Invalid From IP address'});
			return false;
		}
		if(!IP_REGEX.test(toIP)){
			setMessage({color : 'red', text : 'Invalid To IP address'});
			return false;
		}
		return true;
	}

    return (
		<div>
        <div className="col-sm-9">
		<div className = "row">
			<div className ="col-lg-6 col-md-6 col-sm-6 container justify-content-center card">
				<h2 className = "text-left"> Create Source Range </h2>
				<div className = "card-body">
						<div className ="form-group">
							<label>Source Name </label>
							<input
							type = "text"
							name = "name"
							value={sourceName}
							onChange={e => setSourceName(e.target.value)}
							className = "form-control"
							placeholder="Enter Source Name"
							disabled={sourceId}
							/>
						</div>
						
						<div className ="form-group">
							<label> From IP </label>
							<input
							type = "text"
							name = "firstIp"
							value={fromIP}
							onChange={e => setFromIP(e.target.value)}
							className = "form-control"
							placeholder="Enter First Ip" 
							/>
						</div>
						
						<div className ="form-group">
							<label> To IP </label>
							<input
							type = "text"
							name = "secondIp"
							value={toIP}
							onChange={e => setToIP(e.target.value)}
							className = "form-control"
							placeholder="Enter Second Ip" 
							/>
						</div>
						
						
						<div className = "box-footer">
							<button className = "btn btn-primary" onClick={saveSource}>
								Submit
							</button>
							<button className = "btn btn-outline-warning" onClick={() => {resetForm(); navigate('/sources/0')}}>Cancel</button>
						</div>
						</div>
						{ message.text &&
							<div style={{color:message.color}}>{message.text}</div>
						}
			</div>
		</div>
	</div>
		<SourceList sourceList={sourceList} />
	</div>
    );
}

export default SourceDetails;