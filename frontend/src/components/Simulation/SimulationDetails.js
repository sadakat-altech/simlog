import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../../services/CommonUtils";
import { Chip } from 'react-chips';
import SimulationList from "./SimulationList";

const SimulationDetails = () => {
    const {id} = useParams();
    const [simulation, setSimulation] = useState({
      simulationName : '',
      date : '',
      jobIds : [],
      jobs : []
    });
    const [simulationList, setSimulationList] = useState([]);
    const [jobOptionsList, setJobOptionsList] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [message, setMessage] = useState({color: null, text : null});
	  const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
      fetch(`${process.env.REACT_APP_BACKEND_URL}/simulations`).then( res => res.json() ).then( data => {setSimulationList(data.simulationList)});
      fetch(`${process.env.REACT_APP_BACKEND_URL}/jobs/newJobs`).then( res => res.json() ).then( data => {setJobOptionsList(data.jobList)});
      if(id != 0){
        fetch(`${process.env.REACT_APP_BACKEND_URL}/simulations/view/${id}`).then( res => res.json() ).then( data => {setSimulation(data.simulation)});
      }else{
        resetForm();
      }
    },[id]);

    const handleOnChange = (prop, value) => {
      setSimulation(prevState=>({...prevState, [prop]: value}))	
    }

    const saveSimulation = () => {
      if(validateForm()){
        setIsLoading(true);
  
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(simulation)
        };
  
        if(simulation._id){
          fetch(`${process.env.REACT_APP_BACKEND_URL}/simulations/update`, requestOptions).then( res => res.json() ).then( data => handleData(data));
        }else{
          fetch(`${process.env.REACT_APP_BACKEND_URL}/simulations/save`, requestOptions).then( res => res.json() ).then( data => handleData(data));
        }
      }
    }

    const createJobOptions = () =>{
      if(jobOptionsList){
        return jobOptionsList.map((ele, index) => (
          <option key={ele._id} value={index}>{ele.jobName}</option>
        ));
      }
    }
  
    const handleData = (data) => {
      if(data.simulation){
        setMessage(prev => {prev.color = 'green'; prev.text = data.message; return prev;});
        fetch(`${process.env.REACT_APP_BACKEND_URL}/jobs/newJobs`).then( res => res.json() ).then( data => {setJobOptionsList(data.jobList)});
        fetch(`${process.env.REACT_APP_BACKEND_URL}/simulations`).then( res => res.json() ).then( data => {setSimulationList(data.simulationList)});
        resetForm();
      }else{
        setMessage(prev => {prev.color = 'red'; prev.text = data.message; return prev;})
      }
      setIsLoading(false);
    }
  
    const resetForm = () => {
      setSimulation({
        simulationName : '',
        date : '',
        jobIds : [],
        jobs : []
      });
      setSelectedJob(null);
      navigate('/simulations/0');
    }

    const validateForm = () => {
      const date = Date.now();
      const selectedDate = new Date(simulation.date);
      if(!simulation.simulationName.trim()){
        setMessage({color : 'red', text : 'Enter Simulation Name'});
        return false;
      }
      if(!simulation.jobIds || simulation.jobIds.length == 0){
        setMessage({color : 'red', text : 'Select a job'});
        return false;
      }
      if(selectedDate < date){
        setMessage({color : 'red', text : 'Invalid date'});
        return false;
      }
      return true;
    }

    const addJob = () => {
      if(selectedJob._id){
        const isPresent = simulation.jobIds.findIndex(ele => ele === selectedJob._id);
        if(isPresent < 0){
          let tempSimulation = {...simulation};
          tempSimulation.jobIds.push(selectedJob._id);
          if(tempSimulation.jobs){
            tempSimulation.jobs.push(selectedJob);
          }else{
            tempSimulation.jobs = [selectedJob];
          }
          setSimulation(tempSimulation);
        }
      }
    }

    const removeJob = (jobId) => {
      const index = simulation.jobIds.findIndex(ele => ele === jobId);
      if(index > -1){
        let tempSimulation = {...simulation};
        tempSimulation.jobIds.splice(index, 1);
        const jobIndex = simulation.jobs.findIndex(ele => ele._id === jobId);
        tempSimulation.jobs.splice(jobIndex, 1);
        setSimulation(tempSimulation);
      }
    }

    const getSelectedChips = () => {
      return simulation.jobs.map(job => <Chip onRemove={e => removeJob(job._id)} >{job.jobName}</Chip>);
    }

    const createJobsCustomChip = () => {
      return simulation.jobs.map(ele => <span>{ele.jobName}</span>);
    }

    return (
      <div>
      <div className="col-lg-10 col-md-6 col-sm-6 container justify-content-center card">
            <h2>Create new simulation</h2>
          <div className="card-body">
              <div className="jobheight form-group col-3">
                <label >Simulation Name</label>
                <input className="form-control" 
                disabled={simulation._id}
                value={simulation.simulationName}
                onChange={e => handleOnChange('simulationName', e.target.value)} 
                placeholder="Add new Simulation name" />
              </div>
              {!simulation._id && <div className=" jobheight form-group col-md-4">
              <label >Select Jobs</label>
                <select className="form-control" onChange={(e) => setSelectedJob(jobOptionsList[e.target.value])}>
                    <option value={0} selected>--Select Jobs--</option>
                    {jobOptionsList && createJobOptions()}
                </select>
                </div>
              }
             
                <div className="btnheight form-group">
                <button className="btn btn-primary" onClick={addJob}>Add</button>
                </div>            
              
                <div className="dtheight form-group">
                      <input type='datetime-local' className="form-control" value={formatDate(new Date(simulation.date))}
                        onChange={e => handleOnChange('date', e.target.value)} />
              </div>

              <div className = "box-footer">         
                <button className="btn btn-primary" onClick={saveSimulation}>Submit</button>
                
                <button className="btn btn-outline-warning" onClick={() => { resetForm(); navigate('/simulations/0');}}>Cancel</button>
              </div>

            </div>
            {!simulation._id && <div className="form-group justify-content-center">
                  {simulation.jobs.length > 0 && getSelectedChips()}
              </div>}
              
              {simulation._id && <div className="form-group">
                  {createJobsCustomChip()}
              </div>}

                { message.text &&
                  <div style={{color:message.color}}>{message.text}</div>
                }
              
      </div>
              <div className="simlist">
                <SimulationList refreshList={(list) => setSimulationList(list)} simulationList={simulationList} />
              </div>
    
    </div>
      
    );
  }

export default SimulationDetails;