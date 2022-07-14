import { useEffect, useState } from "react";
import List from "../List";

const LogList = ({logList}) => {
    
    const headers = [
        {prop : 'logName', value : 'Log Name'},
        {prop : 'logTypes', value : 'Log Type', subProps : {props : ['logTypeName'], format : '##prop0##'}},
        {prop : 'logSize', value : 'File Size', format : 'FILE_SIZE'},
        {prop : 'sampleLog', value : 'Sample'}
        
    ];

    const listOptions = {
        tableClass : 'logTable'
    };

    return (
        <div>
            <h3>List of Log Uploads</h3>
            <List data={logList} headers={headers} listOptions={listOptions}></List>
        </div>
    );
}

export default LogList;