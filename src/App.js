import React from 'react';
import { useEffect,useState } from 'react';
import {BrowserRouter, Switch, Route,Redirect} from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ErrorPageNotFound from './components/Error/ErrorPageNotFound';
import ProfilePage from './components/Profile/ProfilePage';
import Feed from './components/feed/feed';
import OtherProfile from './components/OtherProfile/OtherProfile';
import ForgetPassword from './components/Verify/ForgetPassword';
import ProfileCreation from './components/Profile/ProfileCreation';
import VerificationMail from './components/Verify/VerificationMail';
import CreatePost from './components/CreatePost/CreatePost';
import ChatAll from './components/Chat/ChatAll';
import Call from './components/Call/Call';
import Support from './components/Extra/Support';
import Home from './HomePage/home';
import Orders from './components/MyOrders/MyOrders'
import EditProfile from './components/Profile/EditProfile';

const App = () => { 


  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(()=>{func();},[]);
  
  const func = async()=>{
    const data = localStorage.getItem(process.env.REACT_APP_AuthTokenKey);
  
    if(data===null || data===undefined || (!localStorage.getItem("Email") && !localStorage.getItem("Mobile")))
    {
      await setIsLoggedIn(false);
    }
    else
    {
        setIsLoggedIn(true);
    }
  }

  return (
      <BrowserRouter basename='/'>
        {
          isLoggedIn===false
          ?
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/signin' component={Login} />
              <Route exact path='/signup' component={Register} />
              <Route exact path='/user/forget/:id' component={ForgetPassword} />
              <Route exact path='/user/verification/:id' component={VerificationMail} />
              <Route exact path='/support' component={Support} />
              <Route path='/' render={()=><Redirect to='/' />} />
            </Switch>
          :
          <>
          {
            isLoggedIn===true
            ?
            <Switch>
           
              <Route exact path='/profile' component={ProfilePage} />
              <Route exact path='/editprofile' component={EditProfile} />
              <Route exact path='/signin' render={()=><Redirect to='/feed' />} />
              <Route exact path='/signup' render={()=><Redirect to='/feed' />} />
              <Route exact path='/feed' component={Feed} />
              <Route exact path='/create-your-profile' component={ProfileCreation} />
              <Route exact path='/users/:user' component={OtherProfile} />
              <Route exact path='/post/new' component={CreatePost} />
              <Route exact path='/chat' component={ChatAll} />
              <Route exact path='/videocall' component={Call} />
              <Route exact path='/support' component={Support} />
              <Route exact path='/orders' component={Orders} />
              <Route><Redirect to="/feed"></Redirect></Route>
              {/* <Route path='/' component={ErrorPageNotFound} /> */}
            </Switch>
            :
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"100vh"}}>Loading ...</div>
          }
          </>
        }
      </BrowserRouter>
  );
}

export default App;
