import React, { Component } from "react";
import { useState, useEffect } from "react";

// nodejs library that concatenates classes
import classNames from "classnames";
import Rfp from "../artifacts/Rfp.json";
import getWeb3 from "../getWeb3";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { DrizzleProvider } from 'drizzle-react';
import { Spinner } from 'react-bootstrap'
import {
  LoadingContainer,
  AccountData,
  ContractData,
  ContractForm
} from 'drizzle-react-components'
// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
import "../card.css";


const drizzleOptions = {
  contracts: [Rfp]
}


var row = [];
var randArray = [];
var countarr = [];
var userarr = [];
var reqsarr = [];
var rfpOwner = [];
// var requested = false;

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      RfpInstance: undefined,
      account: null,
      web3: null,
      count: 0,
      requested: false,
      rows : [],
      roww : [],
    }
  }

  requestBid = (shq_address, rfp_idd) => async () => {
    console.log(shq_address);
    console.log(rfp_idd);
    // this.setState({requested: true});
    // requested = true;
    await this.state.RfpInstance.methods.requestBid(
      shq_address,
      rfp_idd
    ).send({
      from: this.state.account,
      gas: 2100000
    }).then(response => {
      this.props.history.push("#");
    });

    //Reload
    window.location.reload(true);

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
      var registered = await this.state.RfpInstance.methods.isShq(currentAddress).call();
      console.log(registered);
      this.setState({ registered: registered });

      var count = await this.state.RfpInstance.methods.getRfpCount().call();
      count = parseInt(count);
      console.log(typeof (count));
      console.log(count);
      //this.setState({count:count}); 
      var verified = await this.state.RfpInstance.methods.isVerified(currentAddress).call();
          console.log(verified);
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
      var requestArr = [];
      var dict = [];
      var dict2 = {};
        
      
      for (var i = 1; i < count + 1; i++) {
        // rowsArea.push(<ContractData contract="Rfp" method="getArea" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        var area = await this.state.RfpInstance.methods.getArea(i).call();
        rowsArea.push(area);
        // rowsCity.push(<ContractData contract="Rfp" method="getCity" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        var city = await this.state.RfpInstance.methods.getCity(i).call();
        rowsCity.push(city);
        // rowsState.push(<ContractData contract="Rfp" method="getState" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        var state = await this.state.RfpInstance.methods.getState(i).call();
        rowsState.push(state);
        
        // rowsPrice.push(<ContractData contract="Rfp" method="getPrice" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        var price = await this.state.RfpInstance.methods.getPrice(i).call();
        rowsPrice.push(price);
        
        // rowsPID.push(<ContractData contract="Rfp" method="getPID" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        var pid = await this.state.RfpInstance.methods.getPID(i).call();
        rowsPID.push(pid);
        
        // rowsSurvey.push(<ContractData contract="Rfp" method="getPID" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        var survey = await this.state.RfpInstance.methods.getPID(i).call();
        rowsSurvey.push(survey);
        
        // requestArr.push(<ContractData contract="Rfp" method="isRequested" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        var reqq = await this.state.RfpInstance.methods.isRequested(i).call();
        requestArr.push(reqq);
        
        // rowsDocument.push(<ContractData contract="Rfp" method="getDocument" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        
        var address =   await this.state.RfpInstance.methods.getRfpOwner(i).call();
        dict.push(address);
        dict2[i] = address;
        var docu = await this.state.RfpInstance.methods.getDocument(i).call();
        rowsDocument.push(docu);
      }
    
      console.log(rowsDocument[0]);
      console.log(dict2)
      for (var i = 0; i < count; i++) {
        randArray.push(
          [rowsArea[i], rowsCity[i], rowsState[i], rowsPrice[i], rowsSurvey[i], rowsDocument[i], dict[i], requestArr[i], verified]
        )
        // row.push(<tr><td>{i + 1}</td><td>{rowsArea[i]}</td><td>{rowsCity[i]}</td><td>{rowsState[i]}</td><td>{rowsPrice[i]}</td><td>{rowsSurvey[i]}</td>
        // <td>{<a href={`${rowsDocument[i]}`} target="_blank">Document</a>}</td>
        //  <td>
        //     <Button onClick={this.requestBid(dict2[i+1], i + 1)} disabled={!verified || !requestArr[i] } className="button-vote">
        //       Make bid
        //     </Button>
        //   </td> 
        // </tr>)
      }
      this.setState({
        rows : randArray,
      })
      console.log(this.state.rows)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    // This code runs after the component's state or props have changed
    console.log('Component updated');
    
    // You can compare prevProps and prevState to the current ones and perform side effects accordingly
  }


  // componentDidMount = async () => {
  //   //For refreshing page only once
  //   if (!window.location.hash) {
  //     console.log(window.location.hash);
  //     window.location = window.location + '#loaded';
  //     window.location.reload();
  //   }

  //   try {
  //     //Get network provider and web3 instance
  //     const web3 = await getWeb3();

  //     const accounts = await web3.eth.getAccounts();

  //     const networkId = await web3.eth.net.getId();
  //     const deployedNetwork = Rfp.networks[networkId];
  //     const instance = new web3.eth.Contract(
  //       Rfp.abi,
  //       deployedNetwork && deployedNetwork.address,
  //     );

  //     this.setState({ RfpInstance: instance, web3: web3, account: accounts[0] });

  //     const currentAddress = await web3.currentProvider.selectedAddress;
  //     console.log(currentAddress);
  //     var registered = await this.state.RfpInstance.methods.isShq(currentAddress).call();
  //     console.log(registered);
  //     this.setState({ registered: registered });
  //     var count = await this.state.RfpInstance.methods.getRfpCount().call();
  //     count = parseInt(count);
  //     console.log(typeof (count));
  //     console.log(count);
  //     var verified = await this.state.RfpInstance.methods.isVerified(currentAddress).call();
  //     console.log(verified);

  //     // var countagency = await this.state.RfpInstance.methods.getAgencyCount().call();
  //     // var countshq = await this.state.RfpInstance.methods.getShqCount().call();
  //     // userarr.push(<p>{countshq.toString()}</p>);

  //     // countarr.push(<p>{count.toString()}</p>);
  //     countarr.push(<ContractData contract="Rfp" method="getRfpCount" />);
  //     userarr.push(<ContractData contract="Rfp" method="getShqCount" />);
  //     reqsarr.push(<ContractData contract="Rfp" method="getBidCount" />);

  //     var rowsArea = [];
  //     var rowsCity = [];
  //     var rowsState = [];
  //     var rowsPrice = [];
  //     var rowsPID = [];
  //     var rowsSurvey = [];
  //     var rowsDocument =[];


  //     var dict = {}
  //     for (var i = 1; i < count + 1; i++) {
  //       var address = await this.state.RfpInstance.methods.getRfpOwner(i).call();
  //       dict[i] = address;
  //     }

  //     console.log(dict[1]);

  //     for (var i = 1; i < count + 1; i++) {
  //       rowsArea.push(<ContractData contract="Rfp" method="getArea" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
  //       rowsCity.push(<ContractData contract="Rfp" method="getCity" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
  //       rowsState.push(<ContractData contract="Rfp" method="getState" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
  //       rowsPrice.push(<ContractData contract="Rfp" method="getPrice" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
  //       rowsPID.push(<ContractData contract="Rfp" method="getPID" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
  //       rowsSurvey.push(<ContractData contract="Rfp" method="getPID" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
  //       rowsDocument.push(<ContractData contract="Rfp" method="getDocument" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
  //     }
  //     console.log(rowsCity[0]);
  //     for (var i = 0; i < count; i++) {
  //       console.log("Here"+count);
  //       var requested = await this.state.RfpInstance.methods.isRequested(i + 1).call();
  //       console.log(requested);
        
  //       row.push(<tr key={i+1}><td>{i + 1}</td><td>{rowsArea[i]}</td><td>{rowsCity[i]}</td><td>{rowsState[i]}</td><td>{rowsPrice[i]}</td><td>{rowsSurvey[i]}</td>
  //         <td>{<a href={`${rowsDocument[i]}`} target="_blank">Documents</a>}</td>
  //         <td>
  //           <Button onClick={this.requestBid(dict[i + 1], i + 1)} disabled={!verified || requested} className="button-vote">
  //             Make bid
  //           </Button>
  //         </td> 
  //       </tr>)

  //       this.setState({
  //         roww : row,
  //       })
  //     }





  //   } catch (error) {
  //     // Catch any errors for any of the above operations.
  //     alert(
  //       `Failed to load web3, accounts, or contract. Check console for details.`,
  //     );
  //     console.error(error);
  //   }
  // };



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
                    <h1>You are not verified to view this page</h1>
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
                        <medium>My Profile</medium><br />
                      </div>
                      <div class="detail-section"><br />
                      </div>
                    </div>
                  </Col>
                  <Col lg="4">
                    <div class="dashbord">
                      <div class="icon-section">
                        <i class="fa fa-landmark" aria-hidden="true"></i><br />
                        <medium>Assigned Contracts</medium><br />
                        <p style={{color : 'white'}}>{countarr}</p>
                      </div>
                      <div class="detail-section"><br />
                      </div>
                    </div>
                  </Col>
                  {/* <Col lg="4">
                    <div class="dashbord dashbord-blue">
                      <div class="icon-section">
                        <i class="fa fa-bell" aria-hidden="true"></i><br />
                        <medium>Total Requests</medium><br />
                        <p>{reqsarr}</p>
                      </div>
                      <div class="detail-section">
                        <br />
                      </div>
                    </div>
                  </Col> */}
                </Row>
              </div>
            </LoadingContainer>
          </DrizzleProvider>
                    <Row>
            <Col lg="4">
              <Card>
                <CardHeader>
                  <h5 className="title">Profile</h5>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">

                    <Button href="/admin/agencyProfile" className="btn-fill btn-dark" color="primary">
                      View Profile
                </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card>
                <CardHeader>
                  <h5 className="title">List of Contracts Approved</h5>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">

                    <Button href="/admin/OwnedRfps" className="btn-fill btn-dark" color="primary">
                      View contracts assigned
                </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            {/* <Col lg="4">
              <Card>
                <CardHeader>
                  <h5 className="title">Make Payments for Approved Rfp Requests</h5>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">

                    <Button href="/admin/MakePayment" className="btn-fill" color="primary">
                      Make Payment
                </Button>
                  </div>
                </CardBody>
              </Card>
            </Col> */}
          </Row>
          <DrizzleProvider options={drizzleOptions}>
            <LoadingContainer>
              <Row>
                <Col lg="12" md="12">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">Issued Request for Proposal</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Table className="tablesorter" responsive color="black">
                        <thead className="text-primary">
                          <tr>
                            <th>#</th>
                            <th>Product ID</th>
                            <th>Product Details</th>
                            <th>State</th>
                            <th>Budget (INR)</th>
                            <th>RFP ID Number</th>
                            <th>Documents</th>
                            <th>Request Contract</th>
                          </tr>
                        </thead>
                        <tbody>
                        {this.state.rows.map((data, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{data[0]}</td>
                              <td>{data[1]}</td>
                              <td>{data[2]}</td>
                              <td>{data[3]}</td>
                              <td>{data[4]}</td>
                              <td><a href = {data[5]} target="__blank">Link</a></td>
                              <td>
                              <Button onClick={this.requestBid(data[6], index+1)} disabled={ !data[8] || data[7] } className="button-vote">
              Make bid
            </Button>
                              </td>
                            </tr>
                          ))}
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


export default Dashboard;