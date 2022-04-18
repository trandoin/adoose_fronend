import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import {FiLock} from 'react-icons/fi';
import {IoKeyOutline} from 'react-icons/io5';
import {AiOutlineUser} from 'react-icons/ai';
import {FaFacebook} from 'react-icons/fa';
import {IoInformationCircle} from 'react-icons/io5';
import { Checkbox,Button,Popover,Divider} from 'antd';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import * as api from '../../api/Auth';
import Glogin from '../Login/Glogin';
import { CommentBank } from '@mui/icons-material';

class Register extends Component {

    constructor(props){
        super(props);
        this.state = {
            windowWidth : 0,
            windowHeight:0,
            GoogleLoginText:'Sign up with Google',
            FacebookLoginText : 'Sign up with Facebook',
            TermsAndConditionChange : false
        }
    
    }

    AlertMiUi = props =>{
        return <MuiAlert  elevation={6} variant="filled" {...props}  />
    }

    changeDimension = ()=>{
        let x = window.innerWidth;
        let y = window.innerHeight;
        this.setState({windowWidth : x, windowHeight : y});
        let g = "Sign up with Google";
        let f = "Sign up with Facebook";
        if(x>800)       this.setState({GoogleLoginText:g,FacebookLoginText:f});
        else            this.setState({GoogleLoginText : 'Sign up',FacebookLoginText:'Sign up'});
    }

    componentDidMount = ()=>{
        this.changeDimension();
        window.addEventListener('resize',this.changeDimension);
    }

    baseFrame = styled.div`
        background: #AAFFA9;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #11FFBD, #AAFFA9);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #11FFBD, #AAFFA9); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    `;

    frame = styled.div`
        min-width:400px;
        max-width:40vw;
        height : 100vh;
        background-color: white;
        margin:auto auto;
        box-sizing: border-box;
        margin-right:0;
        padding: 5vw;

        @media (max-width:1000px){
            padding: 2vw;
        }
        @media (max-width:500px){
            padding:5vw;
        }
    `;

    greyDesc = styled.span`
        color:#999;
        font-size: 1rem;
    `;

    FieldLabel = styled.div`
        font-weight:500;
        color:black;
        
        font-size: 1.1rem;
        margin:0.5rem 0;
    `;

    BoldLink = styled.b`
        text-decoration : none !important;
        color: #9D0000;
    `;


    // google login 


     responseGoogleOnSuccess= async (response) =>{
    
        const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
        const mobileRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        
        let Email = response.profileObj.email
        const Password = "null";
        const FirstName = response.profileObj.givenName;
        const LastName = response.profileObj.familyName;

        if(emailRegex.test(Email)===false && mobileRegex.test(Email)===false)  
        this.setState({AlertText:'Please input a valid email address or mobile number',AlertSeverity:'error',SnackbarOpen:true})
        else{
            let Mobile = null;
            if(mobileRegex.test(Email)===true)  {Mobile=Email;Email=null;}

            let dataToSend = {Password : Password,Name:FirstName+" "+LastName,registertype:1};
            if(Mobile!=null)    dataToSend.Mobile = Mobile;
            else if(Email!=null)    dataToSend.Email = Email.toLowerCase();

            const data = await api.register(dataToSend);
            console.log(data);
            if(data.data.type==='error')    this.setState({SnackbarOpen:true,AlertText:data.data.message,AlertSeverity:'error'});
            else
            {
                if (data.data.type === "success") {
                    console.log(data.data);
                    await localStorage.setItem(
                      process.env.REACT_APP_AuthTokenKey,
                      data.data.Token
                    );
                    await localStorage.setItem("Email", data.data.user.Email);
                    await localStorage.setItem("Username", data.data.user.Username);
                    if (data.data.user.filled === false) {
                      setTimeout(() => {
                        window.location.href = "/create-your-profile";
                        // this.props.history.push('/create-your-profile');
                      }, 1000);
                    } else {
                      setTimeout(() => {
                        window.location.href = "/feed";
                      }, 1000);
                    }
                  }
               
                // await this.setState({SnackbarOpen:true,AlertText:data.data.message,AlertSeverity:'success'});
                // await localStorage.setItem("tech",data.data.tech);
                // setTimeout(() => {
                //     this.props.history.push('/signin');
                // }, 2*1000);
            }
        }




    }

