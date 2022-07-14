import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import List from "../List";

const JobList = ({jobList}) => {

    const headers = [
        {prop : 'jobName', value : 'Job Name'},
        {prop : 'logs', value : 'Log Source Name', subProps : {props : ['logName'], format : '##prop0##'}},
        {prop : 'date', value : 'Date', format : 'DATE'},
        {prop : 'status', value : 'Status'},
        {prop : 'duration', value : 'Duration'},
        {prop : 'volume', value : 'Volume'},
        {prop : 'progress', value : 'Progress'},
        {prop : 'sources', value : 'Source IP', subProps : {props : ['fromIP', 'toIP'], format : '##prop0## - ##prop1##'}},
        {prop : 'collectors', value : 'Collector IP', subProps : {props : ['collectorIP','collectorPort'], format : '##prop0##:##prop1##'}}
    ];

    const listOptions = {
        tableClass : 'jobTable',
        editLink : 'jobs',
        editCondition : {field : 'status', value : 'NEW'}
    };
    
    return (
        <div>
            <List data={jobList} headers={headers} listOptions={listOptions}></List>
        </div>
    );
}

export default JobList;