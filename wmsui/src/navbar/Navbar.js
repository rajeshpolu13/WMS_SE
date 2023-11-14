import {Nav, Navbar, Button, Container, NavDropdown} from 'react-bootstrap';
import { Link, Route, Routes } from 'react-router-dom';
import Login from '../components/login/Login';
import Home from '../components/home/Home';
import Register from '../components/register/Register';
import React, { useEffect } from 'react';
import Profile from '../components/profile/Profile';
import Pnavbar from '../navbar/ProfileNavbar';
import { useNavigate } from "react-router-dom";
import EditPersonalInfo from "../components/profile/EditPersonalInfo";
import AddItem from '../components/addItem/AddItem';
import Inventory from '../components/inventory/inventory';
import ViewCustomer from '../components/viewCustomer/ViewCustomer';
import Order from '../components/order/Order';
import ViewOrder from '../components/viewOrder/ViewOrder';
import ViewOrderByPacker from '../components/viewOrderByPacker/ViewOrderByPacker';
import ViewPackedOrders from '../components/viewPackedOrders/ViewPackedOrders';
import Cart from "../components/cart/Cart";
//Reducer
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, setLoginUserInfo, clearLoginUserInfo } from '../redux-part/reducers/loginReducer';

const Navigationbar = () => {
  const navigate = useNavigate();
  // const [token, setToken] = useState(false);
  const loginStatus = useSelector((state) => state.loginReducer.isLogged);
  let userFirstName = useSelector((state) => state.loginReducer.userInfo.firstName);
  let userRole = useSelector((state) => state.loginReducer.userInfo.role);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if(userRole===null || userRole===""){
      if(localStorage.getItem('user')){
        userRole=JSON.parse(localStorage.getItem("user")).role;
      }}
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
          <Navbar.Brand onClick={(e) => navigate("/")}>
            WareHouse Management System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/home">
                Home
              </Nav.Link>
              {loginStatus &&
              (userRole === "packer") ? (
                <NavDropdown title="Orders">
                    <NavDropdown.Item as={Link} to="/vieworderbypacker">
                      {" "}
                      New Orders{" "}
                    </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/viewpackedorders">
                    {" "}
                    Packed Orders{" "}
                  </NavDropdown.Item>
                </NavDropdown>
              ) : null}
              {loginStatus &&
              (userRole === "manager" || userRole === "sales person") ? (
                <Nav.Link as={Link} to="/inventory">
                  {" "}
                  Products{" "}
                </Nav.Link>
              ) : null}
              {loginStatus &&
              (userRole === "manager" || userRole === "sales person") ? (
                <NavDropdown title="Customers">
                  {userRole === "sales person" ? (
                    <NavDropdown.Item as={Link} to="/register">
                      {" "}
                      Add Customer{" "}
                    </NavDropdown.Item>
                  ) : null}
                  <NavDropdown.Item as={Link} to="/viewcustomer">
                    {" "}
                    View Customers{" "}
                  </NavDropdown.Item>
                </NavDropdown>
              ) : null}
              {loginStatus &&
              (userRole === "sales person") ? (
                <NavDropdown title="Orders">
                    <NavDropdown.Item as={Link} to="/order">
                      {" "}
                      New Order{" "}
                    </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/vieworder">
                    {" "}
                    Orders List{" "}
                  </NavDropdown.Item>
                </NavDropdown>
              ) : null}
            </Nav>
            <Nav>
              {!loginStatus ? (
                <Nav.Link as={Link} to="/login">
                  [Login]
                </Nav.Link>
              ) : null}
              {loginStatus && userRole === "manager" ? (
                <Nav.Link as={Link} to="/register">
                  [Register user]
                </Nav.Link>
              ) : null}
              {loginStatus ? (
                <Nav.Link
                  as={Link}
                  to="/login"
                  onClick={(e) => {
                    handleLogout(e);
                  }}
                >
                  [Logout]
                </Nav.Link>
              ) : null}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {userFirstName && loginStatus ? (
        <Navbar>
          <Container fluid>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <Button
                  as={Link}
                  style={{ color: "white" }}
                  variant="dark"
                  to="/pnav"
                >
                  Welcome: {userFirstName + " [ " + userRole + " ]"}{" "}
                  &nbsp;&nbsp;&nbsp;
                </Button>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      ) : null}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        {userRole === "manager" ? (
          <Route path="/additem" element={<AddItem />} />
        ) : null}
        {userRole === "packer" ? (
          <><Route path="/vieworderbypacker" element={<ViewOrderByPacker />} />
          <Route path="/viewpackedorders" element={<ViewPackedOrders />} /></>
        ) : null}
        {userRole === "sales person" ? (
          <><Route path="/order" element={<Order />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/vieworder" element={<ViewOrder />} /></>
        ) : null}
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/pnav/*" element={<Pnavbar />} />
        <Route path="/editpersonalinfo" element={<EditPersonalInfo />} />
        <Route path="/viewcustomer" element={<ViewCustomer />} />
      </Routes>
    </>
  );
};

export default Navigationbar;