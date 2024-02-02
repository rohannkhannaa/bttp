import React, { Component } from 'react';
import Rfp from "../artifacts/Rfp.json";
import getWeb3 from "../getWeb3";
import { DrizzleProvider } from 'drizzle-react';
import { Spinner  } from 'react-bootstrap';
import {
  LoadingContainer,
  AccountData,
  ContractData,
  ContractForm
} from 'drizzle-react-components';
import "../index.css";

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
  contracts: [Rfp]
}

var verified;
var row = [];
var rowsIpfs = [];

class viewImage extends Component {
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
      var registered = true;
      this.setState({ registered: registered });

      var count = await this.state.RfpInstance.methods.getRfpCount().call();
      count = parseInt(count);
      console.log(typeof (count));
      console.log(count);
      //this.setState({count:count});

      var rowsArea = [];
      var rowsCity = [];
      var rowsState = [];
      var rowsSt = [];
      var rowsPrice = [];
      var rowsPID = [];
      var rowsSurvey = [];
      var rowsIpfs = [];
      var rowsDocs = [];

      for (var i = 1; i < count + 1; i++) {
        rowsArea.push(<ContractData contract="Rfp" method="getArea" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowsCity.push(<ContractData contract="Rfp" method="getCity" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowsState.push(<ContractData contract="Rfp" method="getState" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowsSt.push(<ContractData contract="Rfp" method="getStatus" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowsPrice.push(<ContractData contract="Rfp" method="getPrice" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowsPID.push(<ContractData contract="Rfp" method="getPID" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowsSurvey.push(<ContractData contract="Rfp" method="getSurveyNumber" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
      // rowsIpfs.push((<ContractData contract="Rfp" method="getImage"  methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />));
      }
      

      for (var i = 1; i < count + 1; i++) {
        var rfpImg = await this.state.RfpInstance.methods.getImage(i).call();
        rowsIpfs.push(rfpImg)
        var document = await this.state.RfpInstance.methods.getDocument(i).call();
        rowsDocs.push(document);
        // row.push(<> <Col xs="6"><Card style={{textAlign: "center"}}>
        //   <CardHeader><CardTitle><h2>Rfp {i}</h2></CardTitle></CardHeader>
        // <CardBody><div><img src={`https://ipfs.io/ipfs/${rfpImg}`} alt="" width="90%" height="90%" style={{marginBottom:"10px"}}/><p>Area: {rowsArea[i-1]}</p><p>City: {rowsCity[i-1]}</p><p>State: {rowsState[i-1]}</p><p>PID: {rowsPID[i-1]}</p><p>Price: {rowsPrice[i-1]}</p> 
        // </div></CardBody></Card></Col></>)
        row.push(<Col xs="6">
     
        <div class="post-module">
          
          <div class="thumbnail">
            <div class="date">
            <div class="day">{i}</div>
            </div><img src={`https://ipfs.io/ipfs/${rfpImg}`}/>
          </div>
          
          <div class="post-content">
            <div class="category">Photos</div>
            <h1 class="title">{rowsArea[i-1]} Sq. m.</h1>
            <h2 class="sub_title">{rowsCity[i-1]}, {rowsState[i-1]}</h2>
            <p class="description">PID: {rowsPID[i-1]}<br/> Survey No.: {rowsSurvey[i-1]}</p>
      <div class="post-meta"><span class="timestamp">Price: ₹ {rowsPrice[i-1]}</span></div>
      <div class="post-meta"><span class="timestamp">View Verified Rfp  <a href={`https://ipfs.io/ipfs/${document}`} target="_blank">Document</a></span></div>
          </div>
        </div>
      </Col>)
      }
      console.log(row)

      

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

    if (!this.state.registered || !this.state.verified) {
      return (
        <div className="content">
          <div>
            <Row>
              <Col xs="6">
                <Card>
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
      <>
        <div className="content">
          <DrizzleProvider options={drizzleOptions}>
            <LoadingContainer>

              <Row>

                {row}

              </Row>
            </LoadingContainer>
          </DrizzleProvider>
          
        </div>
      </>

    );

  }
}

export default viewImage;