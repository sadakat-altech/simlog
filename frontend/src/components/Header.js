import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { useContext } from 'react';
import { AuthenticationContext } from '../services/AuthenticationContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const {user, onLogout} = useContext(AuthenticationContext);
    const navigate = useNavigate();

    const navigateToScreen = (path) => {
        navigate(path);
    }

    return (
        <Navbar collapseOnSelect fixed="top" expand="lg" bg="white" variant="white">
            <Container>
            <Navbar.Brand><img src={require('../small_logo.png')}></img> </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link onClick={() => navigateToScreen('/')}>Home</Nav.Link>
                    <Nav.Link onClick={() => navigateToScreen('/simulations/0')}>Simulation</Nav.Link>
                    <Nav.Link onClick={() => navigateToScreen('/logLibrary')}>Log</Nav.Link>
                    <Nav.Link onClick={() => navigateToScreen('/logTypes/0')}>Log Type</Nav.Link>
                    <Nav.Link onClick={() => navigateToScreen('/jobs/0')}>Jobs</Nav.Link>
                    <Nav.Link onClick={() => navigateToScreen('/sources/0')}>Sources</Nav.Link>
                    <Nav.Link onClick={() => navigateToScreen('/collectors/0')}>Collectors</Nav.Link>
                    <NavDropdown title="Administration" id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => navigateToScreen('/users/0')}>Users</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav>
                <NavDropdown title={user ? user.firstName : 'Sign In'} id="collasible-nav-dropdown">
                    <NavDropdown.Item onClick={onLogout}>Sign Out</NavDropdown.Item>
                </NavDropdown>
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;