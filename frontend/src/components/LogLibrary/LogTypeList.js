import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import List from "../List";

const LogTypeList = ({logTypeList}) => {

    const headers = [
        {prop : 'logTypeName', value : 'Log Type Name'},
        {prop : 'patternType', value : 'Pattern'}
    ];

    const listOptions = {
        editLink : 'logTypes'
    };
    return (
        <div>
            <List data={logTypeList} headers={headers} listOptions={listOptions}></List>
        </div>
    );
}

export default LogTypeList;