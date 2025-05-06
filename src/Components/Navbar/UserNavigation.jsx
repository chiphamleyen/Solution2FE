import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ListGroup from "react-bootstrap/ListGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./navbar.css";
import ProfileImage from "../../assets/profile.png";

const Navigation = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Navbar expand="lg" className="bg-body-tertiary d-flex gap-4">
      <Container fluid>
        <Button variant="primary" onClick={handleShow}>
          <i className="fa fa-bars"></i>
        </Button>

        <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Prototype-1</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ListGroup as="ul">
              <ListGroup.Item as="li">
                <Link to="/UserDash">
                  <i className="fa-solid fa-house"></i> Dashboard
                </Link>
              </ListGroup.Item>
              <ListGroup.Item as="li">
                <Link to="/UserAnalysis">
                  <i className="fa-solid fa-magnifying-glass-chart"></i>{" "}
                  Analysis
                </Link>
              </ListGroup.Item>
            </ListGroup>
          </Offcanvas.Body>
        </Offcanvas>

        <Navbar.Brand href="#">User Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ms-auto  my-2 my-lg-0 d-flex gap-4"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="#action1">
              <img
                src={ProfileImage}
                alt="Profile"
                style={{ width: "32px", height: "32px", borderRadius: "50%" }}
              />
            </Nav.Link>

            <Nav.Link as={Link} to="/UserLoginRegister">
              {" "}
              <i className="fa-solid fa-lock"></i> LogOut{" "}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
