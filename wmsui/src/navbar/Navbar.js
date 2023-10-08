import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, Route, Routes } from 'react-router-dom';
import Login from '../components/login/Login';
import Home from '../components/home/Home';
import Register from '../components/register/Register';
import React, { useEffect } from 'react';
import Profile from '../components/profile/Profile';
import Pnavbar from '../navbar/ProfileNavbar';
import { useNavigate } from "react-router-dom";
import EditPersonalInfo from "../components/profile/EditPersonalInfo";
import Inventory from '../components/inventory/inventory';
//Reducer
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, setLoginUserInfo, clearLoginUserInfo } from '../redux-part/reducers/loginReducer';
import axios from 'axios';


const Navigationbar = () => {
  const navigate = useNavigate();
  // const [token, setToken] = useState(false);
  const loginStatus = useSelector((state) => state.loginReducer.isLogged);
  let userFirstName = useSelector((state) => state.loginReducer.userInfo.firstName);
  let userRole = useSelector((state) => state.loginReducer.userInfo.role);
  let userId = useSelector((state) => state.loginReducer.userInfo.userId);
  const dispatch = useDispatch();
  
  useEffect(() => {
    let tokenVal = localStorage.getItem("auth");
    let userDetails = JSON.parse(localStorage.getItem("user"));
    if (tokenVal) {
      dispatch(login());
      dispatch(setLoginUserInfo(userDetails));
      // userFirstName=userDetails.firstName;
    }
    else {
      dispatch(logout());
      dispatch(clearLoginUserInfo());
      navigate('/home');
    }

  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    dispatch(logout());
    dispatch(clearLoginUserInfo());
    navigate('/login');
  }

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand onClick={e => navigate("/")}>WareHouse Management System</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">

              <Nav.Link as={Link} to="/home">Home</Nav.Link>
              {loginStatus && userRole === 'manager' ? <Nav.Link as={Link} to="/inventory"> Products </Nav.Link> : null}
            </Nav>
            <Nav>
              {!loginStatus ? <Nav.Link as={Link} to="/login">
                Login</Nav.Link> : null}
              <Nav.Link as={Link} to="/register">
                Register</Nav.Link> 
              {loginStatus ?
                <Nav.Link as={Link} to="/login" onClick={(e) => { handleLogout(e) }}>
                  Logout
                </Nav.Link> : null}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {userFirstName && loginStatus ? <Navbar>
        <Container fluid>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Nav.Link as={Link} to="/pnav">Welcome: {userFirstName+" [ "+userRole+" ] "} &nbsp;&nbsp;&nbsp;</Nav.Link>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar> : null}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/pnav/*" element={<Pnavbar />} />
        <Route path="/editpersonalinfo" element={<EditPersonalInfo />} />
      </ Routes>
    </>
  );
};

export default Navigationbar;