import React, { Component } from 'react';
import { Line, Bar } from "react-chartjs-2";
import RfpContract from "../artifacts/Rfp.json";
import Rfp from "../artifacts/Rfp.json";
import getWeb3 from "../getWeb3";
import { DrizzleProvider } from 'drizzle-react';
import { Spinner  } from 'react-bootstrap';
import {  Link} from 'react-router-dom';
import {
  LoadingContainer,
  AccountData,
  ContractData,
  ContractForm
} from 'drizzle-react-components';

import viewImage from './viewImage';

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

import "../card.css";
import "../index.css";

const drizzleOptions = {
  contracts: [Rfp]
}


var verified;
var row = [];
var countarr = [];
var userarr = [];
var reqsarr = [];

class SDash extends Component {
  constructor(props) {
    super(props)

    this.state = {
      RfpInstance: undefined,
      account: null,
      web3: null,
      flag: null,
      verified: '',
      registered: '',
      count: 0,
      id: '',
    }
  }

  viewImage = (rfpssId) => {
    alert(rfpssId);
    this.props.history.push({
        pathname: '/viewImage',
      })
}

  componentDidMount = async () => {
    //For refreshing page only once
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }

    try {
      //Get network provider and web3 instance
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Rfp.networks[networkId];
      const instance = new web3.eth.Contract(
        Rfp.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const currentAddress = await web3.currentProvider.selectedAddress;
      console.log(currentAddress);
      this.setState({ RfpInstance: instance, web3: web3, account: accounts[0] });
      verified = await this.state.RfpInstance.methods.isVerified(currentAddress).call();
      console.log(verified);
      this.setState({ verified: verified });
      var registered = await this.state.RfpInstance.methods.isAgency(currentAddress).call();
      console.log(registered);
      this.setState({ registered: registered });

      var count = await this.state.RfpInstance.methods.getRfpCount().call();
      count = parseInt(count);
      console.log(typeof (count));
      console.log(count);
      //this.setState({count:count}); 

      var docu = await this.state.RfpInstance.methods.getDocument(1).call();
      console.log(docu);

      countarr.push(<ContractData contract="Rfp" method="getRfpCount" />);
      userarr.push(<ContractData contract="Rfp" method="getAgencyCount" />);
      reqsarr.push(<ContractData contract="Rfp" method="getBidCount" />);

      var rowsArea = [];
      var rowsCity = [];
      var rowsState = [];
      var rowsPrice = [];
      var rowsPID = [];
      var rowsSurvey = [];
      var rowsDocument =[];
      

      for (var i = 1; i < count + 1; i++) {
        rowsArea.push(<ContractData contract="Rfp" method="getArea" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowsCity.push(<ContractData contract="Rfp" method="getCity" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowsState.push(<ContractData contract="Rfp" method="getState" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowsPrice.push(<ContractData contract="Rfp" method="getPrice" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowsPID.push(<ContractData contract="Rfp" method="getPID" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowsSurvey.push(<ContractData contract="Rfp" method="getPID" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        //rowsDocument.push(<ContractData contract="Rfp" method="getDocument" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        var docu = await this.state.RfpInstance.methods.getDocument(i).call();
        rowsDocument.push(docu);
      }
    
      console.log(rowsDocument[0]);

      for (var i = 0; i < count; i++) {
        row.push(<tr><td>{i + 1}</td><td>{rowsArea[i]}</td><td>{rowsCity[i]}</td><td>{rowsState[i]}</td><td>{rowsPrice[i]}</td><td>{rowsSurvey[i]}</td>
        <td>{<a href={`${rowsDocument[i]}`} target="_blank">Document</a>}</td>
        </tr>)

      }
      console.log(JSON.stringify(row));

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return (
        <div>
          <div>
            <h1>
              <Spinner animation="border" variant="primary" />
            </h1>
          </div>

        </div>
      );
    }

    if (!this.state.registered) {
      return (
        <div className="content">
          <div>
            <Row>
              <Col xs="6">
                <Card className="card-chart">
                  <CardBody>
                    <h1>
                      You are not verified to view this page
                                        </h1>
                                        <br></br>
                    <a href = "/" class ="btn btn-dark">Go Back to home page</a>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>

        </div>
      );
    }


    return (
      <>
        <div className="content">
        <DrizzleProvider options={drizzleOptions}>
            <LoadingContainer>
              <div className="main-section">
                <Row>
                  <Col lg="4">
                    <div class="dashbord">
                      <div class="icon-section">
                        <i class="fa fa-users" aria-hidden="true"></i><br />
                        <medium>Total Agencies</medium><br />
                       <p style={{color:'white'}}> {userarr} </p>
                      </div>
                      <div class="detail-section"><br />
                      </div>
                    </div>
                  </Col>
                  <Col lg="4">
                    <div class="dashbord">
                      <div class="icon-section">
                        <i class="fa fa-landmark" aria-hidden="true"></i><br />
                        <medium>Active Requests for Proposal</medium><br />
                        <p style={{color:'white'}}>{countarr}</p>
                      </div>
                      <div class="detail-section"><br />
                      </div>
                    </div>
                  </Col>
                  <Col lg="4">
                    <div class="dashbord">
                      <div class="icon-section">
                        <i class="fa fa-bell" aria-hidden="true"></i><br />
                        <medium>Total Bids Made</medium><br />
                        <p style={{color:'white'}}>{reqsarr}</p>
                      </div>
                      <div class="detail-section">
                        <br />
                      </div>
                    </div>
                  </Col>
                  
                </Row>
              </div>
            </LoadingContainer>
          </DrizzleProvider>
          <Row>
            <Col lg="3">
              <Card>
                <CardHeader>
                  <h5 className="title">Add New Request for proposal</h5>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">

                    <Button href="/Shq/AddRfp" disabled={!this.state.verified} className="btn-fill btn-dark" color="primary">
                      Add New RFP
                </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            
            <Col lg="3">
              <Card>
                <CardHeader>
                  <h5 className="title">Profile</h5>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">

                    <Button href="/Shq/shqProfile" className="btn-fill btn-dark" color="primary">
                      View my profile
                </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="3">
              <Card>
                <CardHeader>
                  <h5 className="title">Bid Request Details</h5>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">

                    <Button href="/Shq/ApproveRequest" disabled={!this.state.verified} className="btn-fill btn-dark" color="primary">
                      View all Bid Requests
                        </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="3">
              <Card>
                <CardHeader>
                  <h5 className="title">Make Payments to agencies</h5>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">

                  <Button href="/Shq/MakePayment" className="btn-fill btn-dark" color="primary">
                      Make Payment
                </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
         
          <DrizzleProvider options={drizzleOptions}>
            <LoadingContainer>
              <Row>
                <Col lg="12" md="12">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">Active RFPs
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Table className="tablesorter" responsive color="black">
                        <thead className="text-primary">
                          <tr>
                          <th>#</th>
                            <th>Product ID</th>
                            <th>Product Details</th>
                            <th>State</th>
                            <th>Budget</th>
                            <th>RFP ID Number</th>
                            <th>Document</th>
                          </tr>
                        </thead>
                        <tbody>
                          {row}
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </LoadingContainer>
          </DrizzleProvider>
          
        </div>
      </>

    );

  }
}

export default SDash;