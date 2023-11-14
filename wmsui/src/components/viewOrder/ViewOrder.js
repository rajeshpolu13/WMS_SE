import React from 'react';
import {Container, Row, Col, Form, Button, Alert, Table, Modal} from 'react-bootstrap';
import axios from "axios";
import { useState, useEffect, useRef} from "react";
import { useSelector } from "react-redux";
import Select from 'react-select';
import { FaEye } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';

const ViewOrder = () => {
    
    const [error, setError] = useState(false);
    const [menuError, setMenuError] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [menuData, setMenuData] = useState(null);  
    const [allCustomers, setAllCustomers] = useState(null); // All customers under logged in salesperson
    const [showCartModel, setShowCartModel] = useState(false);
    let userName = useSelector((state) => state.loginReducer.userInfo.username);
    const componentPDF = useRef();
    const generatePDF = useReactToPrint({
        content: ()=>componentPDF.current,
        documentTitle: selectedTransaction? allCustomers? (allCustomers.find((item) => item.id === selectedTransaction.userId) || {}).customername || "Order Details": "Order Details": "Order Details",
        onAfterPrint: () => alert("Data saved to PDF")
    })
    const getAllCustomers = async () => {
        try {
            if(userName==null || userName==""){
                if(localStorage.getItem('user')){
                     userName=JSON.parse(localStorage.getItem("user")).username;
                }}

            let resp = await axios.post(`${process.env.REACT_APP_API_URL}/customers/getCustomersByName`, {
                pageNum: -1,
                searchCustomer: "",
                searchSalesperson: userName
            });
            setAllCustomers(resp.data);
         
        }
        catch (err) {
            console.log(err,"Error in retrieving orders");
        }
    }

    const getOrderItems = async (value) => {
        try {
                setMenuError(true);
                let resp = await axios.post(`${process.env.REACT_APP_API_URL}/transaction/gettransactions`, { userId: value, status:"" });
                // console.log(resp.data, "TRANSACTION DATA");
                        
                    if (resp.data.length > 0) {
                        setMenuData(resp.data);
                        setMenuError(false);
                        setError(false);
                    }
                    else {
                        setError(true);
                    }
            }
            catch (err) {
                setError(true);
    
            }
      }

    const handleModel = async (items) =>{
        setSelectedTransaction(items);
        setShowCartModel(true);
    }

  const handleSelectCustomer = async (value)=>{
    setSelectedCustomer(value);
    let temp=(allCustomers? (allCustomers.find((data) => data.username === value) || {}).id: '');
    getOrderItems(temp);
    }

    const options = allCustomers ? allCustomers.map((item) => ({ value: item.username, label: item.customername })) : null;
    useEffect(
         () => {
             getAllCustomers();
        }, []);
    
        return (
          <>
               {selectedTransaction && <Modal size="lg" centered fullscreen={true} show={showCartModel} onHide={(e)=>{
                    setSelectedTransaction(null);
                  setShowCartModel(false);
                  }}>
                    <Modal.Header closeButton>
                      <Modal.Title id="contained-modal-title-vcenter">
                       CART
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Container>
                        <div ref={componentPDF} style={{width: '80%', margin: '40px'}}>
                           <p><b>Order ID:</b>&nbsp;&nbsp;{selectedTransaction.transactionId}</p>
                           <p><b>Date: </b>&nbsp;&nbsp;{ new Date((selectedTransaction.transactionDate).toString()).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',  hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true})}</p>
                           <p><b>Customer:</b>&nbsp;&nbsp;{(allCustomers? (allCustomers.find((item) => item.id === selectedTransaction.userId) || {}).customername: '')}</p>
                           <p><b>STATUS:</b>&nbsp;&nbsp;{selectedTransaction.transactionStatus}</p>
                           <p><b>TOTAL:&nbsp;&nbsp;$&nbsp;{Number(selectedTransaction.transactionTotal).toFixed(2).toString()}</b></p>
                           <h4>ORDERED PRODUCTS</h4>
                           {selectedTransaction.transactionItems && (selectedTransaction.transactionItems).length > 0 ? (
                            <Container>
                                <Table>
                                <thead>
                                    <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedTransaction.transactionItems &&
                                    selectedTransaction.transactionItems.map((data, index) => {
                                        return (
                                        <tr key={index}>
                                           <td>{data.itemName}</td>
                                           <td>{data.itemCategory}</td>
                                           <td>$&nbsp;{Number(data.itemCartPrice).toFixed(2).toString()}</td>
                                           <td>{data.itemQuantity}</td>
                                           
                                           <td><b>$&nbsp;{Number(data.totalPrice).toFixed(2).toString()}</b></td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                                </Table>
                            </Container>
                            ) : null}
                        </div>

                      </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='success' onClick={(e)=>generatePDF()}>SAVE AS PDF</Button>
                      <Button onClick={(e)=>{
                        setSelectedTransaction(null);
                        setShowCartModel(false);
                  }}>Close</Button>
                    </Modal.Footer>
                </Modal> }
            <Container className="mt-2">
              <Col>
              </Col>
              <Row className="menu-center-text">
                <Col>
                  <h2> ORDERS LIST</h2>
                </Col>
              </Row>
              <Row className="menu-center-text mt-3">
                <Form className="mb-3">
                  <Row>
                    <Col className="col-md-4">
                        <Select
                            value={options && options.find((option) => option.value === selectedCustomer)}
                            onChange={(e) => {handleSelectCustomer(e.value);}}
                            options={Array.isArray(options) ? options : []}
                            isSearchable
                            placeholder="Select a customer"
                          />
                    </Col>
                    <Col>
                    {options && options.length > 0 && (
                    <h3>Customer Name:{' '} {options? (options.find((option) => option.value === selectedCustomer) || {}).label: ''}</h3>
                    )}
                    </Col>
                  </Row>
                </Form>
              </Row>
            </Container>
            <hr />
        

        {selectedCustomer &&<Container className="mt-3">
          <Row>
            {menuData && menuData.length > 0 ? (
              <Container>
                <Table>
                  <thead>
                    <tr>
                    <th>Customer</th>
                      <th>Ordered Date</th>
                      <th>Order Total</th>
                      <th>ACTION</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuData &&
                      menuData.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>{(allCustomers? (allCustomers.find((item) => item.id === data.userId) || {}).customername: '')}</td>
                            <td>{new Date((data.transactionDate).toString()).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', }) }</td>
                            <td><b>$&nbsp;{Number(data.transactionTotal).toFixed(2).toString()}</b></td>
                            <td><Button size='lg' variant='light' onClick={(e) => { handleModel(data);  }}
                            ><FaEye size={30} color="blue" /> </Button></td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </Container>
            ) : menuError !== true ? (
              <Container>
                <Row>
                  <Col>
                    <h2>LOADING ...</h2>
                  </Col>
                </Row>
              </Container>
            ) : null}
          </Row>
        </Container>}
        {error === true ? (
          <Container>
            <Row>
              <Col>
                <Alert variant="danger">
                  <Alert.Heading>DATA ERROR</Alert.Heading>
                  <p>There is no transaction data available for your request.</p>
                </Alert>
              </Col>
            </Row>
          </Container>
        ) : null}
          
          </>
        );
    }
    
    export default ViewOrder;