import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {

    const [selectedTab, setSelectedTab] = useState(null);
    const [toggleAdmin, setToggleAdmin] = useState(false);

    return (
        <div className="sidebar">
            <NavLink to={'/'} onClick={()=>setSelectedTab('Home')}>Home</NavLink>
            <NavLink  to={'/logLibrary'} onClick={()=>setSelectedTab('LogLibrary')} >Log</NavLink>
            <NavLink  to={'/logTypes/0'} onClick={()=>setSelectedTab('LogTypes')} >Log Type</NavLink>
            <NavLink  to={'/jobs/0'} onClick={()=>setSelectedTab('Jobs')} >Jobs</NavLink>
            <NavLink  to={'/sources/0'} onClick={()=>setSelectedTab('Sources')} >Sources</NavLink>
            <NavLink  to={'/collectors/0'} onClick={()=>setSelectedTab('Collectors')} >Collectors</NavLink>
            <a onClick={() => setToggleAdmin(!toggleAdmin)} >Administration</a>
            {toggleAdmin && <NavLink  to={'/users/0'} onClick={()=>setSelectedTab('Users')} >Users</NavLink>}
        </div>
    );
}

export default NavBar;