    //facebook login

     responseFacebook = async (response) => {
    
    
        if(response.status == "unknown"){
            return ;
        }
      
        const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
        const mobileRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        
        let Email = response.email
        const Password = "null";
        const FirstName = response.name;
        const LastName ="";
        
    if(!Email){
        this.setState({AlertText:'Please link your Facebook Account with Email or Login via Google',AlertSeverity:'error',SnackbarOpen:true});
      }

        if(emailRegex.test(Email)===false && mobileRegex.test(Email)===false)   this.setState({AlertText:'Please input a valid email address or mobile number',AlertSeverity:'error',SnackbarOpen:true})
        else{
            let Mobile = null;
            if(mobileRegex.test(Email)===true)  {Mobile=Email;Email=null;}

            let dataToSend = {Password : Password,Name:FirstName+" "+LastName,registertype:1};
            if(Mobile!=null)    dataToSend.Mobile = Mobile;
            else if(Email!=null)    dataToSend.Email = Email.toLowerCase();

            const data = await api.register(dataToSend);
            console.log(data);
            if(data.data.type==='error')        this.setState({SnackbarOpen:true,AlertText:data.data.message,AlertSeverity:'error'});
            else
            {
                if (data.data.type === "success") {
                    console.log(data.data);
                    await localStorage.setItem(
                      process.env.REACT_APP_AuthTokenKey,
                      data.data.Token
                    );
                    await localStorage.setItem("Email", data.data.user.Email);
                    await localStorage.setItem("Username", data.data.user.Username);
                    if (data.data.user.filled === false) {
                      setTimeout(() => {
                        window.location.href = "/create-your-profile";
                        // this.props.history.push('/create-your-profile');
                      }, 1000);
                    } else {
                      setTimeout(() => {
                        window.location.href = "/feed";
                      }, 1000);
                    }
                  }
                // await this.setState({SnackbarOpen:true,AlertText:data.data.message,AlertSeverity:'success'});
                // await localStorage.setItem("tech",data.data.tech);
                // setTimeout(() => {
                //     this.props.history.push('/signin');
                // }, 2*1000);
            }
        }



    }



    // responseGoogleOnSuccess = async(response)=>{
    //     //TODO : When user sign on successfully using google sign in.
    //     console.log(response);
    //     console.log(response.profileObj);

    //     console.log("coming");

    //     const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    //     const mobileRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        
    //     let Email = response.profileObj.email
    //     const Password = "null";
    //     const FirstName = response.profileObj.givenName;
    //     const LastName = response.profileObj.familyName;

    //     if(emailRegex.test(Email)===false && mobileRegex.test(Email)===false)   this.setState({AlertText:'Please input a valid email address or mobile number',AlertSeverity:'error',SnackbarOpen:true})
    //     else{
    //         let Mobile = null;
    //         if(mobileRegex.test(Email)===true)  {Mobile=Email;Email=null;}

    //         let dataToSend = {Password : Password,Name:FirstName+" "+LastName};
    //         if(Mobile!=null)    dataToSend.Mobile = Mobile;
    //         else if(Email!=null)    dataToSend.Email = Email.toLowerCase();

    //         const data = await api.register(dataToSend);
    //         console.log(data);
    //         if(data.data.type==='error')        this.setState({SnackbarOpen:true,AlertText:data.data.message,AlertSeverity:'error'});
    //         else
    //         {
    //             await this.setState({SnackbarOpen:true,AlertText:data.data.message,AlertSeverity:'success'});
    //             await localStorage.setItem("tech",data.data.tech);
    //             setTimeout(() => {
    //                 this.props.history.push('/signin');
    //             }, 2*1000);
    //         }
    //     }

    // }

    responseGoogleOnFailure = (response)=>{
        //TODO : When user sign on is a failure.
        // alert('Error while Sign Up')
        console.log("error");
    }

    // responseFacebook = async (response) => {
    
    //     console.log(response);
      

     

    //     const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    //     const mobileRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        
    //     let Email = response.email
    //     const Password = "null";
    //     const FirstName = response.name;
    //     const LastName ="";

