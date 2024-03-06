import React, { Component } from "react";
import Rfp from "../artifacts/Rfp.json";
import getWeb3 from "../getWeb3";
import { Line, Bar } from "react-chartjs-2";
import "../index.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { DrizzleProvider } from "drizzle-react";
import { Spinner } from "react-bootstrap";
import {
  LoadingContainer,
  AccountData,
  ContractData,
  ContractForm,
} from "drizzle-react-components";

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

const drizzleOptions = {
  contracts: [Rfp],
};

var rfpTable = [];
var completed = true;

class TransactionInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      RfpInstance: undefined,
      account: null,
      web3: null,
      verified: "",
    };
  }

  rfpTransfer = (rfpssId, newOwner) => async () => {
    await this.state.RfpInstance.methods
      .RfpOwnershipTransfer(rfpssId, newOwner)
      .send({
        from: this.state.account,
        gas: 2100000,
      });
    //Reload
    console.log(newOwner);
    console.log(completed);
    // this.setState({completed:false});
    completed = false;
    console.log(completed);

    window.location.reload(false);
  };

  componentDidMount = async () => {
    //For refreshing page only once
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
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
        deployedNetwork && deployedNetwork.address
      );

      this.setState({
        RfpInstance: instance,
        web3: web3,
        account: accounts[0],
      });

      var verified = await this.state.RfpInstance.methods
        .isAdmin(currentAddress)
        .call();
      //console.log(verified);
      this.setState({ verified: verified });

      var count = await this.state.RfpInstance.methods.getRfpCount().call();
      count = parseInt(count);

      const fetchDataPromises = [];

    for (let i = 1; i <= count; i++) {
      fetchDataPromises.push(
        Promise.all([
          this.state.RfpInstance.methods.getArea(i).call({ from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }),
          this.state.RfpInstance.methods.getCity(i).call({ from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }),
          this.state.RfpInstance.methods.getState(i).call({ from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }),
          this.state.RfpInstance.methods.getPrice(i).call({ from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }),
          this.state.RfpInstance.methods.getSurveyNumber(i).call({ from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }),
          this.state.RfpInstance.methods.getDocument(i).call({ from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }),
          this.state.RfpInstance.methods.getPID(i).call({ from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }),
          this.state.RfpInstance.methods.getRfpOwner(i).call({ from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }),
        ])
      );
    }

    const fetchDataResults = await Promise.all(fetchDataPromises);

    // Render the rows based on fetched data
    var promises = [];
    for (let i = 0; i < count; i++) {
      const [area, city, state, price, survey, document, pidValue, owner] = fetchDataResults[i];
      var request = await this.state.RfpInstance.methods
      .getBidDetails(i + 1)
      .call({ from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" });
        
      console.log(request);
      var approved = await this.state.RfpInstance.methods
      .isApproved(i + 1)
      .call({ from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" });
      var disabled = request[3] || approved;
      if (
        request[0] !== "0x0000000000000000000000000000000000000000" ||
        request[1] !== "0x0000000000000000000000000000000000000000"
      ) {
      promises.push(
        rfpTable.push(
            <tr>
              <td>{i + 1}</td>
              <td>{request[0]}</td>
              <td>{request[1]}</td>
              <td>{area}</td>
              <td>{city}</td>
              <td>{state}</td>
              <td>{price}</td>
              <td>{pidValue}</td>
              <td>
                <Button
                  onClick={this.rfpTransfer(i + 1, request[1])}
                  disabled={!disabled}
                  className="button-vote"
                >
                  Verify Transaction
                </Button>
              </td>
            </tr>
          )
        );
      }
    }

    //   const promises = [];
    //   for (var i = 0; i < count; i++) {
    //     var request = await this.state.RfpInstance.methods
    //       .getBidDetails(i + 1)
    //       .call();
    //     var approved = await this.state.RfpInstance.methods
    //       .isApproved(i + 1)
    //       .call();
    //     // console.log(approved);
    //     // console.log(request[3]);
    //     var disabled = request[3] && completed;
    //     console.log("Disabled: ", disabled);
    //     console.log("request[3]: ", request[3]);
    //     console.log("completed: ", completed);
    //     var owner = await this.state.RfpInstance.methods
    //       .getRfpOwner(i + 1)
    //       .call();
    //     if (
    //       request[0] !== "0x0000000000000000000000000000000000000000" ||
    //       request[1] !== "0x0000000000000000000000000000000000000000"
    //     ) {
          
    //         rfpTable.push(
    //           <tr>
    //             <td>{i + 1}</td>
    //             <td>{request[0]}</td>
    //             <td>{request[1]}</td>
    //             <td>{rowsArea[i]}</td>
    //             <td>{rowsCity[i]}</td>
    //             <td>{rowsState[i]}</td>
    //             <td>{rowsPrice[i]}</td>
    //             <td>{rowsSurvey[i]}</td>
    //             <td>
    //               <Button
    //                 onClick={this.rfpTransfer(i + 1, request[1])}
    //                 disabled={!disabled}
    //                 className="button-vote"
    //               >
    //                 Verify Transaction
    //               </Button>
    //             </td>
    //           </tr>
    //         )
    //       ;
    //     }
    //   }
      await Promise.all(promises);
      this.setState({
        rfpTable: rfpTable,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  // componentDidMount = async () => {
  //     //For refreshing page only once
  //     if (!window.location.hash) {
  //         window.location = window.location + '#loaded';
  //         window.location.reload();
  //     }

  //     try {
  //         //Get network provider and web3 instance
  //         const web3 = await getWeb3();

  //         const accounts = await web3.eth.getAccounts();

  //         const currentAddress = await web3.currentProvider.selectedAddress;
  //         //console.log(currentAddress);
  //         const networkId = await web3.eth.net.getId();
  //         const deployedNetwork = Rfp.networks[networkId];
  //         const instance = new web3.eth.Contract(
  //             Rfp.abi,
  //             deployedNetwork && deployedNetwork.address,
  //         );

  //         this.setState({ RfpInstance: instance, web3: web3, account: accounts[0] });

  //         var verified = await this.state.RfpInstance.methods.isAdmin(currentAddress).call();
  //         //console.log(verified);
  //         this.setState({ verified: verified });

  //         var count = await this.state.RfpInstance.methods.getRfpCount().call();
  //         count = parseInt(count);
  //         var rowsArea = [];
  //         var rowsCity = [];
  //         var rowsState = [];
  //         var rowsPrice = [];
  //         var rowsPID = [];
  //         var rowsSurvey = [];

  //         for (var i = 1; i < count + 1; i++) {
  //             rowsArea.push(<ContractData contract="Rfp" method="getArea" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
  //             rowsCity.push(<ContractData contract="Rfp" method="getCity" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
  //             rowsState.push(<ContractData contract="Rfp" method="getState" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
  //             rowsPrice.push(<ContractData contract="Rfp" method="getPrice" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
  //             rowsPID.push(<ContractData contract="Rfp" method="getPID" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
  //             rowsSurvey.push(<ContractData contract="Rfp" method="getPID" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
  //           }
  //         for (var i = 0; i < count; i++) {
  //             var request = await this.state.RfpInstance.methods.getBidDetails(i+1).call();
  //             var approved = await this.state.RfpInstance.methods.isApproved(i+1).call();
  //             // console.log(approved);
  //             // console.log(request[3]);
  //             var disabled = request[3]&&completed;
  //             console.log("Disabled: ", disabled);
  //             console.log("request[3]: ", request[3]);
  //             console.log("completed: ", completed);

  //             var owner = await this.state.RfpInstance.methods.getRfpOwner(i+1).call();
  //             if(request[0] !== '0x0000000000000000000000000000000000000000' || request[1] !== "0x0000000000000000000000000000000000000000"){

  //             rfpTable.push(<tr><td>{i+1}</td><td>{request[0]}</td><td>{request[1]}</td><td>{rowsArea[i]}</td><td>{rowsCity[i]}</td><td>{rowsState[i]}</td><td>{rowsPrice[i]}</td><td>{rowsSurvey[i]}</td>
  //             <td>
  //                  <Button onClick={this.rfpTransfer(i+1, request[1])} disabled={!disabled} className="button-vote">
  //                       Verify Transaction
  //                 </Button>
  //             </td>
  //             </tr>)
  //             }

  //         }

  //     } catch (error) {
  //         // Catch any errors for any of the above operations.
  //         alert(
  //             `Failed to load web3, accounts, or contract. Check console for details.`,
  //         );
  //         console.error(error);
  //     }
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

    if (!this.state.verified) {
      return (
        <div className="content">
          <div>
            <Row>
              <Col xs="6">
                <Card className="card-chart">
                  <CardBody>
                    <h1>You are not verified to view this page</h1>
                    <br></br>
                    <a href="/" class="btn btn-dark">
                      Go Back to home page
                    </a>
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
                    <CardTitle tag="h4">
                      Requests for Proposal Details
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Table className="tablesorter" responsive color="black">
                      <thead className="text-primary">
                        <tr>
                          <th>#</th>
                          <th>Service Head Quarter Account ID</th>
                          <th>Payment to</th>
                          <th>Product ID</th>
                          <th>Product details</th>
                          <th>State</th>
                          <th>Budget</th>
                          <th>RFP ID Number</th>
                          <th>Verify Payment</th>
                        </tr>
                      </thead>
                      <tbody>{this.state.rfpTable}</tbody>
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

export default TransactionInfo;
