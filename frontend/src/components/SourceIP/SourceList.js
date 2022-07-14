import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import List from "../List";

const SourceList = ({sourceList}) => {
    
    const headers = [
        {prop : 'sourceName', value : 'Source Name'},
        {prop : 'fromIP', value : 'From IP'},
        {prop : 'toIP', value : 'To IP'}
    ];

    const listOptions = {
        tableClass : 'sourceTable',
        editLink : 'sources'
    };

    return (
        <div>
            <List data={sourceList} headers={headers} listOptions={listOptions}></List>
        </div>
    );
}

export default SourceList;