
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { Link } from "react-router-dom"
const Header =()=> {
    return (
        <div className="header">
            <Navbar expand="lg">
                <Container>
                    <Link to="/" className="navbar-brand">O2 Bridge</Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Link className="navbar-link nav-link" to="/">Bridge</Link>
                            <Link className="navbar-link nav-link" to="/bridge-v2">Bridge V2</Link>
                            <Link className="navbar-link nav-link" to="/token-management">Token Management</Link>
                            <Link className="navbar-link nav-link" to="/token-management-v2">Token Management V2</Link>

                            <Link className="navbar-link nav-link" to="/">FAQ</Link>
                            <Link className="navbar-link nav-link" to="/stats">Stats</Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default Header;


