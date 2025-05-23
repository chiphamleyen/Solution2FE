import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./navbar.css";
import ProfileButton from "../Account/ProfileButton";

const UserNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    return currentPath.includes(path);
  };

  const activeStyle = {
    color: '#0d6efd',
    fontWeight: '600'
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/user/dashboard">
          NetworkScan
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0 d-flex gap-4"
            navbarScroll
          >
            <Nav.Link 
              as={Link} 
              to="/user/dashboard"
              style={isActive('/user/dashboard') ? activeStyle : {}}
            >
              <i className="fa-solid fa-house"></i> Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/user/analysis"
              style={isActive('/user/analysis') ? activeStyle : {}}
            >
              <i className="fa-solid fa-magnifying-glass-chart"></i> Analysis
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/user/feedback"
              style={isActive('/user/feedback') ? activeStyle : {}}
            >
              <i className="fa-solid fa-comments"></i> Feedback
            </Nav.Link>
          </Nav>

          <Nav className="d-flex gap-4">
            <ProfileButton />
            <Nav.Link as={Link} to="/user/login">
              <i className="fa-solid fa-lock"></i> Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavigation;
