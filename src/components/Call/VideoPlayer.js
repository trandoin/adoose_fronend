import React, { useContext } from 'react';
import { SocketContext } from '../../SocketContext';
import { Button } from 'semantic-ui-react';


const VideoPlayer = () => {
  
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call,me,callUser,leaveCall,answerCall } = useContext(SocketContext);
    
  return (

    <div style={{background:"url('https://firebasestorage.googleapis.com/v0/b/adoose-3a465.appspot.com/o/chat_background.jpg?alt=media')" }}>
        <div  style={{height:'100vh'}} className={`d-flex flex-column align-items-center justify-content-center mx-3 ${window.innerWidth<800?"flex-column" : ""}`}>
         
          <div className={`d-flex align-items-center justify-content-center mx-3 ${window.innerWidth<800?"flex-column" : ""}`}>
            <div className='w-100'>
              {
                window.innerWidth<800?
                <div className="w-100">
                  <video style={{transform: 'scale(-1, 1)', filter: 'FlipH', width:'100%', borderRadius:'10px'}} playsInline ref={myVideo} autoPlay>
                  <span>ABCDEF</span>
                </video>
                <span>{name}</span>
                  </div>
                :
                <div  className='w-100'>
                  <video style={{transform: 'scale(-1, 1)', filter: 'FlipH', borderRadius:'10px'}} playsInline ref={myVideo} autoPlay></video>
                  <br />
                <span>{name}</span>
                </div>
              }
              </div>

          {(callAccepted && !callEnded )?
              <div  className='w-100'>
                
                {
                  window.innerWidth<800?
                  <video style={{border:'1px solid black',margin:'1rem',transform: 'scale(-1, 1)', filter: 'FlipH', width:'100%', borderRadius:'10px'}}  playsInline ref={userVideo} autoPlay>
                    
                  </video>
                  :
                  <div  className='w-100'>
                    <video style={{border:'1px solid black',margin:'1rem',transform: 'scale(-1, 1)', filter: 'FlipH', borderRadius:'10px'}} playsInline ref={userVideo} autoPlay></video>
                    <br />
                    {
                      call.from?
                      <span>{call.from}</span>
                      :
                      <span>{localStorage.getItem("userToCall")}</span>
                    }
                  </div>
                }
              </div>
           : null
          }
        </div>

          <div>
            {
              !callAccepted && !callEnded ? <Button style={window.innerWidth>1000?{margin:'2rem'}:{}} onClick={()=>{callUser(me)}} color='blue'>Start Call</Button> : null 
            }
          </div>

          <div>
            {
              callAccepted && !callEnded ? <Button style={window.innerWidth>1000?{margin:'2rem'}:{}} onClick={leaveCall} color='blue'>End Call</Button> : null 
            }
          </div>


        

      
          <>
          {
            (call.isReceivingCall && !callAccepted)?
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <h1>{call.name} is calling:</h1>
            {
              localStorage.setItem("User1",localStorage.getItem("Username"))
              }
              {
              localStorage.setItem("User2",call.name)
            }
            <Button onClick={answerCall}>Answer</Button>
          </div>
          :
          null
          }
          </>

        </div>  
  
        </div>
  );
};

export default VideoPlayer;