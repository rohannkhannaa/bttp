import React, { Component } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import Rfp from "../artifacts/Rfp.json";
import getWeb3 from "../getWeb3";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { DrizzleProvider } from "drizzle-react";
import { Spinner } from "react-bootstrap";
import {
  LoadingContainer,
  AccountData,
  ContractData,
  ContractForm,
} from "drizzle-react-components";
import "../index.css";
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

const drizzleOptions = {
  contracts: [Rfp],
};

var row = [];
var rfpOwner = [];

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      RfpInstance: undefined, 
      account: null,
      web3: null,
      count: 0, 
      requested: false,
      row : [],
    };
  }

  makePayment = (shq_address, amount, rfp_idd) => async () => {
    // alert(amount);

    amount = amount * 0.0000057;
    alert(amount);
    await this.state.RfpInstance.methods
      .payment(shq_address, rfp_idd)
      .send({
        from: this.state.account,
        value: this.state.web3.utils.toWei(amount.toString(), "ether"),
        gas: 2100000,
      })
      .then((response) => {
        this.props.history.push("#");
      });
    //Reload
    window.location.reload(false);
  };

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

    //     var dict = {}
    //     for (var i = 1; i < count + 1; i++) {
    //       var address = await this.state.RfpInstance.methods.getRfpOwner(i).call();
    //       dict[i] = address;
    //     }

    //     for (var i = 0; i < count; i++) {
    //       var paid = await this.state.RfpInstance.methods.isPaid(i + 1).call();
    //       var price = await this.state.RfpInstance.methods.getPrice(i + 1).call();
    //       var request = await this.state.RfpInstance.methods.getBidDetails(i+1).call();
    //       row.push(<tr><td>{i + 1}</td><td>{request[0]}</td><td>{request[1]}</td><td>{price}</td>
    //         <td>
    //           <Button onClick={this.makePayment(dict[i + 1], price, i+1)}
    //           disabled={paid} className="btn btn-success">
    //             Make Payment
    //           </Button>
    //         </td>
    //       </tr>)

    //     }
    //     console.log(row);

    //   } catch (error) {
    //     // Catch any errors for any of the above operations.
    //     alert(
    //       `Failed to load web3, accounts, or contract. Check console for details.`,
    //     );
    //     console.error(error);
    //   }
    // };


  async componentDidMount() {
    // ... your existing code
    if (!window.location.hash) {
      console.log(window.location.hash);
      window.location = window.location + "#loaded";
      window.location.reload();
    }

    try {
      // ... your existing code
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Rfp.networks[networkId];
      const instance = new web3.eth.Contract(
        Rfp.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({
        RfpInstance: instance,
        web3: web3,
        account: accounts[0],
      });

      const currentAddress = await web3.currentProvider.selectedAddress;
      console.log(currentAddress);
      var registered = await this.state.RfpInstance.methods
        .isShq(currentAddress)
        .call();
      console.log(registered);
      this.setState({ registered: registered });
      var count = await this.state.RfpInstance.methods.getRfpCount().call();
      count = parseInt(count);
      console.log(typeof count);
      console.log(count);

      var dict = {};
      for (var i = 1; i < count + 1; i++) {
        (async (index) => {
          var address = await this.state.RfpInstance.methods
            .getRfpOwner(index)
            .call(); 
          dict[index] = address;
        })(i);
      }

      const rowPromises = [];
      for (var i = 0; i < count; i++) {
        rowPromises.push(this.processRow(dict, i));
      }

      await Promise.all(rowPromises);
      this.setState({
        row : row
      })
      // ... the rest of your code
    } catch (error) {
      // ... your existing error handling
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }
  async processRow(dict, i) {
    var paid = await this.state.RfpInstance.methods.isPaid(i + 1).call();
        var price = await this.state.RfpInstance.methods.getPrice(i + 1).call();
        var request = await this.state.RfpInstance.methods.getBidDetails(i+1).call();
        if(request[0] !== '0x0000000000000000000000000000000000000000' || request[1] !== "0x0000000000000000000000000000000000000000"){

        row.push(<tr><td>{i + 1}</td><td>{request[0]}</td><td>{request[1]}</td><td>{price}</td>
          <td>
            <Button onClick={this.makePayment(dict[i + 1], price, i+1)}
            disabled={paid} className="btn btn-success">
              Make Payment
            </Button>
          </td>
        </tr>)
        }
  }

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

    // if (!this.state.registered) {
    //   return (
    //     <div className="content">
    //       <div>
    //         <Row>
    //           <Col xs="6">
    //             <Card className="card-chart">
    //               <CardBody>
    //                 <h1>
    //                   You are not verified to view this page
    //                                     </h1>
    //               </CardBody>
    //             </Card>
    //           </Col>
    //         </Row>
    //       </div>

    //     </div>
    //   );
    // }

    return (
      <>
        <div className="content">
          <DrizzleProvider options={drizzleOptions}>
            <LoadingContainer>
              <Row>
                <Col lg="12" md="12">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">
                        Payment for RFPs
                        <span className="duration">₹ 1 = 0.0000057 Ether</span>
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Table className="tablesorter" responsive color="black">
                        <thead className="text-primary">
                          <tr>
                            <th>#</th>
                            <th>Payment From</th>
                            <th>Payment To</th>
                            <th>Price ( in ₹ )</th>
                            <th>Make Payment</th>
                          </tr>
                        </thead>
                        <tbody>{this.state.row}</tbody>
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
