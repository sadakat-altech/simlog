import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import List from "../List";

const UserList = ({userList}) => {
    
    const headers = [
        {prop : 'username', value : 'Username'},
        {prop : 'firstName', value : 'First Name'},
        {prop : 'lastName', value : 'Last Name'},
        {prop : 'email', value : 'Email'},
        {prop : 'mobile', value : 'Mobile'}
    ];

    const listOptions = {
        tableClass : 'userTable',
        editLink : 'users'
    };

    return (
        <div>
            <List data={userList} headers={headers} listOptions={listOptions}></List>
        </div>
    );
}

export default UserList;