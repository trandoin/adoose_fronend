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

export default class ForgetPassword extends Component {

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

    const data = await api.checkLinkValidityForget({id:id});
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

  submitForgetPassword = async(e)=>{
    e.preventDefault();

    const Password1 = e.target.Password1.value;
    const Password2 = e.target.Password2.value;

    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    if(passwordRegex.test(Password1) && Password1===Password2)
    {
        const data = await api.setnewpassword({id:this.props.match.params.id,newpassword:Password1});
        this.setState({SnackbarOpen:true,AlertSeverity:data.data.type,AlertText:data.data.message});
    }
    else
    {
      this.setState({SnackbarOpen:true,AlertSeverity:'error',AlertText:'Passwords do not match or invalid'});
    }
  }

  render() {
    return (

        <>
        <Snackbar open={this.state.SnackbarOpen} autoHideDuration={5000} onClose={this.autoCloseSnackbar}>
                    <this.AlertMiUi  onClose={this.autoCloseSnackbar} severity={this.state.AlertSeverity}>{this.state.AlertText}</this.AlertMiUi>
        </Snackbar>

        {this.state.linkValid===true?
        <div style={{marginTop:'5vh'}} class='d-flex justify-content-center'>

        

        <form style={{width:'400px'}} onSubmit={this.submitForgetPassword}>
            <h2>Forget Password ?</h2>
          <this.FieldLabel className="d-flex">
            <span>New Password</span>
            <span className="d-flex align-items-center">
              <Popover placement="topLeft" content={this.PasswordContent} title={false}><IoInformationCircle /></Popover>
            </span>
          </this.FieldLabel>
          <TextField
            variant="outlined"
            color="primary"
            size="small"
            fullWidth
            type="password"
            placeholder="••••••••"
            name="Password1"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IoKeyOutline />
                </InputAdornment>
              ),
            }}
          />
          <div style={{marginTop:'1rem'}} />

          <this.FieldLabel className="d-flex">
            <span>Re-write Password</span>
            <span className="d-flex align-items-center">
              <Popover
                placement="topLeft"
                content={this.PasswordContent}
                title={false}
              >
                <IoInformationCircle />
              </Popover>
            </span>
          </this.FieldLabel>
          <TextField
            variant="outlined"
            color="primary"
            size="small"
            fullWidth
            type="password"
            placeholder="••••••••"
            name="Password2"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IoKeyOutline />
                </InputAdornment>
              ),
            }}
          />
        <div style={{marginTop:'1rem'}} />
        <div style={{marginTop:'1rem'}} />
        <Button htmlType='submit' type="primary" style={{borderRadius:'5px',padding:'0.5rem'}} block > <b>Change your password</b></Button>
        </form>
      </div>
      :
      <>Loading...</>
    }
      </>
    );
  }
}
