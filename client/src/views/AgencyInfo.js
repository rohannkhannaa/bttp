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

import { emailjs } from 'emailjs-com';
const drizzleOptions = {
    contracts: [Rfp]
}

// var agencys = 0;
// var shhqs = 0;
var agencyTable = [];
var completed = true;

function sendMail(email, name){
    // alert(typeof(name));

    var tempParams = {
        from_name: email,
        to_name: name,
        function: 'request and buy any rfpp/property',
    };
    
    window.emailjs.send('service_vrxa1ak', 'template_zhc8m9h', tempParams)
    .then(function(res){
        alert("Mail sent successfully");
    })
}

class AgencyInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            RfpInstance: undefined,
            account: null,
            web3: null,
            agencys: 0,
            verified: '',
        }
    }

  
    verifyAgency = (item) => async () => {
        //console.log("Hello");
        //console.log(item);

        await this.state.RfpInstance.methods.verifyAgency(
            item
        ).send({
            from: this.state.account,
            gas: 2100000
        });

        //Reload
        window.location.reload(false);

    }
    
    NotverifyAgency = (item, email, name) => async() => {
        // alert('Before mail');
        sendMail(email, name);
        // alert('After mail');

        await new Promise(resolve => setTimeout(resolve, 10000));

        await this.state.RfpInstance.methods.rejectAgency(
            item
        ).send({
            from: this.state.account,
            gas: 2100000
        });

        window.location.reload(false);
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
            //console.log(currentAddress);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Rfp.networks[networkId];
            const instance = new web3.eth.Contract(
                Rfp.abi,
                deployedNetwork && deployedNetwork.address,
            );

            this.setState({ RfpInstance: instance, web3: web3, account: accounts[0] });


            var agencysCount = await this.state.RfpInstance.methods.getAgencyCount().call();
            console.log(agencysCount);
           

            var agencysMap = [];
            agencysMap = await this.state.RfpInstance.methods.getAgency().call();
            //console.log(agencysMap);

            var verified = await this.state.RfpInstance.methods.isAdmin(currentAddress).call();
            //console.log(verified);
            this.setState({ verified: verified });

            for (let i = 0; i < agencysCount; i++) {
                // var i =3;
                var agency = await this.state.RfpInstance.methods.getAgencyDetails(agencysMap[i]).call();

                var agency_verify = await this.state.RfpInstance.methods.isVerified(agencysMap[i]).call();
                console.log(agency_verify);
                agency.verified = agency_verify;
                
                var not_verify = await this.state.RfpInstance.methods.isRejected(agencysMap[i]).call();
                console.log(not_verify);
                agencyTable.push(<tr><td>{i + 1}</td><td>{agencysMap[i]}</td><td>{agency[0]}</td><td>{agency[4]}</td><td>{agency[1]}</td><td>{agency[6]}</td>
                    <td>{agency.verified.toString()==='true' ? ('Verified'):('Rejected/Pending')}</td>
                    <td>
                        <Button onClick={this.verifyAgency(agencysMap[i])} disabled={agency_verify || not_verify} className="button-vote">
                            Verify
                    </Button>
                    </td>
                    <td>
                        <Button onClick={this.NotverifyAgency(agencysMap[i], agency[4], agency[0])} disabled={agency_verify || not_verify} className="btn btn-danger">
                           Reject
                    </Button>
                    </td>
                </tr>)

            }

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
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardHeader>
                                        <CardTitle tag="h5">Registered Development Agencies</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Table className="tablesorter" responsive color="black">
                                            <thead className="text-primary">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Account Address</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>City</th>
                                                    <th>Agency Number</th>
                                                    <th>Verification Status</th>
                                                    <th>Verify Agency</th>
                                                    <th>Reject Agency</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {agencyTable}
                                            </tbody>

                                        </Table>
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

export default AgencyInfo;
