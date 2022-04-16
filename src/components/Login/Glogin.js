import React from 'react'
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import {FaFacebook} from 'react-icons/fa';
import * as api from '../../api/Auth';
const Glogin = (props) => {
    const responseGoogleOnSuccess= async (response) =>{
    
        const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
        const mobileRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        
        let Email = response.profileObj.email
        const Password = "null";
        const FirstName = response.profileObj.givenName;
        const LastName = response.profileObj.familyName;

        if(emailRegex.test(Email)===false && mobileRegex.test(Email)===false)   props.onChnageSOmething({AlertText:'Please input a valid email address or mobile number',AlertSeverity:'error',SnackbarOpen:true});
        // this.setState({AlertText:'Please input a valid email address or mobile number',AlertSeverity:'error',SnackbarOpen:true})
        else{
            let Mobile = null;
            if(mobileRegex.test(Email)===true)  {Mobile=Email;Email=null;}

            let dataToSend = {Password : Password,Name:FirstName+" "+LastName,registertype:1};
            if(Mobile!=null)    dataToSend.Mobile = Mobile;
            else if(Email!=null)    dataToSend.Email = Email.toLowerCase();

            const data = await api.register(dataToSend);
            console.log(data);
            if(data.data.type==='error')        props.onChnageSOmething({AlertText:'Please input a valid email address or mobile number',AlertSeverity:'error',SnackbarOpen:true});
            // setState({SnackbarOpen:true,AlertText:data.data.message,AlertSeverity:'error'});
            else
            {
                props.onChnageSOmething({AlertText:'Please input a valid email address or mobile number',AlertSeverity:'error',SnackbarOpen:true});
                // await this.setState({SnackbarOpen:true,AlertText:data.data.message,AlertSeverity:'success'});
                await localStorage.setItem("tech",data.data.tech);
                setTimeout(() => {
                    this.props.history.push('/signin');
                }, 2*1000);
            }
        }




    }
    const responseGoogleOnFailure = () =>{
    }
    const responseFacebook =() =>{

    }
    return (<>
        <div style={{marginRight:'1rem'}}>
        <GoogleLogin 
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                // clientId='833096552251-pgm8npcds8dg5tdei0tf4meia4v40j19.apps.googleusercontent.com'
                prompt='consent'
                buttonText={<b>Google</b>}
                className="GoogleLoginbutton"
                onSuccess={responseGoogleOnSuccess}
                onFailure={responseGoogleOnFailure}
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
                         callback={responseFacebook} 
                         textButton="Facebook"
                         />
                 </div>
        </>
    )
}

export default Glogin
