import React, { Component } from 'react';
import Rfp from "../artifacts/Rfp.json";
import getWeb3 from "../getWeb3";
import { Line, Bar } from "react-chartjs-2";
import '../index.css';
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
    Table,
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap";

import "../card.css";


const drizzleOptions = {
  contracts: [Rfp]
}


var verified;
var row = [];
var agencyarr = [];
var shqarr = [];
var reqsarr = [];

class AdminDashboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            RfpInstance: undefined,
            account: null,
            web3: null,
            verified: '',
        }
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

            const currentAddress = await web3.currentProvider.selectedAddress;
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Rfp.networks[networkId];
            const instance = new web3.eth.Contract(
                Rfp.abi,
                deployedNetwork && deployedNetwork.address,
            );

            this.setState({ RfpInstance: instance, web3: web3, account: accounts[0] });

            var verified = await this.state.RfpInstance.methods.isAdmin(currentAddress).call();
            this.setState({ verified: verified });

            shqarr.push(<ContractData contract="Rfp" method="getShqCount" />);
            agencyarr.push(<ContractData contract="Rfp" method="getAgencyCount" />);
            reqsarr.push(<ContractData contract="Rfp" method="getBidCount" />);


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

        if (!this.state.verified) {
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
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                </div>
            );
        }

        return (
            <DrizzleProvider options={drizzleOptions}>
                <LoadingContainer>
                    <div className="content">
                        <div className="main-section">
                            <Row>
                                <Col lg="4">
                                    <div class="dashbord">
                                        <div class="icon-section">
                                            <i class="fa fa-users" aria-hidden="true"></i><br />
                                            <medium>Total Development Agencies</medium><br />
                                            <p style={{color : 'white'}}> {agencyarr} </p>
                                        </div>
                                        <div class="detail-section"><br />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4">
                                    <div class="dashbord">
                                        <div class="icon-section">
                                            <i class="fa fa-bell" aria-hidden="true"></i><br />
                                            <medium>Active Requests for Proposal</medium><br />
                                            <p style={{color : 'white'}}>{reqsarr}</p>
                                        </div>
                                        <div class="detail-section">
                                            <br />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4">
                                    <div class="dashbord">
                                        <div class="icon-section">
                                            <i class="fa fa-users" aria-hidden="true"></i><br />
                                            <medium>Service Headquarter Team Size</medium><br />
                                            <p style={{color : 'white'}}>{shqarr}</p>
                                        </div>
                                        <div class="detail-section"><br />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <Row>
                        <Col lg="4">
                                <Card>
                                    <CardHeader>
                                        <h5 className="title">Development Agency Information</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="chart-area">

                                            <Button href="/Adminn/AgencyInfo" className="btn-fill btn-dark" color="primary">
                                            Verify Development Agency
                </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg="4">
                                <Card>
                                    <CardHeader>
                                        <h5 className="title">Request for Proposal Details</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="chart-area">

                                            <Button href="/Adminn/TransactionInfo" className="btn btn-dark" color="primary">
                                                View Details
                        </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg="4">
                                <Card>
                                    <CardHeader>
                                        <h5 className="title">Service Headquarter Team Information</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="chart-area">

                                            <Button href="/Adminn/ShqInfo" className="btn btn-dark" color="primary">
                                            Verify SHQ Members
                </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            
                            
                        </Row>
                    </div>
                </LoadingContainer>
            </DrizzleProvider>
        );

    }
}

export default AdminDashboard;
