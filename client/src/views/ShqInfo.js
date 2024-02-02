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
    FormGroup,
    Input,
    Table,
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap";

const drizzleOptions = {
    contracts: [Rfp]
}


var shqsCount;
var shqsMap = [];
var shqTable = [];

class ShqInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            RfpInstance: undefined,
            account: null,
            web3: null,
            shhqs: 0,
            verified: '',
            not_verified: '',
        }
    }

    verifyShq = (item) => async () => {
        //console.log("Hello");
        //console.log(item);

        await this.state.RfpInstance.methods.verifyShq(
            item
        ).send({
            from: this.state.account,
            gas: 2100000
        });

        //Reload
        window.location.reload(false);

    }

    NotverifyShq = (item) => async() => {

        await this.state.RfpInstance.methods.rejectShq(
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


            shqsCount = await this.state.RfpInstance.methods.getShqCount().call();
            console.log(shqsCount);

            
            
            shqsMap = await this.state.RfpInstance.methods.getShq().call();
            
            var verified = await this.state.RfpInstance.methods.isAdmin(currentAddress).call();
            //console.log(verified);
            this.setState({ verified: verified });


            for (let i = 0; i < shqsCount; i++) {
                var shhq = await this.state.RfpInstance.methods.getShqDetails(shqsMap[i]).call();
                console.log(shhq);
                var shq_verify = await this.state.RfpInstance.methods.isVerified(shqsMap[i]).call();
                console.log(shq_verify);
                shhq.verified = shq_verify;
                
                //shhq.push(shq_verify);
                var not_verify = await this.state.RfpInstance.methods.isRejected(shqsMap[i]).call();
                console.log(not_verify);



                shqTable.push(<tr><td>{i + 1}</td><td>{shqsMap[i]}</td><td>{shhq[0]}</td><td>{shhq[1]}</td><td>{shhq[2]}</td><td>{shhq[3]}</td>
                    <td>{shhq.verified.toString()==='true'?('Verified'):('Rejected/Pending')}</td>
                    <td>
                        <Button onClick={this.verifyShq(shqsMap[i])} disabled={shq_verify || not_verify} className="button-vote">
                            Verify
                    </Button>
                    </td>
                    <td>
                        <Button  onClick={this.NotverifyShq(shqsMap[i])} disabled={shq_verify || not_verify} className="btn btn-danger">
                        Reject
                    </Button>
                    </td></tr>)
            console.log(shhq[5]);


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
                                        <CardTitle tag="h4">Service Headquarter Team</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Table sclassName="tablesorter" responsive color="black">
                                            <thead className="text-primary">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Account Address</th>
                                                    <th>Name</th>
                                                    <th>Age</th>
                                                    <th>Aadhar Number</th>
                                                    <th>Pan Number</th>
                                                    <th>Verification Status</th>
                                                    <th>Verify</th>
                                                    <th>Reject</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {shqTable}
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

export default ShqInfo;
