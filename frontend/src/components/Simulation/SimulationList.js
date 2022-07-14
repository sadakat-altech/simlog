import { Link, useNavigate } from "react-router-dom";
import List from "../List";

const SimulationList = ({simulationList, refreshList}) => {

    const jobHeaders = [
        {prop : 'jobName', value : 'Job Name'},
        {prop : 'date', value : 'Date', format : 'DATE'},
        {prop : 'status', value : 'Status'},
        {prop : 'duration', value : 'Duration'},
        {prop : 'volume', value : 'Volume'},
        {prop : 'progress', value : 'Progress'}
    ];

    const handleAction = (simulationId, action) => {
        const obj = {
            simulationId,
            action
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        };
        fetch(`${process.env.REACT_APP_BACKEND_URL}/simulations/action`, requestOptions).then( res => res.json() ).then( data => {
            //Handle success or failure
            fetch(`${process.env.REACT_APP_BACKEND_URL}/simulations`).then( res => res.json() ).then( data => {refreshList(data.simulationList)});
        });
    }

    const createSimulationElements = () => {
        return simulationList.map(ele => 
            <div className="simjoblist" key={`SimList_${ele._id}`}>
                <div>
                    <span>{ele.simulationName}</span>
                    <span>{ele.date}</span>
                    <span>
                        <Link class="btn btn-primary" to={`/simulations/${ele._id}`}>Edit</Link> 
                        <button onClick={() => handleAction(ele._id, 'run')} class="btn btn-outline-warning">Run Immediately</button>
                    </span>
                </div>
                <div>
                    <List data={ele.jobs} headers={jobHeaders} listOptions={{}}></List>
                </div>
            </div>
        )
    }

    return (
    <div>
        {createSimulationElements()}
    </div>
    );
}

export default SimulationList;