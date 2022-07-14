import { useEffect, useState } from "react";
import List from "./List";
import SortList from "./SortList";

const JOB_ACTION = {
    'START' : { stateName : 'Start', stateAction : 'start', actionUrl : 'jobs/action', prop : 'jobId'},
    'STOP' : { stateName : 'Stop', stateAction : 'stop', actionUrl : 'jobs/action', prop : 'jobId'},
    'RESUME' : { stateName : 'Resume', stateAction : 'resume', actionUrl : 'jobs/action', prop : 'jobId'},
    'CANCEL' : { stateName : 'Cancel', stateAction : 'cancel', actionUrl : 'jobs/action', prop : 'jobId'},
}

const Home = () => {
    const [jobList, setJobList] = useState([]);
    const [filter, setFilter] = useState('Running');
    const [listOptions, setListOptions] = useState({
        tableClass : 'homeTable',
        actions : [JOB_ACTION.STOP, JOB_ACTION.CANCEL]
    })
    const [sortOptions, setSortOptions] = useState({
        sorts : [
        {prop : 'jobName', value : 'Job Name'},
        {prop : 'date', value : 'Date'},
        {prop : 'status', value : 'Status'},
        {prop : 'duration', value : 'Duration'},
        {prop : 'volume', value : 'Volume'},
        {prop : 'updatedAt', value : 'Updated At', defaultValue : -1}
        ],
        defaultValue : {prop : 'updatedAt', order : -1}
    })

    useEffect(()=>{
        if(filter.toUpperCase() === 'ALL'){
            fetch(`${process.env.REACT_APP_BACKEND_URL}/jobs`).then( res => res.json() ).then( data => {setJobList(data.jobList); setSortOptions({...sortOptions, defaultValue : {prop : 'date', order : -1}})});    
        }else{
            fetch(`${process.env.REACT_APP_BACKEND_URL}/jobs/filter?status=${filter}`).then( res => res.json() ).then( data => {setJobList(data.jobList); setSortOptions({...sortOptions, defaultValue : {prop : 'updatedAt', order : -1}})});
        }
    },[filter]);
    
    const headers = [
        {prop : 'jobName', value : 'Job Name'},
        {prop : 'logs', value : 'Log Source Name', subProps : {props : ['logName'], format : '##prop0##'}},
        {prop : 'date', value : 'Date', format : 'DATE'},
        {prop : 'status', value : 'Status'},
        {prop : 'duration', value : 'Duration'},
        {prop : 'volume', value : 'Volume'},
        {prop : 'progress', value : 'Progress'},
        {prop : 'updatedAt', value : 'Updated At', format : 'DATE'},
        {prop : 'sources', value : 'Source IP', subProps : {props : ['fromIP', 'toIP'], format : '##prop0## - ##prop1##'}},
        {prop : 'collectors', value : 'Collector IP', subProps : {props : ['collectorIP','collectorPort'], format : '##prop0##:##prop1##'}}
    ];

    const handleFilterChange = (value) => {
        setFilter(value);
        if(value.toUpperCase() === 'PROCESSING'){
            setListOptions({
                ...listOptions,
                actions : [JOB_ACTION.CANCEL]
            });
        }else if(value.toUpperCase() === 'RUNNING'){
            setListOptions({
                ...listOptions,
                actions : [JOB_ACTION.STOP, JOB_ACTION.CANCEL]
            });
        }else if(value.toUpperCase() === 'STOPPED'){
            setListOptions({
                ...listOptions,
                actions : [JOB_ACTION.RESUME]
            });
        }else if(value === 'NEW'){
            setListOptions({
                ...listOptions,
                actions : [JOB_ACTION.START]
            });
        }else{
            setListOptions({ tableClass : listOptions.tableClass });
        }
    }

    return (

        <div className="fixedcontainer">
            <div className="statusrunning">
            <h4>Status</h4>
            <select onChange={e => handleFilterChange(e.target.value)}>
                <option selected={filter.toUpperCase() === 'ALL'} value="ALL">ALL</option>
                <option selected={filter.toUpperCase() === 'NEW'} value="NEW">NEW</option>
                <option selected={filter.toUpperCase() === 'PROCESSING'} value="Processing">PROCESSING</option>
                <option selected={filter.toUpperCase() === 'RUNNING'} value="Running">RUNNING</option>
                <option selected={filter.toUpperCase() === 'CANCELLED'} value="Cancelled">CANCELLED</option>
                <option selected={filter.toUpperCase() === 'STOPPED'} value="Stopped">STOPPED</option>
                <option selected={filter.toUpperCase() === 'COMPLETED'} value="Completed">COMPLETED</option>
            </select>
            <h4>Sort:</h4>
            <SortList sortOptions={sortOptions} list={jobList} setSortedList={(newList) => setJobList(newList)} />
            </div>
            <List data={jobList} headers={headers} listOptions={listOptions}></List>
        </div>
    );
}

export default Home;