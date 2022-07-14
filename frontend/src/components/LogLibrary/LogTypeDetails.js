import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LogTypeList from "./LogTypeList";

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const capDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const LogTypeDetails = () => {
	const {id} = useParams();
	useEffect(() => {
		if(id != 0){
        	fetch(`${process.env.REACT_APP_BACKEND_URL}/logTypes/view/${id}`).then( res => res.json() ).then( data => {setLogTypeValue(data.logType)});
		}
		fetch(`${process.env.REACT_APP_BACKEND_URL}/logTypes`).then( res => res.json() ).then( data => {setLogTypeList(data.logTypeList)});
    },[id]);

	const [logTypeId, setLogTypeId] = useState('');
	const [typeName, setTypeName] = useState('');
	const [patternType, setPatternType] = useState('');
	const [pattern, setPattern] = useState([{fieldKey : '', pyFormat : ''}]);
	const [testPattern, setTestPattern] = useState('');
	const [output, setOutput] = useState('');
	const [message, setMessage] = useState({color: null, text : null});
	const [isLoading, setIsLoading] = useState(false);
    const [logTypeList, setLogTypeList] = useState([]);
	const navigate = useNavigate();

	const setLogTypeValue = (data) => {
		setTypeName(data.logTypeName);
		setPatternType(data.patternType);
		setPattern(data.pattern);
		setLogTypeId(data._id); 
		setIsLoading(false)
	}

	const saveLogType = () => {
		if(validateForm()){
			setIsLoading(true);

			const logTypeObj = {
				logTypeName :  typeName,
				patternType : patternType,
				pattern : pattern
			}

			if(logTypeId){
				logTypeObj.logTypeId = logTypeId;
			}
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(logTypeObj)
			};

			if(logTypeId){
				fetch(`${process.env.REACT_APP_BACKEND_URL}/logTypes/update`, requestOptions).then( res => res.json() ).then( data => handleData(data));
			}else{
				fetch(`${process.env.REACT_APP_BACKEND_URL}/logTypes/save`, requestOptions).then( res => res.json() ).then( data => handleData(data));
			}
		}
	}

	const handleData = (data) => {
		if(data.logType){
			setMessage(prev => {prev.color = 'green'; prev.text = data.message; return prev;});
			fetch(`${process.env.REACT_APP_BACKEND_URL}/logTypes`).then( res => res.json() ).then( data => {setLogTypeList(data.logTypeList)});
			resetForm();
		}else{
			setMessage(prev => {prev.color = 'red'; prev.text = data.message; return prev;})
		}
		setIsLoading(false);
	}

	const validateForm = () => {
		if(!typeName.trim()){
		  setMessage({color : 'red', text : 'Enter Log Type Name'});
		  return false;
		}
		if(!patternType || patternType == 0){
		  setMessage({color : 'red', text : 'Select a Log Type'});
		  return false;
		}
		if(!pattern[0].fieldKey.trim() || !pattern[0].pyFormat.trim() ){
		  setMessage({color : 'red', text : 'Add atleast one pattern'});
		  return false;
		}
		return true;
	  }

	const resetForm = () => {
		setLogTypeId(0);
		setTypeName('');
		setPattern([{fieldKey : '', pyFormat : ''}]);
		setPatternType('');
		navigate('/logTypes/0');
	}

	const addFields = () => {
		const data = [...pattern];
		data.push({fieldKey : '', pyFormat : ''});
		setPattern(data);
	}

	const setPatternData = (idx, param, value) => {
		const data = [...pattern];
		data[idx][param] = value;
		setPattern(data);
	}

	const createFieldElements = () => {
		return pattern.map((ele, idx) => (
			<div className="grabdatepattern" key={`pattern_field_${idx}`}>
					<div className ="form-group">
							<label> Grab Pattern </label>
							<input
							type = "text"
							value={ele.fieldKey}
							onChange = {(e) => setPatternData(idx, 'fieldKey', e.target.value)}
							className = "form-control"
							placeholder="Enter Grab Pattern" 
							/>
					</div>
						
					<div className ="form-group">
							<label> Date Pattern </label>
							<input
							type = "text"
							value={ele.pyFormat}
							onChange = {(e) => setPatternData(idx, 'pyFormat', e.target.value)}
							className = "form-control"
							placeholder="Enter Date Pattern" 
							/>
					</div>
						
							{pattern.length > 1 && <button type="button" className = " btnheight btn btn-primary" onClick={(e) => removeFields(idx)} >
								Del
							</button>}
			</div>
		));
	}

	const removeFields = (index) => {
		const data = [...pattern];
		data.splice(index, 1);
		setPattern(data);
	}

	const testRegex = () => {
		
		let testData = '';
		switch(patternType.toUpperCase()){
			case 'PLAIN' : testData = testPattern; break;
			case 'CSV' : testData = testPattern.split(','); break;
			case 'JSON' : testData = JSON.parse(testPattern); break;
		}
		for(let ele of pattern){
			testData = processOutputData(patternType, ele.pyFormat, ele.fieldKey, testData);
		}
		switch(patternType.toUpperCase()){
			case 'CSV' : testData = testData.toString(); break;
			case 'JSON' : testData = JSON.stringify(testData); break;
		}

		setOutput(testData);
	}

	const processOutputData = (patternType, datePattern, grabPattern, testData) => {
		const dateData = calculateDate(datePattern);
		switch(patternType.toUpperCase()){
			case 'PLAIN' : return calculateForPlain(dateData, grabPattern, testData);
			case 'CSV' : return calculateForCSV(dateData, grabPattern, testData);
			case 'JSON' : return calculateForJson(dateData, grabPattern, testData);
		}
	}

	const calculateDate = (datePattern) => {
		const regPatterns = ((datePattern || '').match(/%[a-zA-Z]/g) || []);
		let dateOutput = datePattern;
		for(let reg of regPatterns){
			dateOutput = dateOutput.replace(reg, replaceData(reg));
		}
		return dateOutput;
	}

	const calculateForPlain = (dateOutput, grabPattern, testData) => {
		try {
			const grabRegex = new RegExp(grabPattern)
			const outputData = testData.replace(grabRegex, dateOutput);
			return outputData;	
		} catch (error) {
			return testData;
		}
	}

	const calculateForCSV = (dateOutput, grabPattern, csvArray) => {
		try {
			const grabIndex = Number(grabPattern);
			csvArray[grabIndex] = dateOutput;
			return csvArray;
		} catch (error) {
			return csvArray;
		}
	}

	const calculateForJson = (dateOutput, grabPattern, test) => {
		try {
			const traverseArr = grabPattern.split('.');
			setDeep(test, traverseArr, dateOutput);
			return test;	
		} catch (error) {
			setMessage(prev => {prev.color = 'red'; prev.text = 'Grab format not matching'; return prev;});
			return test;
		}
	}

	function setDeep(obj, path, value, setrecursively = false) {
		path.reduce((a, b, level) => {
			if (setrecursively && typeof a[b] === "undefined" && level !== path.length-1){
				a[b] = {};
				return a[b];
			}
	
			if (level === path.length-1){
				a[b] = value;
				return value;
			} 
			return a[b];
		}, obj);
	}

	const replaceData = (pattern) => {
		const date = new Date();
		switch(pattern){
			case '%y' : return `${date.getFullYear()}`.slice(-2);
			case '%Y' : return date.getFullYear();
			case '%b' : return date.toLocaleString('default', { month: 'short' });
			case '%B' : return date.toLocaleString('default', { month: 'long' });
			case '%m' : return `0${date.getMonth()+1}`.slice(-2);
			case '%d' : return `0${date.getDate()}`.slice(-2);
			case '%H' : return `0${date.getHours()}`.slice(-2);
			case '%l' : return date.getHours() > 12 ? `0${Math.floor(date.getHours()-12)}`.slice(-2) : `0${date.getHours()}`.slice(-2);
			case '%p' : return date.getHours() >= 12 ? `PM` : `AM`;
			case '%M' : return `0${date.getMinutes()}`.slice(-2);
			case '%S' : return `0${date.getSeconds()}`.slice(-2);
			case '%a' : return days[date.getDay()];
			case '%A' : return capDays[date.getDay()];
			case '%w' : return date.getDay();
			case '%f' : return `${date.getMilliseconds()}000`;
			case '%%' : return `%`;
		}
	}

    return (
		<div className="container">
        <div className=" container col-sm-9">
		<div className = "row">
			<div className ="col-lg-9 container justify-content-center card">
				<h2 className = "text-left"> Create New Log Type </h2>
				<div className = "card-body">
						<div className ="form-group col-sm-1.5">
							<label> Log Type Name</label>
							<input
							type = "text"
							name = "name"
							value={typeName}
							onChange = {(e) => setTypeName(e.target.value)}
							className = "form-control"
							placeholder="Enter Log Type Name"
							disabled={logTypeId} 
							/>
						</div>

						<div className ="form-group col-sm-1.5">
						<label> Select Log Type</label>
							<select className = " form-control" onChange = {(e) => setPatternType(e.target.value)}>
								<option selected value={0}>--Select Type--</option>
								<option selected={patternType === 'plain'} value={'plain'}>Plain</option>
								<option selected={patternType === 'json'} value={'json'}>Json</option>
								<option selected={patternType === 'csv'} value={'csv'}>CSV</option>
							</select>
						</div>

						<button type="button" className = "btnheight btn btn-primary" onClick={addFields} >
								Add
							</button>

						<div className ="form-group">
							<label> Test Data </label>
							<textarea
							value={testPattern}
							onChange = {(e) => setTestPattern(e.target.value)}
							className = "form-control"
							placeholder="Enter Test Data" 
							/>
						</div>
						{
							pattern.length && createFieldElements()
						}
						
						<button className="btnheight btn btn-primary" onClick={testRegex} >
								Test
							</button>

						<div className ="form-group">
							<label> Output </label>
							<textarea
							value={output}
							className = "form-control"
							disabled
							/>
						</div>
						</div>
						<div className = "box-footer">
							<button type="button" className = "btn btn-primary" onClick={saveLogType} disabled={isLoading}>
								Submit
							</button>
							<button className = "btn btn-outline-warning" onClick={() => {resetForm(); navigate('/logTypes/0');}}>Cancel</button>
						</div>
						
						{ message.text &&
							<div style={{color:message.color}}>{message.text}</div>
						}
			</div>
		</div>
	</div>
		<LogTypeList logTypeList={logTypeList} />
	</div>
    );
}

export default LogTypeDetails;