import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import List from "../List";

const CollectorList = ({collectorList}) => {

    const headers = [
        {prop : 'collectorName', value : 'Collector Name'},
        {prop : 'collectorIP', value : 'Collector IP'},
        {prop : 'collectorPort', value : 'Collector Port'}
    ];

    const listOptions = {
        tableClass : 'collectorTable',
        editLink : 'collectors'
    };
    return (
        <div>
            <List data={collectorList} headers={headers} listOptions={listOptions}></List>
        </div>
    );
}

export default CollectorList;