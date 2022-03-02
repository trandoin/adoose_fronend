import React,{useEffect} from 'react'
import {Icon,Button, Input,Form} from 'semantic-ui-react';
import * as api from "../../api/Profile";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from 'axios';


export default function SelectedChat(props) {
    console.log(props.chat)
    localStorage.setItem("User1",localStorage.getItem("Username"))
     localStorage.setItem("User2",props.chat["person"])
    localStorage.setItem("userToCall", props.chat["person"]);
    const [fee,setfee] = React.useState("")
    
     useEffect(()=>{
        async function fetchData() {
            const profileData = await api.getOthersProfileData({
                Username: props.chat["person"]
              });
              const fee = profileData.data.user.Fee;

              setfee(fee)
        }
        fetchData()
        
     },[])
     
    const [textToSend, setTextToSend] = React.useState("");
    const [open, setOpen] = React.useState("")
    const [userToSend,setUserToSend] = React.useState(props.chat["person"]);
    if(userToSend!=props.chat["person"])
    {
        setTextToSend("");
        setUserToSend(props.chat["person"]);
    }

    
    const useFocus = () => {
        const htmlElRef = React.useRef(null)
        const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
    
        return [ htmlElRef, setFocus ] 
    }

    const [inputRef, setInputFocus] = useFocus()

    const LeftMsg = ({msg,time}) =>{

        return (
            <div  className="px-2 py-1 m-1 d-flex ms-auto" style={{maxWidth:'60%',minWidth:'20%', width:'fit-content',borderRadius:'5px', borderTopLeftRadius:'0px', background:'turquoise'}}>
                <div className="d-flex flex-column w-100">
                    <div className="text-justify p-1">{msg}</div>
                    <div className="d-flex align-items-center justify-content-end" style={{fontSize:'0.7rem'}}>{time}</div>
                </div>
            </div>
        );
    }

    const RightMsg = ({msg,time})=>{
        return (
            <div className="px-2 py-1 m-1 d-flex " style={{maxWidth:'60%',minWidth:'20%', width:'fit-content',borderRadius:'5px', borderTopLeftRadius:'0px', background:'turquoise'}}>
                <div className="d-flex flex-column w-100">
                    <div className="text-justify p-1">{msg}</div>
                    <div className="d-flex align-items-center justify-content-end" style={{fontSize:'0.7rem'}}>{time}</div>
                </div>
            </div>
        );
    }
    const centerDate = (msg)=>{

    }

    const AlwaysScrollToBottom = () => {
        const elementRef = React.useRef();
        React.useEffect(() => elementRef.current.scrollIntoView());
        return <div ref={elementRef} />;
      };

    const Messages = ()=>{

        if(!props.chat || !props.chat.messages)
            return <></>;
        const zx = props.chat.messages.map((l,index)=>{

            let index1 = l.indexOf('$');
            const msg = l.substr(index1+1,l.length - index1-1 - 25);
            let time = l.substr(-24);
            
            let newDate = 0;

            if(l.substr(0,index1)===props.chat["person"])
            {
                // sent by other Person
                return (
                    <>
                    <LeftMsg msg={msg} time={new Date(time).toISOString().substr(-13,5)} key={index} />
                    </>
                )
            }
            else{
                // sent by me
                return (
                    <>
                    <RightMsg msg = {msg} time={new Date(time).toISOString().substr(-13,5)} key={index} />
                    </>
                )
            }
        });
        return <div className="d-flex flex-column">
            {zx}
            <AlwaysScrollToBottom />
        </div>;
    }

    const loadScript = (src) => {
        return new Promise((resolve) => {
          const script = document.createElement('script')
          script.src = src
          script.onload = () => {
            resolve(true)
          }
          script.onerror = () => {
            resolve(false)
          }
          document.body.appendChild(script)
        })
      };
    
      const displayRazorpay = async () => {
        const res = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );
    
        if (!res) {
          alert("Razorpay SDK failed to load. Are you online?");
          return;
        }
        const profileData = await api.getOthersProfileData({
          Username: props.chat["person"]
        });
        const fee = profileData.data.user.Fee;
        console.log(fee) 
        const req = {
          'Fee':fee
        }
        var data = await axios.post("http://localhost:5000/razorpay",req);
    
         console.log(data.data)
         data = data.data
         console.log(data.amount.toString())
         const NetAmount = 0.9 * fee;
         console.log(NetAmount)
        const options = {
          key: "rzp_test_ejKxxUmceahR6k",
          currency: data.currency,
          amount: data.amount,
          order_id: data.id,
          name: "Service Fee",
          description: "Thank you choosing Razorpay",
          handler: async function (response) {
            const res = await axios.post(
              "http://localhost:5000/payment/verify",
              response
            );
            if (res.signatureIsValid == "false") {
              alert("Error in Signature Validation");
            } else {
              const req = {
                Username1: localStorage.getItem('userToCall'),
                Username2: localStorage.getItem("Username"),
                NetAmount: NetAmount
              }
              axios.post("http://localhost:5000/orders/add",req)
              window.location.href = '/videocall'
            }
          },
          prefill: {
            email: localStorage.getItem('Email'),
            phone_number: "9899999999",
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });
      };
    
      const handleClickOpen = () => {
        setOpen(true)
      };
    
      const handleClose = () => {
       setOpen(false)
        displayRazorpay()
      };

    return (
        <div className="d-flex flex-column" style={{height:'100vh'}}>
            <div className="px-3 w-100 py-3 d-flex align-items-center" style={{height:'4rem',background:'#ccc', position:'sticky', top:'0'}}>
                <span style={{width:'3rem', height:'3rem', borderRadius:'50%'}}><img src={`https://firebasestorage.googleapis.com/v0/b/adoose-cea6c.appspot.com/o/${props.chat["person"]}%2FprofilePic%2Fimage?alt=media&token=37c010fc-c25e-4bb3-a366-a7965a695f9b`} style={{borderRadius:'50%' , width:'100%', height:'100%'}} /></span>
                <span className="ms-2" style={{fontWeight:'600', fontSize:'1.2rem'}}>{props.chat["person"]}</span>
                <Button className="ms-auto" style={{background:'transparent'}} onClick={handleClickOpen}>Superchat</Button>
            
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Procedding towards Video Chat"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        You need to pay <strong>{fee}</strong> to
                        proceed towards video chat
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose} autoFocus>
                        Pay Now
                      </Button>
                    </DialogActions>
                  </Dialog>
            </div>
            <div className="flex-grow p-2 border-1" style={{overflowY:'scroll'}}>
                <div><Messages /></div>
            </div>
            
            <div className="mt-auto mb-2 p-1">
                    <Form className="d-flex">
                    <Input  ref={inputRef}  onClick={setInputFocus()} className="w-100" value={textToSend} onChange={(e,data)=>{setTextToSend(data.value)}} />
                    <Button icon="send" className="ms-2 p-3" onClick={async(e)=>{
                        props.sendMsg(props.chat["person"],`${props.chat["person"]}$${textToSend}$${new Date(Date.now()).toISOString()}`,textToSend);
                        setTextToSend("");
                        }} />
                    </Form>
            </div>
        </div>
    );

    setInputFocus();

}
