import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Outlet, Link, useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./navbar.css";
import ProfileButton from "../Account/ProfileButton";

const Navigation = () => {
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
    <Navbar expand="lg" className="bg-body-tertiary sticky-top">
      <Container fluid>
        {/* Brand and toggle button */}
        <Navbar.Brand href="#">NetworkScan</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />

        {/* Collapsible Nav */}
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto d-flex gap-4" navbarScroll>
            <Nav.Link 
              as={Link} 
              to="/admin/dashboard"
              style={isActive('/admin/dashboard') ? activeStyle : {}}
            >
              <i className="fa-solid fa-house"></i> Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/analysis"
              style={isActive('/admin/analysis') ? activeStyle : {}}
            >
              <i className="fa-solid fa-magnifying-glass-chart"></i> Analysis
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/usermanagement"
              style={isActive('/admin/usermanagement') ? activeStyle : {}}
            >
              <i className="fa fa-user"></i> User Management
            </Nav.Link>
          </Nav>

          {/* Profile and Logout on right */}
          <Nav className="ms-auto d-flex gap-4">
            <ProfileButton />
            <Nav.Link as={Link} to="/admin/login">
              <i className="fa-solid fa-lock"></i> LogOut
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
