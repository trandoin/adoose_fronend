import Navbar from '../Navbar/Navbar'
import React, { Component } from 'react'
import * as api from '../../api/feed';
import * as chatApi from '../../api/Chats';
import SearchChats from './SearchChats';
import SelectedChat from './SelectedChat';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import {Label} from 'semantic-ui-react';
let socket = null;

export default class ChatAll extends Component {

    constructor(){
        super();
        this.state={
            selectedChatIndex : -1
        }
    }
    componentDidMount=async()=>{
        this.setState({screenWidth : window.innerWidth});
        window.addEventListener('resize', this.resizeWindow);
        
        const profileData = await api.getProfileData({Email:localStorage.getItem('Email'), Mobile : localStorage.getItem('Mobile')});
        if(profileData.data.user.type==='error')    {this.LogUserOut(profileData.data.message);  return ;  }
        
        this.setState({...profileData.data.user,loading:false});
        localStorage.setItem("Username",profileData.data.user.Username);
        console.log(profileData)
        let chats = await chatApi.getAllChats({Username:this.state.Username});
        console.log(chats)
        chats = chats.data.chats;

        chats.sort((a,b) => (a.last > b.last) ? 1 : ((b.last > a.last) ? -1 : 0));
        chats = this.improveChat(chats);

        socket = io('https://adoose-backend.herokuapp.com');

        this.setState({chatAll : chats});

        this.Signalling();

        socket.on('recieveMsg',({person,msg,from})=>{
            let chats = this.state.chatAll;
            for(let i = 0;i<chats.length;i++)
            {
                if(chats[i]["person"]===from)
                {
                    
                    chats[i]["messages"].push(msg);
                    chats[i]["Unread"]+=1;
                    chats[i]["UnreadFor"] = localStorage.getItem("Username");
                    this.setState({chatAll:chats});
                }
            }
        });

        socket.on('sendMsgInOwner',({msg,from,person})=>{
            let chats = this.state.chatAll;
            console.log(chats,msg,from,person);

            for(let i = 0;i<chats.length;i++)
            {
                if(chats[i]["person"]===person)
                {
                    chats[i]["messages"].push(msg);
                    this.setState({chatAll:chats});
                    return ;
                }
            }
        });

        socket.on("meInChat",(id)=>{
            this.setState({mySocketId : id});
            socket.emit('saveUsernameInChat',({id:id, Username : localStorage.getItem("Username")}));
        });
    }

    Signalling = () =>{
        const peer = new Peer({initiator:true,trickle:false});
        peer.on('signal',()=>{})
    }

    sendMsg = (person,msg,original)=>{
        socket.emit('sendMsg',({person:person,msg:msg,from:localStorage.getItem("Username")}));
        const chats = this.state.chatAll;
        chats[this.state.selectedChatIndex]["Unread"] = 0;
        this.setState({chatAll : chats});
    }

    improveChat=(chats)=>{
        
        let AllChats = [];
        
        for(let i = 0;i<chats.length;i++)
        {
            let newChat = {};
            if(chats[i]["P1"]!=localStorage.getItem("Username"))         newChat["person"] = chats[i]["P1"];
            if(chats[i]["P2"]!=localStorage.getItem("Username"))         newChat["person"] = chats[i]["P2"];
            newChat["p1"] = chats[i]["P1"];
            newChat["p2"] = chats[i]["P2"];
            newChat["Unread"] = chats[i]["Unread"];
            newChat["UnreadFor"] = chats[i]["UnreadFor"];

            let messages = [];
            for(let j = 0;j<chats[i]["data"].length;j++)
                messages.push(chats[i]["data"][j]);
            newChat.messages = messages;

            AllChats.push(newChat);
        }
        return AllChats;
    }

    addChatToList = (person) =>{
        
        let zx = this.state.chatAll;
        for(let i=0;i<zx.length;i++)
        {
            if(zx[i]["person"]===person)
            {
                this.setState({selectedChatIndex:i});
                return ;
            }
        }

        zx.unshift({
            Unread:0,
            UnreadFor:person,
            p1:'Dope_coder',
            p2:person,
            person:person,
            messages : []
        });
        this.setState({chatAll : zx,selectedChatIndex:0});
        console.log(zx);
    }

    resizeWindow = () =>{this.setState({screenWidth : window.innerWidth});}

    LogUserOut = (Message) =>{
        localStorage.clear();
        this.setState({SnackbarOpen : true,AlertSeverity:'error', AlertText:Message});
        setTimeout(() => {window.location.href = '/'}, 1000);
    }

    ChatItems = (data) =>{
        if(!data.chatAll)     return <></>;
        
        const LeftSide = data.chatAll.map((item,index)=><div key={index} className="d-flex align-items-center my-1 sideLeftChatOnHover py-1 px-2" 
        onClick={()=>{
            this.setState({selectedChatIndex:index});       // setting index
            if(item["Unread"]>0 && item["UnreadFor"]===localStorage.getItem("Username"))
            {
                socket.emit("markRead",({P1:localStorage.getItem("Username"),P2:item["person"]}));    
                const chatAll = this.state.chatAll;
                chatAll[index]["Unread"] = 0;
                this.setState({chatAll : chatAll});
            }
    }}
    >
                        <div style={{width:'3rem',height:'3rem',marginLeft:'1rem'}}><img src={`https://firebasestorage.googleapis.com/v0/b/adoose-94825.appspot.com/o/${item["person"]}%2FprofilePic%2Fimage?alt=media`} width="100%" height="100%" style={{borderRadius:'50%', overflow:'hidden'}}  /></div>
                        
                        {
                            (item["Unread"] && item["Unread"]>0 && item["UnreadFor"]===localStorage.getItem('Username'))?
                            <b><span style={{fontWeight:'900', marginLeft:'1rem'}}>{item["person"]}</span></b>    
                            :
                            <span style={{fontWeight:'600', marginLeft:'1rem'}}>{item["person"]}</span>
                        }

                        {
                            (item["Unread"] && item["Unread"]>0 && item["UnreadFor"]===localStorage.getItem('Username'))?
                            <Label className="ms-auto" size="mini" circular color={"red"}>{item["Unread"]}</Label>
                            :
                            null
                        }
                    </div>
            );
        return <div>{LeftSide}</div>;
    }

    render() {
        return (
            <div>
                {/* <Navbar /> */}
                <div className='d-flex'>
                    <div 
                    style={{width:'19%',position:'sticky', top:'0',height:'100vh', backgroundColor:'#dfdfdf', minWidth:'20rem'}}
                    className="d-flex flex-column pt-3"
                    >
                        
                        <div className="mx-auto" style={{width:'5rem', height:'5rem'}}><img style={{borderRadius:'50%', overflow:'hidden', width:'100%', height:'100%'}} src={this.state.ProfileImage}  /></div>
                        <h4 className="mt-2 mx-auto">{this.state.Name}</h4>

                        <SearchChats addChatToList={this.addChatToList} people = {this.state.chatAll ? this.state.chatAll : []} />
                        
                        <hr style={{width:'100%'}} />

                        <this.ChatItems chatAll={this.state.chatAll} />
                    </div>

                    <div style={{width:'80%', flexGrow:'1'}}>
                        {
                            this.state.selectedChatIndex=== -1 ? 
                            <></>
                            :
                            <SelectedChat chat={this.state.chatAll[this.state.selectedChatIndex]} 
                            sendMsg = {this.sendMsg}
                            />
                        }
                    </div>

                </div>
            </div>
        )
    }
}
