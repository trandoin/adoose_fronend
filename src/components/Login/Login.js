import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { Divider } from "antd";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { FiLock } from "react-icons/fi";
import { FaFacebook } from "react-icons/fa";
import { IoKeyOutline } from "react-icons/io5";
import { Button, Popover } from "antd";
import { IoInformationCircle } from "react-icons/io5";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import * as api from "../../api/Auth.js";

import Glogin from './Glogin';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      windowWidth: 0,
      windowHeight: 0,
      GoogleLoginText: "Sign In with Google",
      FacebookLoginText: "Sign In with Facebook",
      AlertSeverity: "error",
      SnackbarOpen: false,
      SnackbarOpen2: false,
      AlertText: "Error",
      Guest: false
    };
  }

  AlertMiUi = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

  changeDimension = () => {
    let x = window.innerWidth;
    let y = window.innerHeight;
    this.setState({ windowWidth: x, windowHeight: y });
    let g = "Sign In with Google";
    let f = "Sign In with Facebook";
    if (x > 800) this.setState({ GoogleLoginText: g, FacebookLoginText: f });
    else
      this.setState({
        GoogleLoginText: "Sign In",
        FacebookLoginText: "Sign In",
      });
  };

  componentDidMount = () => {
    this.changeDimension();
    window.addEventListener("resize", this.changeDimension);

    // Just registered notification
    if (
      localStorage.getItem("tech") === "Email" ||
      localStorage.getItem("tech") === "Mobile"
    ) {
      this.setState({ SnackbarOpen2: true });
      localStorage.removeItem("tech");
    }
  };

  formOnSubmit = async (e) => {

    e.preventDefault();
    console.log(e.target)
    console.log(this.state.Guest)
    let Email = e.target.Email.value;
    const Password = e.target.Password.value;
    console.log(Email, Password);

    const usernameRegex = /^[a-zA-Z_-][a-z0-9_-]{3,15}$/;
    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    const mobileRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

    if (
      emailRegex.test(Email) === false &&
      mobileRegex.test(Email) === false &&
      usernameRegex.test(Email) === false
    )
      this.setState({
        AlertText:
          "Please input a valid email address or mobile number or username",
        AlertSeverity: "error",
        SnackbarOpen: true,
      });
    else if (passwordRegex.test(Password) === false)
      this.setState({
        AlertText:
          "Please input a valid password. Check the i button for more information.",
        AlertSeverity: "error",
        SnackbarOpen: "true",
      });
    else {
      let Mobile = null;
      if (mobileRegex.test(Email) === true) {
        Mobile = Email;
        Email = null;
      }

      let Username = null;
      if (usernameRegex.test(Email) === true) {
        Username = Email;
        Email = null;
      }

      let dataToSend = { Password: Password };
      if (Email != null) dataToSend.Email = Email.toLowerCase();
      else if (Username != null) dataToSend.Username = Username;
      else if (Mobile != null) dataToSend.Mobile = Mobile;
      dataToSend.guest = this.state.Guest
      console.log(dataToSend.guest)
      const data = await api.login(dataToSend);
      console.log(data);

      if (data.data.message === undefined)
        this.setState({ SnackbarOpen2: true });
      else
        this.setState({
          SnackbarOpen: true,
          AlertSeverity: data.data.type,
          AlertText: data.data.message,
        });

      if (data.data.type === "success") {
        console.log(data.data);
        await localStorage.setItem(
          process.env.REACT_APP_AuthTokenKey,
          data.data.Token
        );
        if(dataToSend.guest==true){
          localStorage.setItem("Guest",true);
        }
        await localStorage.setItem("Email", data.data.user.Email);
        await localStorage.setItem("Username", data.data.user.Username);
        if (data.data.user.filled === false) {
          setTimeout(() => {
            if(dataToSend.guest==true){
              window.location.href = "/feed";
            } else{
            window.location.href = "/create-your-profile";
            }
            // this.props.history.push('/create-your-profile');
          }, 1000);
        } else {
          setTimeout(() => {
            window.location.href = "/feed";
          }, 1000);
        }
      }
    }
  };

  baseFrame = styled.div`
    background: #9d50bb; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to right,
      #6e48aa90,
      #9d50bb90
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to right,
      #6e48aa90,
      #9d50bb90
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  `;

  frame = styled.div`
    min-width: 400px;
    max-width: 40vw;
    height: 100vh;
    background-color: white;
    margin: auto auto;
    box-sizing: border-box;
    margin-right: 0;
    padding: 5vw;
    @media (max-width: 1000px) {
      padding: 2vw;
    }
    @media (max-width: 500px) {
      padding: 5vw;
    }
  `;

  greyDesc = styled.span`
    color: #999;
    font-size: 1rem;
  `;

  FieldLabel = styled.div`
    font-weight: 500;
    color: black;

    font-size: 1.1rem;
    margin: 0.5rem 0;
  `;

  BoldLink = styled.b`
    text-decoration: none !important;
    color: #9d0000;
  `;

  // responseGoogleOnSuccess = async(response) => {

  //   //TODO : When user log in successfully using google sign in.
  //    console.log(response);
  //    console.log(response.profileObj)
  //    let Email = response.profileObj.email
  //    const Password = "null";
  //   console.log(Email, Password);

  //   const usernameRegex = /^[a-zA-Z_-][a-z0-9_-]{3,15}$/;
  //   const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  //   const mobileRegex =
  //     /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  //   const passwordRegex =
  //     /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

  //   if (
  //     emailRegex.test(Email) === false &&
  //     mobileRegex.test(Email) === false &&
  //     usernameRegex.test(Email) === false
  //   )
  //     this.setState({
  //       AlertText:
  //         "Please input a valid email address or mobile number or username",
  //       AlertSeverity: "error",
  //       SnackbarOpen: true,
  //     });
  //   else {
  //     let Mobile = null;
  //     if (mobileRegex.test(Email) === true) {
  //       Mobile = Email;
  //       Email = null;
  //     }

  //     let Username = null;
  //     if (usernameRegex.test(Email) === true) {
  //       Username = Email;
  //       Email = null;
  //     }


  //     let dataToSend = { Password: Password };
  //     if (Email != null) dataToSend.Email = Email.toLowerCase();
  //     else if (Username != null) dataToSend.Username = Username;
  //     else if (Mobile != null) dataToSend.Mobile = Mobile;
     

  //     const data = await api.login(dataToSend);
  //     console.log(data);

  //     if (data.data.message === undefined)
  //       this.setState({ SnackbarOpen2: true });
  //     else
  //       this.setState({
  //         SnackbarOpen: true,
  //         AlertSeverity: data.data.type,
  //         AlertText: data.data.message,
  //       });

  //     if (data.data.type === "success") {
  //       console.log(data.data);
  //       await localStorage.setItem(
  //         process.env.REACT_APP_AuthTokenKey,
  //         data.data.Token
  //       );
  //       await localStorage.setItem("Email", data.data.user.Email);
  //       await localStorage.setItem("Username", data.data.user.Username);
  //       if (data.data.user.filled === false) {
  //         setTimeout(() => {
  //           window.location.href = "/create-your-profile";
  //           // this.props.history.push('/create-your-profile');
  //         }, 1000);
  //       } else {
  //         setTimeout(() => {
  //           window.location.href = "/feed";
  //         }, 1000);
  //       }
  //     }
  //   }
  // };

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
    
    console.log(response);
    if(response.status == "unknown"){
        return ;
    }
  
    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    const mobileRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    
    let Email = response.email
    const Password = "null";
    const FirstName = response.name;
    const LastName ="";

    if(emailRegex.test(Email)===false && mobileRegex.test(Email)===false)   this.setState({AlertText:'Please input a valid email address or mobile number',AlertSeverity:'error',SnackbarOpen:true})
    else{
        // let Mobile = null;
        // if(mobileRegex.test(Email)===true)  {Mobile=Email;Email=null;}

        // let dataToSend = {Password : Password,Name:FirstName+" "+LastName,registertype:1};
        // if(Mobile!=null)    dataToSend.Mobile = Mobile;
        // else if(Email!=null)    dataToSend.Email = Email.toLowerCase();

        // const data = await api.register(dataToSend);
        // console.log(data);
        // if(data.data.type==='error')        this.setState({SnackbarOpen:true,AlertText:data.data.message,AlertSeverity:'error'});
        // else
        // {
        //     if (data.data.type === "success") {
        //         console.log(data.data);
        //         await localStorage.setItem(
        //           process.env.REACT_APP_AuthTokenKey,
        //           data.data.Token
        //         );
        //         await localStorage.setItem("Email", data.data.user.Email);
        //         await localStorage.setItem("Username", data.data.user.Username);
        //         if (data.data.user.filled === false) {
        //           setTimeout(() => {
        //             window.location.href = "/create-your-profile";
        //             // this.props.history.push('/create-your-profile');
        //           }, 1000);
        //         } else {
        //           setTimeout(() => {
        //             window.location.href = "/feed";
        //           }, 1000);
        //         }
        //       }
        //     // await this.setState({SnackbarOpen:true,AlertText:data.data.message,AlertSeverity:'success'});
        //     // await localStorage.setItem("tech",data.data.tech);
        //     // setTimeout(() => {
        //     //     this.props.history.push('/signin');
        //     // }, 2*1000);
        // }
    }



}






  responseGoogleOnFailure = (response) => {
    console.log(response);
    console.log(response.profile)
    // alert('Error while Loggin In')
    //TODO : When user log in is a failure.
  };

  // responseFacebook = async (response) => {
  //   //TODO : when user log in using facebook
   
  //   let Email = response.email
  //   const Password = "null";


  //  const usernameRegex = /^[a-zA-Z_-][a-z0-9_-]{3,15}$/;
  //  const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  //  const mobileRegex =
  //    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  //  const passwordRegex =
  //    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

  //  if (
  //    emailRegex.test(Email) === false &&
  //    mobileRegex.test(Email) === false &&
  //    usernameRegex.test(Email) === false
  //  )
  //    this.setState({
  //      AlertText:
  //        "Please input a valid email address or mobile number or username",
  //      AlertSeverity: "error",
  //      SnackbarOpen: true,
  //    });
  //  else {
  //    let Mobile = null;
  //    if (mobileRegex.test(Email) === true) {
  //      Mobile = Email;
  //      Email = null;
  //    }

  //    let Username = null;
  //    if (usernameRegex.test(Email) === true) {
  //      Username = Email;
  //      Email = null;
  //    }


  //    let dataToSend = { Password: Password };
  //    if (Email != null) dataToSend.Email = Email.toLowerCase();
  //    else if (Username != null) dataToSend.Username = Username;
  //    else if (Mobile != null) dataToSend.Mobile = Mobile;
    

  //    const data = await api.login(dataToSend);
  //    console.log(data);

  //    if (data.data.message === undefined)
  //      this.setState({ SnackbarOpen2: true });
  //    else
  //      this.setState({
  //        SnackbarOpen: true,
  //        AlertSeverity: data.data.type,
  //        AlertText: data.data.message,
  //      });

  //    if (data.data.type === "success") {
  //      console.log(data.data);
  //      await localStorage.setItem(
  //        process.env.REACT_APP_AuthTokenKey,
  //        data.data.Token
  //      );
  //      await localStorage.setItem("Email", data.data.user.Email);
  //      await localStorage.setItem("Username", data.data.user.Username);
  //      if (data.data.user.filled === false) {
  //        setTimeout(() => {
  //          window.location.href = "/create-your-profile";
  //          // this.props.history.push('/create-your-profile');
  //        }, 1000);
  //      } else {
  //        setTimeout(() => {
  //          window.location.href = "/feed";
  //        }, 1000);
  //      }
  //    }
  //  }
  // };

  autoCloseSnackbar = (event, reason) => {
    this.setState({ SnackbarOpen: false });
  };

  snackbarClose2 = () => {
    this.setState({ SnackbarOpen2: false });
  };

  forgetPassword = async () => {
    let email = prompt(
      "Enter your registered email address or registered mobile number"
    );
    console.log(email);
    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    const mobileRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (emailRegex.test(email)) {
      const data = await api.forgetPassword({ Email: email.toLowerCase() });
      alert(data.data.type + " : " + data.data.message);
    } else if (mobileRegex.test(email)) {
      const data = await api.forgetPassword({ Mobile: email });
      alert(data.data.type + " : " + data.data.message);
    } else {
      alert("Enter a valid input");
    }
  };

  sendAgainVerification = async () => {
    let email = prompt(
      "Enter your registered email address or registered mobile number"
    );
    console.log(email);

    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    const mobileRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    if (emailRegex.test(email)) {
      const data = await api.verificationMail({ Email: email });
      alert(data.data.type + " : " + data.data.message);
    } else if (mobileRegex.test(email)) {
      const data = await api.verificationMail({ Mobile: email });
    } else {
      alert("Enter a valid input");
    }
  };

  PasswordContent = (
    <ul>
      <li>Must have atleast 8 characters</li>
      <li>Atleast one smallcase, one uppercase and one number</li>
      <li>Atleast one special character like @,#,$,%</li>
    </ul>
  );

   clicked =()=>{
    this.setState({Guest:true})
  }

  render() {
    return (
      <this.baseFrame>
        <Snackbar
          open={this.state.SnackbarOpen}
          autoHideDuration={5000}
          onClose={this.autoCloseSnackbar}
        >
          <this.AlertMiUi
            onClose={this.autoCloseSnackbar}
            severity={this.state.AlertSeverity}
          >
            {this.state.AlertText}
          </this.AlertMiUi>
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={this.state.SnackbarOpen2}
          onClose={this.snackbarClose2}
          className="GreenOfSnackbar"
          message="Kindly verify your account on registered Email/whatsapp before login."
          key="bottomleft1"
        />
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={this.state.SnackbarOpen2}
          onClose={this.snackbarClose2}
          message="Kindly verify your account on registered Email/whatsapp before login. Click to resend the verification mail"
          key="bottomleft"
          style={{ cursor: "pointer" }}
          onClick={this.sendAgainVerification}
        />

        <this.frame>
          <h4>
            <b>Get's Started</b>
          </h4>
          <span>
            <this.greyDesc>Don't have an account? </this.greyDesc>
            <Link to="/signup" replace>
              <this.BoldLink> Sign up</this.BoldLink>
            </Link>
          </span>

          <div
            style={{ marginTop: "3rem" }}
            className="d-flex align-items-center justify-content-around"
          >
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
            {/* <div style={{ marginRight: "1rem" }}>
             
               <GoogleLogin 
                                // clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                // clientId='833096552251-pgm8npcds8dg5tdei0tf4meia4v40j19.apps.googleusercontent.com'
                                clientId='15465852766-2orbt8pkp9u8dce1q2leh1637u5en65k.apps.googleusercontent.com'
                                prompt='consent'
                                buttonText={<b>{this.state.GoogleLoginText}</b>}
                                // className="GoogleLoginbutton"
                                onSuccess={this.responseGoogleOnSuccess}
                                onFailure={this.responseGoogleOnFailure}
                                cookiePolicy='single_host_origin' 
                            />
            </div>

            <div style={{ marginLeft: "1rem" }}>
          
        

              <FacebookLogin
                appId={process.env.REACT_APP_FB_AUTH_ID}
                // autoLoad={true}
                fields="email"
                size="small"
                icon={<FaFacebook size="1.4em" />}
                className="FacebookLoginbutton"
                callback={this.responseFacebook}
                textButton={this.state.FacebookLoginText}
              />
            </div> */}
            
          </div>

          <Divider plain>
            {" "}
            <this.greyDesc>or</this.greyDesc>{" "}
          </Divider>

          <form method="POST" onSubmit={this.formOnSubmit}>
            <this.FieldLabel>
              Email address / Mobile Number / Username
            </this.FieldLabel>
            <TextField
              variant="outlined"
              color="primary"
              size="small"
              fullWidth
              placeholder="elon@adoose.com"
              name="Email"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiLock />
                  </InputAdornment>
                ),
              }}
            />

            <this.FieldLabel className="d-flex">
              <span>Password</span>
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
              name="Password"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IoKeyOutline />
                  </InputAdornment>
                ),
              }}
            />

            <div style={{ marginTop: "1rem" }} />

            <div style={{ marginTop: "1rem" }} />

            <Button
              htmlType="submit"
              type="primary"
              style={{ borderRadius: "5px", padding: "0.5rem" }}
              block
            >
              {" "}
              <b>log in </b>
            </Button>

            <div className="d-flex align-items-center justify-content-end">
              <span
                onClick={this.forgetPassword}
                style={{ color: "blue", fontSize: "0.9rem", cursor: "pointer" }}
              >
                Forget Password ?
              </span>
            </div>

            <Divider plain>
              {" "}
              <this.greyDesc>or</this.greyDesc>{" "}
            </Divider>

            <Button
              type="primary"
              htmlType="submit"
              ghost
              style={{ borderRadius: "5px", padding: "0.5rem" }}
              block
              onClick={this.clicked}
            >
              <b> Login using Guest account </b>
            </Button>
            <this.greyDesc style={{ fontWeight: "600", fontSize: "0.9rem" }}>
              *Using this way, you will miss many of our features, that enhance
              your personal experience.
            </this.greyDesc>
          </form>
        </this.frame>
      </this.baseFrame>
    );
  }
}
export default withRouter(Login);
