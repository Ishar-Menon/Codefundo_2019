import React, { Component } from 'react';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract';
import IndianElection from '../../build/contracts/IndianElection.json';
import myElection from '../../build/contracts/Elections.json';
import AdminLogin from '../pages/adminLogin';
import Constituency from '../pages/constituency';
import Home from '../pages/home';
import Thankyou from '../pages/thankyou';
import VoterLogin from '../pages/login';
import Vote from '../pages/vote';
import Results from '../pages/results';
import AdminOption from '../pages/adminOption';
import FileUpload from '../pages/fileUpload';
import CandidateDetails from '../pages/candidateDetails';
import UploadVoterList from '../pages/uploadVoterList';
import DisplayVoterList from '../pages/displayVoterList';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '0x0',
      candidates: [],
      hasVoted: false,
      loading: true,
      voting: false,
      pageIndex: 9,
      aadharNumber: 0,
      constId: 1,
      memeHash: '',
      buffer: null
    };
    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:7545'
      );
    }

    this.web3 = new Web3(this.web3Provider);
    this.election = TruffleContract(IndianElection);
    // alert(this.election);
    // alert('Hello');
    this.election.setProvider(this.web3Provider);
    this.changePage = this.changePage.bind(this);
    this.changeAadhar = this.changeAadhar.bind(this);

    this.changeConstId = this.changeConstId.bind(this);

    this.getAdhaar = this.getAdhaar.bind(this);
    this.getConstId = this.getConstId.bind(this);

    this.setBuffer = this.setBuffer.bind(this);
    this.getBuffer = this.getBuffer.bind(this);
    this.startTime = Date.now();
    this.duration = 0.2;
  }

  async componentDidMount() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      this.election.setProvider(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      this.election.setProvider(window.web3.currentProvider);
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }

    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();

    this.setState({ account: accounts[0] });
    // alert(this.state.account);

    this.electionInstance = await this.election.deployed();

    // alert(this.state.account);
  }
  changeAadhar(aadharNumber) {
    this.setState({ aadharNumber });
  }

  changeConstId(constId) {
    this.setState({ constId });
  }

  changePage(newIndex) {
    this.setState({
      pageIndex: newIndex
    });
  }

  getConstId() {
    return this.state.constId;
  }

  getAdhaar() {
    return this.state.aadharNumber;
  }

  setBuffer(Data) {
    this.setState({ buffer: Data });
  }

  getBuffer() {
    return this.state.buffer;
  }

  render() {
    if (this.state.pageIndex == 0) {
      return (
        <AdminLogin
          mycon={this.election}
          myweb3={this.web3}
          account={this.state.account}
          changePage={this.changePage}
        />
      );
    } else if (this.state.pageIndex == 1) {
      return (
        <Constituency
          mycon={this.election}
          myweb3={this.web3}
          changePage={this.changePage}
        />
      );
    } else if (this.state.pageIndex == 2) {
      return (
        <VoterLogin
          mycon={this.election}
          myweb3={this.web3}
          aadhar={this.changeAadhar}
          constid={this.changeConstId}
          pageindex={this.changePage}
        />
      );
    } else if (this.state.pageIndex == 3) {
      return (
        <Vote
          mycon={this.election}
          myweb3={this.web3}
          changePage={this.changePage}
          currentAdhaar={this.state.aadharNumber}
          currentConstId={this.state.constId}
          getAdhaar={this.getAdhaar}
          getConstId={this.getConstId}
        />
      );
    } else if (this.state.pageIndex == 4) {
      return <Home changePage={this.changePage} />;
    } else if (this.state.pageIndex == 5) {
      return <Thankyou mycon={this.election} changePage={this.changePage} />;
    } else if (this.state.pageIndex == 6) {
      return (
        <Results
          mycon={this.election}
          myweb3={this.web3}
          changePage={this.changePage}
          startTime={this.startTime}
          duration={this.duration}
        />
      );
    } else if (this.state.pageIndex == 7) {
      return <AdminOption changePage={this.changePage} />;
    } else if (this.state.pageIndex == 8) {
      return (
        <FileUpload
          changePage={this.changePage}
          setBuffer={this.setBuffer}
          getBuffer={this.getBuffer}
        />
      );
    } else if (this.state.pageIndex == 9) {
      return <CandidateDetails />;
    } else if (this.state.pageIndex == 10) {
      return (
        <UploadVoterList
          changePage={this.changePage}
          setBuffer={this.setBuffer}
          getBuffer={this.getBuffer}
          mycon={this.election}
        />
      );
    } else if (this.state.pageIndex == 11) {
      return <DisplayVoterList mycon={this.election} />;
    }
  }
}

export default App;
