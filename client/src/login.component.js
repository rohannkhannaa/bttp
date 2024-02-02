import React, { Component } from "react";
import './index.css';
import history from './history';
import { Redirect } from 'react-router-dom';
import getWeb3 from "./getWeb3"
import RfpContract from "./artifacts/Rfp.json"
import { Button } from "reactstrap";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            role: null,
            redirect: null,
            adminn: '',
            shhq: '',
            agency: '',
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount = async () => {
        if (!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }

        try {
            //Get network provider and web3 instance
            const web3 = await getWeb3();

            const accounts = await web3.eth.getAccounts();

            const networkId = await web3.eth.net.getId();
            const deployedNetwork = RfpContract.networks[networkId];
            const instance = new web3.eth.Contract(
                RfpContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            const currentAddress = await web3.currentProvider.selectedAddress;
            this.setState({ RfpInstance: instance, web3: web3, account: accounts[0] });
            var shhq = await this.state.RfpInstance.methods.isAgency(currentAddress).call();
            console.log(shhq);
            this.setState({ shhq: shhq });
            var agency = await this.state.RfpInstance.methods.isShq(currentAddress).call();
            console.log(agency);
            this.setState({ agency: agency });
            var adminn = await this.state.RfpInstance.methods.isAdmin(currentAddress).call();
            console.log(adminn);
            this.setState({ adminn: adminn });

        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    handleInputChange(event) {
        this.setState({
            role: event.target.value,
            redirect: "/Register" + event.target.value
        });
    }
    submit() {
        this.props.history.push(this.state.redirect);
        window.location.reload(false);

    }

    render() {
        if (this.state.shhq || this.state.agency || this.state.adminn) {
            return (

                <div className="bodyC">
                    <div className="img-wrapper">
                        <div className="wine-text-container">
                            <div className="site-title wood-text">Indian Army Procurement</div>
                        </div>
                    </div>
                    <div className="auth-wrapper">
                        <div className="auth-inner">
                            <h1>You are already registered.</h1>
                            <Button href="/Shq/ShqDashboard" disabled={!this.state.shhq} className="btn-block" style={{margin: "2px", backgroundColor: "peru"}} >Service Headquarter Dashboard</Button>
                            <br/><Button href="/admin/dashboard" disabled={!this.state.agency} className="btn-block" style={{margin: "2px", backgroundColor: "peru"}}>Development Agency Dashboard</Button>
                            <br/><Button href="/Adminn/AdminDashboard" disabled={!this.state.adminn} className="btn-block" style={{margin: "2px", backgroundColor: "peru"}}>Admin Dashboard</Button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="bodyC">
                <div className="img-wrapper">
                    <div className="wine-text-container">
                        <div className="site-title wood-text">Indian Army Procurement</div>
                    </div>
                </div>
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <div>
                            <h1 style={{ letterSpacing: "3px", fontWeight: 500, color: "black" }}>Welcome !</h1>
                            <h4 style={{ letterSpacing: "2px", color: 'black' }}>Blockchain-based Army Procurement Process</h4>
                            <hr
                                style={{
                                    color: "#696969",
                                    height: 1
                                }}
                            />

                            <div class="form-group" style={{ color: "black" }}>
                                <label class="control-label" for="Company" style={{ fontSize: "18px", padding: "2px" }}>Select Role</label>
                                <select id="Company" class="form-control" name="Company" onChange={this.handleInputChange}>
                                    <option selected="true" disabled="disabled">Select Role</option>
                                    <option value="Agency">Development Agency</option>
                                    <option value="Shq">Service Headquarter</option>
                                </select>
                            </div>

                            <div>
                                <button onClick={() => this.submit()} className="btn btn-primary btn-block" style={{ marginBottom: "10px", marginTop: "10px" }}>Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}