    //     if(emailRegex.test(Email)===false && mobileRegex.test(Email)===false)   this.setState({AlertText:'Please input a valid email address or mobile number',AlertSeverity:'error',SnackbarOpen:true})
    //     else{
    //         let Mobile = null;
    //         if(mobileRegex.test(Email)===true)  {Mobile=Email;Email=null;}

    //         let dataToSend = {Password : Password,Name:FirstName+" "+LastName};
    //         if(Mobile!=null)    dataToSend.Mobile = Mobile;
    //         else if(Email!=null)    dataToSend.Email = Email.toLowerCase();

    //         const data = await api.register(dataToSend);
    //         console.log(data);
    //         if(data.data.type==='error')        this.setState({SnackbarOpen:true,AlertText:data.data.message,AlertSeverity:'error'});
    //         else
    //         {
    //             await this.setState({SnackbarOpen:true,AlertText:data.data.message,AlertSeverity:'success'});
    //             await localStorage.setItem("tech",data.data.tech);
    //             setTimeout(() => {
    //                 this.props.history.push('/signin');
    //             }, 2*1000);
    //         }
    //     }



    // }

    TermsAndConditionChange = async()=>{
        const zx = this.state.TermsAndConditionChange;
        await this.setState({TermsAndConditionChange : !zx});
    }

    formOnSubmit =async(e) =>{
        console.log("coming");
        e.preventDefault();

        const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
        const mobileRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
        
        let Email = e.target.Email.value;
        const Password = e.target.Password.value;
        const FirstName = e.target.FirstName.value;
        const LastName = e.target.LastName.value;

        if(emailRegex.test(Email)===false && mobileRegex.test(Email)===false)   this.setState({AlertText:'Please input a valid email address or mobile number',AlertSeverity:'error',SnackbarOpen:true})
        else if(passwordRegex.test(Password)===false)                           this.setState({AlertText:'Please input a valid password. Check the i button for more information.',AlertSeverity:'error',SnackbarOpen:'true'})
        else{
            let Mobile = null;
            if(mobileRegex.test(Email)===true)  {Mobile=Email;Email=null;}

            let dataToSend = {Password : Password,Name:FirstName+" "+LastName,registertype:0};
            if(Mobile!=null)    dataToSend.Mobile = Mobile;
            else if(Email!=null)    dataToSend.Email = Email.toLowerCase();

            const data = await api.register(dataToSend);
            console.log(data);
            if(data.data.type==='error')        this.setState({SnackbarOpen:true,AlertText:data.data.message,AlertSeverity:'error'});
            else
            {
                await this.setState({SnackbarOpen:true,AlertText:data.data.message,AlertSeverity:'success'});
                await localStorage.setItem("tech",data.data.tech);
                setTimeout(() => {
                    this.props.history.push('/signin');
                }, 2*1000);
            }
        }
    }

    autoCloseSnackbar = (event,reason)=>{
        this.setState({SnackbarOpen:false});
    }
    
    
    PasswordContent = (
        <ul>
            <li>Must have atleast 8 characters</li>
            <li>Atleast one smallcase, one uppercase and one number</li>
            <li>Atleast one special character like @,#,$,%</li>
        </ul>
      );


      GoogleLoginAndFacebookLogin = (response) =>{
        console.log("res",response);
      }
 

    
  

