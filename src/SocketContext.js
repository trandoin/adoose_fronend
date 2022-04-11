import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

import { Tab, Button, Dropdown, Icon } from "semantic-ui-react";
import { Rate } from "antd";
import Modal from "react-bootstrap/Modal";
import { IoSettingsOutline } from "react-icons/io5";
import { TiTickOutline } from "react-icons/ti";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsChatDots, BsFillBarChartFill } from "react-icons/bs";
import * as api from "./api/Profile";

const SocketContext = createContext();

const socket = io("https://adoose-backend.herokuapp.com");

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

const ContextProvider = ({ children }) => {

  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState(localStorage.getItem('Username'));
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [muted,setMuted] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {

    
    
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        console.log("Myvideo : ",currentStream);
        myVideo.current.srcObject = currentStream;
      });

    socket.on('me', (id) => {
      setMe(id);
      socket.emit('saveUsername',({id:id, Username : localStorage.getItem("Username")}));
    });

    socket.on('callUser', ({ data,from, name: callerName, signal }) => {
      console.log("Recieving calll");
      console.log(data,from,callerName,signal);
      if(data==='yes'){
        console.log("yaha aara kya");
        setCall({ isReceivingCall: true, from, name: callerName, signal });
      }
    });

    setTimeout(() => {
      if(localStorage.getItem("CallingPerson"))
    {
      socket.emit('remindmeVideocall',{user:localStorage.getItem("Username"), other:localStorage.getItem("CallingPerson")});
      localStorage.removeItem('CallingPerson');
    }
    }, 3000);
  }, []);

  

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      console.log("Peer signalling 12345431");
      console.log(Date.now());
      console.log(localStorage.getItem("userToCall"))
      socket.emit('callUser', { userToCall: id,meetId : id, otherPerson : localStorage.getItem("userToCall"), signalData: data, from: name,name});
    });

    peer.on('stream', (currentStream) => {
      console.log("Peer streaming...");
      console.log(currentStream);
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      console.log("Call Accepted");
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const [RateModal,SetRateModal] = React.useState(false)

  const [stars,Setstars] = React.useState(0)

  const CloseRateModal = () =>{
    SetRateModal(false);
    window.location = '/chat';
  }

  const leaveCall = () => {
    setCallEnded(true);
   
    connectionRef.current.destroy();
      SetRateModal(true);
      if(stars>0) {

    window.location = '/chat';
      }
  };

  return (
    <div>
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      muted,
      setMuted,
      leaveCall,
      answerCall,
    }}
    >
      {children}
    </SocketContext.Provider>
    <Modal show={RateModal} onHide={CloseRateModal}>
                <Modal.Body>
                <span>Rate the user</span>
                  <Rate
                    style={{ color: "#ffc800", width: "100%", margin: "auto" }}
                    className="text-center"
                    onChange={(e) => {
                      console.log(e);
                      Setstars(e)
                      // this.setState({ GivingStars: e });
                    }}
                    value={stars}
                   // value={this.state.GivingStars}
                  />
           
                  <div style={{marginTop:'2px'}}>Feedback</div>
                  <textarea rows="4" cols="50" id="comment" form="usrform" style={{marginTop:'11px'}} placeholder="Enter your feedback">
                    </textarea>
                </Modal.Body>
                <Modal.Footer>
                  <Button color="grey" onClick={CloseRateModal}>
                    Close
                  </Button>
                  <Button
                    color="blue"
                    onClick={() => {
                      // this.saveRating({
                      //   Username1: localStorage.getItem("Username"),
                      //   Username2: this.state.Username,
                      //   stars: this.state.GivingStars,
                      // });
                      console.log(stars);
                      console.log(document.getElementById("comment").value)
                      const req = {
                        'Username1': localStorage.getItem("User1"),
                        'Username2': localStorage.getItem("User2"),
                        'description':document.getElementById("comment").value,
                        'rating': stars
                      }
                      api.saveLeadsData(req)
                      CloseRateModal();
                    }}
                  >
                    Rate him
                  </Button>
                </Modal.Footer>
              </Modal>

    </div>
  );
};

export { ContextProvider, SocketContext };
