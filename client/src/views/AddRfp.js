import React, { Component } from 'react';
import RfpContract from "../artifacts/Rfp.json";
import getWeb3 from "../getWeb3";
import ipfs from '../ipfs';
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import { Spinner,   FormFile} from 'react-bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';


class AddRfp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      RfpInstance: undefined,
      account: null,
      web3: null,
      area: '',
      city: '',
      stateLoc: '',
      price: '',
      rfps: null,
      verficationStatus: false,
      verified: '',
      registered: '',
      buffer: null,
      ipfsHash: '',
      rfpssId: '',
      surveyNum: '12',
      buffer2: null,
      document: '',
    }
    this.captureFile = this.captureFile.bind(this);
    this.addimage = this.addimage.bind(this);
    this.captureDoc = this.captureDoc.bind(this);
    this.addDoc = this.addDoc.bind(this);
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
      const deployedNetwork = RfpContract.networks[networkId];
      const instance = new web3.eth.Contract(
        RfpContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ RfpInstance: instance, web3: web3, account: accounts[0] });
      const currentAddress = await web3.currentProvider.selectedAddress;
      console.log(currentAddress);
      this.setState({ RfpInstance: instance, web3: web3, account: accounts[0] });
      var verified = await this.state.RfpInstance.methods.isVerified(currentAddress).call();
      console.log(verified);
      this.setState({ verified: verified });
      var registered = await this.state.RfpInstance.methods.isAgency(currentAddress).call();
      console.log(registered);
      this.setState({ registered: registered });


    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  pinFileToIPFS = async (selectedFile) => {
    try {
      let data = new FormData();
      data.append("file", selectedFile);
      data.append("pinataOptions", '{"cidVersion": 0}');
      data.append("pinataMetadata", '{"name": "pinnie"}');
      console.log(selectedFile);
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjYWZiZWZjOS0zYmQzLTQzMTUtOTBhZS1lMTE0ZTk2YzI4YTkiLCJlbWFpbCI6InIucGF0aWRhcjE4MTAwMS4yQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJiMzg4MTdmYjA0OGU5NDJlOTE0ZiIsInNjb3BlZEtleVNlY3JldCI6IjQ5YWQxNTc4YTE3ZTNiZjYxYmViYTAwNDZhOWY3MTg4MzFjMDcxN2U3ZTAxMzEyOTc5OWIzYzMxMDdmNDk5ZWYiLCJpYXQiOjE3MDgyNTExODF9.0gMn_Q95h0rQwNtbaM7UD1Tc4ukblr6sYClAC9EfXY0`,
          },
        }
      );
      const ipfsLink = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      this.setState({ document: ipfsLink });
      console.log(document);
      console.log(res.data);
      console.log(
        `View the file here: https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Show a confirmation dialog
    const isConfirmed = window.confirm("Do you want to upload this file?");

    // Check if the user confirmed before proceeding
    if (isConfirmed) {
      // Call your pinFileToIPFS function with the selected file
      this.pinFileToIPFS(selectedFile);
    } else {
      // Handle the case when the user cancels the upload
      console.log("File upload cancelled by user");
    }
  };

  addimage = async () => {
    // alert('In add image')
    await ipfs.files.add(this.state.buffer, (error, result) => {
      if (error) {
        alert(error)
        return
      }

      alert(result[0].hash)
      this.setState({ ipfsHash: result[0].hash });
      console.log('ipfsHash:', this.state.ipfsHash);
    })
  }
  addDoc = async () => {
    // alert('In add image')
    await ipfs.files.add(this.state.buffer2, (error, result) => {
      if (error) {
        alert(error)
        return
      }

      alert(result[0].hash)
      this.setState({ document: result[0].hash });
      console.log('document:', this.state.document);
    })
  }

  //QmYdztkcPJLmGmwLmM4nyBfVatoBMRDuUjmgBupjmTodAP
  addRfp = async () => {
    // this.addimage();
    // this.addDoc();
    // alert('After add image')
    await new Promise(resolve => setTimeout(resolve, 15000));
    // if (this.state.area == '' || this.state.city == '' || this.state.stateLoc == '' || this.state.price == '' || this.state.rfpssId == '' || this.state.surveyNum == '') {
    //   alert("All the fields are compulsory!");
    // } else if ((!Number(this.state.area)) || (!Number(this.state.price))) {
    //   alert("Rfp area and Price of Rfp must be a number!");
    // } else {
      await this.state.RfpInstance.methods.addRfp(
        this.state.area,
        this.state.city,
        this.state.stateLoc,
        this.state.price, 
        this.state.rfpssId,
        this.state.surveyNum,
        this.state.ipfsHash, 
        this.state.document)
        .send({
          from: this.state.account,
          gas: 2100000
        }).then(response => {
          this.props.history.push("/Shq/ShqDashboard");
        });

      //Reload
      window.location.reload(true);
    }
  // }
  // _city,string  _state, uint rfpPrice, uint _propertyPID,uint _surveyNum,string memory _ipfsHash

  updateArea = event => (
    this.setState({ area: event.target.value })
  )
  updateCity = event => (
    this.setState({ city: event.target.value })
  )
  updateState = event => (
    this.setState({ stateLoc: event.target.value })
  )
  updatePrice = event => (
    this.setState({ price: event.target.value })
  )
  updatePID = event => (
    this.setState({ rfpssId: event.target.value })
  )
  updateSurveyNum = event => (
    this.setState({ surveyNum: event.target.value })
  )
  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
    console.log('caoture file...')
  }
  captureDoc(event) {
    event.preventDefault()
    const file2 = event.target.files[0]
    const reader2 = new window.FileReader()
    reader2.readAsArrayBuffer(file2)
    reader2.onloadend = () => {
      this.setState({ buffer2: Buffer(reader2.result) })
      console.log('buffer2', this.state.buffer2)
    }
    console.log('caoture doc...')
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

    if (!this.state.registered || !this.state.verified) {
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
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Add New Request for Proposal</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Product ID</label>
                        <Input
                          placeholder="Prod ID"
                          type="text"
                          value={this.state.area}
                          onChange={this.updateArea}
                        />
                      </FormGroup>
                    </Col>

                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Product Details</label>
                        <Input
                          placeholder="Prod. Details"
                          type="text"
                          value={this.state.city}
                          onChange={this.updateCity}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>State</label>
                        <Input
                          placeholder="State"
                          type="text"
                          value={this.state.stateLoc}
                          onChange={this.updateState}
                        />
                      </FormGroup>
                    </Col>

                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Budget (INR)</label>
                        <Input
                          placeholder="Price"
                          type="text"
                          value={this.state.price}
                          onChange={this.updatePrice}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Property PID Number</label>
                        <Input
                          placeholder="Property PID"
                          type="text"
                          value={this.state.rfpssId}
                          onChange={this.updatePID}
                        />
                      </FormGroup>
                    </Col>
                  </Row> */}
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>RFP ID Number</label>
                        <Input
                          placeholder="RFP Num"
                          type="text"
                          value={this.state.rfpssId}
                          onChange={this.updatePID}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Insert Rfp Image</label>
                        <FormFile
                          id="File1"
                          onChange={this.captureFile}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Insert Adhar card document</label>
                        <FormFile
                          id="File2"
                          onChange={this.captureDoc}
                        />
                      </FormGroup>
                    </Col>
                  </Row> */}
                  <Row>
                    <Col md="12">
                    <FormGroup>
                  <label>Upload Documents</label>
                  <FormFile id="File2" onChange={this.handleFileChange} />
                </FormGroup>
                    </Col>
                  </Row> 
                </Form>
              </CardBody>
              <CardFooter>
                <Button className="btn-fill btn-dark" color="primary" onClick={this.addRfp}>
                  Submit RFP Details
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );

  }
}

export default AddRfp;
