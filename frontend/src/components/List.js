import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

const List = ({listOptions, data, headers}) => {

    const createTableHeader = () => {
        return headers.map(ele => (<th key={ele.key}>{ele.value}</th>))
    }

    const handleAction = (objId, action) => {
        const obj = {};
        obj[action.prop] = objId;
        obj['action'] = action.stateAction;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        };
        fetch(`${process.env.REACT_APP_BACKEND_URL}/${action.actionUrl}`, requestOptions).then( res => res.json() ).then( data => {
            //Handle success or failure
        });
    }

    const createTableData = () => {
        return data.map(ele => (
            <tr key={ele._id}>
                {headers.map(key => {
                    if(key.subProps){
                        return (<td key={`${ele._id}_${key.prop}`}>{formatSubData(ele, key.prop, key.subProps)}</td>)
                    }else if(key.format){
                        return (<td key={`${ele._id}_${key.prop}`}>{formatData(ele, key.prop, key.format)}</td>)
                    }else{
                        return (<td key={`${ele._id}_${key.prop}`}>{ele[key.prop]}</td>)
                    }
                })}
                {listOptions.editLink && !listOptions.editCondition && <td><Link className="btn btn-primary" to={`/${listOptions.editLink}/${ele._id}`}>Edit</Link></td>}
                {listOptions.editLink && listOptions.editCondition && ele[listOptions.editCondition.field].toUpperCase() === listOptions.editCondition.value.toUpperCase() && <td><Link className="btn btn-primary" to={`/${listOptions.editLink}/${ele._id}`}>Edit</Link></td>}
                {listOptions.editLink && listOptions.editCondition && ele[listOptions.editCondition.field].toUpperCase() !== listOptions.editCondition.value.toUpperCase() && <td></td>}
                {listOptions.actions && <td> {listOptions.actions.map(action => (<td key={`${ele._id}_${action.stateName}`}><button className="btn btn-primary" onClick={() => handleAction(ele._id, action)}>{action.stateName}</button></td>))}</td>
                 }
            </tr>
        ));
    }

    const formatSubData = (ele, prop, subProps) => {
        let data = subProps.format;
        for(let i=0; i < subProps.props.length ; i++){
            const key = subProps.props[i];
            data = data.replace(`##prop${i}##`, ele[prop][0][key]);
        }
        return data;
    }

    const formatData = (ele, prop, format) => {
        switch(format.toUpperCase()){
            case 'DATE' :  const date = new Date(ele[prop]);
                return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
            case 'FILE_SIZE' : const size = Math.round(ele[prop]*1000000)/1000;
                return `${size} KB`;
        }
    }

    return (
        data &&
        <div className="container">
        <Table className={listOptions.tableClass} striped bordered hover>
             <thead><tr>{createTableHeader()}{listOptions.editLink && <th>Actions</th>}{listOptions.actions && <th>Actions</th>}</tr></thead>
             <tbody>{createTableData()}</tbody>
        </Table>
        </div>
    );
}

export default List;