    render() {
        return (
            
            <this.baseFrame>
                <Snackbar open={this.state.SnackbarOpen} autoHideDuration={7000} onClose={this.autoCloseSnackbar}>
                    <this.AlertMiUi  onClose={this.autoCloseSnackbar} severity={this.state.AlertSeverity}>{this.state.AlertText}</this.AlertMiUi>
                </Snackbar>
                <this.frame>
                    
                    <h4><b>Get's Started</b></h4>
                    <span>
                        <this.greyDesc>Already have an account? </this.greyDesc>
                        <Link to='/signin' replace><this.BoldLink> Log in</this.BoldLink></Link>
                    </span>
                    
                    <div style={{marginTop:'3rem'}} className='d-flex align-items-center justify-content-around' >
                    <div style={{marginRight:'1rem'}}>
                            <GoogleLogin 
                                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                    // clientId='833096552251-pgm8npcds8dg5tdei0tf4meia4v40j19.apps.googleusercontent.com'
                                    prompt='consent'
                                    buttonText={<b>Google</b>}
                                    className="GoogleLoginbutton"
                                    onSuccess={this.responseGoogleOnSuccess}
                                    onFailure={this.responseGoogleOnFailure}
                                    cookiePolicy='single_host_origin'
                                />
                            </div>
                            
                            <div style={{marginLeft:'1rem'}}>
                                        

                                        <FacebookLogin
                                            appId={process.env.REACT_APP_FB_AUTH_ID}
                                            // autoLoad = {true}
                                            fields="name,email,picture"
                                            size='small'
                                            icon= {<FaFacebook size='1.4em' />}
                                            className="FacebookLoginbutton"
                                            callback={this.responseFacebook} 
                                            textButton="Facebook"
                                            />
                                    </div>
                        {/* <div style={{marginRight:'1rem'}}>
                        <GoogleLogin 
                                // clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                clientId='833096552251-pgm8npcds8dg5tdei0tf4meia4v40j19.apps.googleusercontent.com'
                                prompt='consent'
                                buttonText={<b>{this.state.GoogleLoginText}</b>}
                                // className="GoogleLoginbutton"
                                onSuccess={this.responseGoogleOnSuccess}
                                onFailure={this.responseGoogleOnFailure}
                                cookiePolicy='single_host_origin'
                            />
                        </div>

                        <div style={{marginLeft:'1rem'}}>
                     

                            <FacebookLogin
                                appId={process.env.REACT_APP_FB_AUTH_ID}
                                // autoLoad = {true}
                                fields="name,email,picture"
                                size='small'
                                onClick={this.Facelogin}
                                icon= {<FaFacebook size='1.4em' />}
                                className="FacebookLoginbutton"
                                callback={this.responseFacebook} 
                                textButton={this.state.FacebookLoginText}
                                />
                        </div> */}
                    </div>

                    <Divider plain> <this.greyDesc>or</this.greyDesc> </Divider>

                    <form method='POST' action='/register' onSubmit={this.formOnSubmit}>
                        <div className='d-flex'>
                            <div style={{marginRight:'0.5rem'}}>
                                <this.FieldLabel>First Name</this.FieldLabel>
                                <TextField variant='outlined' color='primary' size='small' fullWidth placeholder='Elon' name='FirstName' required
                                InputProps={{ startAdornment: (<InputAdornment position="start"><AiOutlineUser /></InputAdornment>)}} 
                                />
                            </div>

                            <div style={{marginLeft:'0.5rem'}}>
                                <this.FieldLabel>Last Name</this.FieldLabel>
                                <TextField variant='outlined' color='primary' size='small' fullWidth placeholder='Musk' name='LastName' required
                                InputProps={{ startAdornment: (<InputAdornment position="start"><AiOutlineUser /></InputAdornment>)}} 
                                />
                            </div>
                        </div>

                        <this.FieldLabel>Email address / Mobile Number</this.FieldLabel>
                        <TextField variant='outlined' color='primary' size='small' fullWidth placeholder="elon@adoose.com" name='Email' required
                        InputProps={{ startAdornment: (<InputAdornment position="start"><FiLock /></InputAdornment>)}} 
                        />

                            <this.FieldLabel className='d-flex'>
                                <span>Password</span>
                                <span className="d-flex align-items-center"><Popover placement="topLeft" content={this.PasswordContent} title={false} ><IoInformationCircle /></Popover>
                            </span>
                            </this.FieldLabel>
                            
                        <TextField variant='outlined' color='primary' size='small' fullWidth  type="password" placeholder="••••••••" name='Password' required
                        InputProps={{ startAdornment: (<InputAdornment position="start"><IoKeyOutline /></InputAdornment>)}} />
                        <div style={{marginTop:'1rem'}} />
                        <Checkbox onChange={this.TermsAndConditionChange}><this.greyDesc>I agree to Adoose's <this.BoldLink>Terms of Service</this.BoldLink> and <this.BoldLink>Priavcy Policy</this.BoldLink>.</this.greyDesc></Checkbox>
                        <div style={{marginTop:'1rem'}} />
                        <Button disabled={!this.state.TermsAndConditionChange} htmlType='submit' type="primary" style={{borderRadius:'5px',padding:'0.5rem'}} block > <b>Sign up </b></Button>

                    </form>
                    
                </this.frame>
            </this.baseFrame>
        )
    }
}

export default withRouter(Register);