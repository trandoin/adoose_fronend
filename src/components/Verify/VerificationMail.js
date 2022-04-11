import React, { Component } from "react";
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import {Button,Popover} from 'antd';
import {IoInformationCircle} from 'react-icons/io5';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {IoKeyOutline} from 'react-icons/io5';

import * as api from '../../api/Auth';

export default class VerificationMail extends Component {


    constructor(){
        super();
        this.state = {
            SnackbarOpen : false,
            AlertSeverity : 'error',
            AlertText : '123',
            linkValid : false,
        }

    }

    AlertMiUi = props =>{
        return <MuiAlert  elevation={6} variant="filled" {...props}  />
    }
    FieldLabel = styled.div`
        max-width : 500px ;
        font-weight:500;
        color:black;
        
        font-size: 1.1rem;
        margin:0.5rem 0;
    `;

PasswordContent = (
    <ul>
        <li>Must have atleast 8 characters</li>
        <li>Atleast one smallcase, one uppercase and one number</li>
        <li>Atleast one special character like @,#,$,%</li>
    </ul>
  );

  autoCloseSnackbar = ()=>{
      this.setState({SnackbarOpen:false});
  }

  componentDidMount=async()=>{

    const id = this.props.match.params.id;
    console.log(id);

    const data = await api.checkLinkValidityVerification({id:id});
    if(data.data.type==='error')
    {
        this.setState({SnackbarOpen:true,AlertSeverity:'error',AlertText:data.data.message});
        setTimeout(() => {
            this.props.history.push('/signin');
        }, 1500);
    }
    else{
        this.setState({linkValid:true});
    }
  }

  DoVerification = async()=>{
      const id = this.props.match.params.id;
      console.log(id);
      const data = await api.verification({id : id});
      console.log(data);
      this.setState({SnackbarOpen:true,AlertSeverity:data.data.type,AlertText:data.data.message});
      window.location.href = '/signin';
  }

  render() {
    return (
        <>
        <Snackbar open={this.state.SnackbarOpen} autoHideDuration={5000} onClose={this.autoCloseSnackbar}>
                    <this.AlertMiUi  onClose={this.autoCloseSnackbar} severity={this.state.AlertSeverity}>{this.state.AlertText}</this.AlertMiUi>
        </Snackbar>

        {this.state.linkValid===true?
        <div style={{marginTop:'5vh'}} class='d-flex justify-content-center'>

        

        <form style={{width:'400px'}}>
            <h2>Verify your Adoose Account</h2>
          <div style={{marginTop:'2rem'}} />

        <Button onClick={this.DoVerification} type="primary" style={{borderRadius:'5px',padding:'0.5rem'}} block > <b>Click to verify your account</b></Button>
        </form>
      </div>
      :
      <></>
    }
      </>
    );
  }
}
