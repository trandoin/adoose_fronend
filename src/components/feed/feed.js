import React, { Component } from 'react'
import Navbar from '../Navbar/Navbar';
import { Icon, Tab,Menu,Button} from 'semantic-ui-react';
import * as api from '../../api/feed';
import * as NotificationApi from '../../api/NotificationApi';
import * as FollowApi from '../../api/Profile';
import {MdTimeline} from 'react-icons/md';
import {FaWpexplorer} from 'react-icons/fa';
import {FiUserPlus} from 'react-icons/fi';
import {AiOutlineUsergroupAdd} from 'react-icons/ai';
import {GoTag} from 'react-icons/go';

import Card from '../Card/Card';
import {Link} from 'react-router-dom';

import TabTopDesign from '../TabTopDesign';
import { configConsumerProps } from 'antd/lib/config-provider';
import './feed.css';

var fetchTimelineTimeout = null;
var fetchExploreTimeout = null;

class Feed extends Component {
    constructor(props){
        super(props);
        this.state = {
            SnackbarOpen : false,
            AlertSeverity : 'error',
            AlertText : '',
            loading:true,
            screenWidth : 720,
            Notifications : ["Loading..."],
            UnreadNotifications : 0,
            TimeLineTab : [],
            OfferTab:[],
            RequirementTab : [],
            ExploreTab : [],
            CollabTab : [],
            skip : 0,
            DuniyaSkip : 0,
            search_location: '',
            panes : [
                {
                    menuItem: <Menu.Item key='Timeline'><TabTopDesign value="Timeline" /></Menu.Item>,
                    render: () => <Tab.Pane attached={false} >
                           <div style={{'marginBottom': '10px'}} className="search_bar_feed">
    <form action="/" method="get"  onSubmit={this.formOnSubmit}>
      <label htmlFor="header-search">
          <span className="visually-hidden">Search Location</span>
      </label>
      <input
          type="text"
          id="header-search"
          placeholder="Filter Location"
          name="s" 
          style={{width:"300px"}}
      />
      <button type="submit">Search</button>

  </form></div>
  <div className='card_offer'>
       <Card data={this.state.TimeLineTab} group={this.state.AccountType} search_location={this.state.search_location} /> </div>
                          
                       

                    </Tab.Pane>,
                },
                {
                    menuItem: <Menu.Item key='Explore'><TabTopDesign value="Explore" /></Menu.Item>,
                    render: () => <Tab.Pane attached={false}>
                       <div style={{'marginBottom': '10px'}} className="search_bar_feed">
    <form action="/" method="get"  onSubmit={this.formOnSubmit}>
      <label htmlFor="header-search">
          <span className="visually-hidden">Search Location</span>
      </label>
      <input
          type="text"
          id="header-search"
          placeholder="Filter Location"
          name="s" 
          style={{width:"300px"}}
      />
      <button type="submit">Search</button>

  </form></div>
  <div className='card_offer'>
                        <Card data={this.state.ExploreTab} group={this.state.AccountType} search_location={this.state.search_location}/>
                        </div>
                    </Tab.Pane>,
                },
                {
                    menuItem: <Menu.Item key='Collab'><TabTopDesign value="Collab" /></Menu.Item>,
                    render: () => <Tab.Pane attached={false}>
                        <div style={{'marginBottom': '10px'}} className="search_bar_feed">
    <form action="/" method="get"  onSubmit={this.formOnSubmit}>
      <label htmlFor="header-search">
          <span className="visually-hidden">Search Location</span>
      </label>
      <input
          type="text"
          id="header-search"
          placeholder="Filter Location"
          name="s" 
        //   style={{width:"300px"}}
      />
      <button type="submit">Search</button>

  </form></div> <div className='card_offer'>
                        <Card data={this.state.CollabTab} group={this.state.AccountType} search_location={this.state.search_location}/> 
</div>
                    </Tab.Pane>,
                },
                {
                    menuItem: <Menu.Item key='Requirement'><TabTopDesign value="Requirement" /></Menu.Item>,
                    render: () => <Tab.Pane attached={false}>
                        <div style={{'marginBottom': '10px'}} className="search_bar_feed">
    <form action="/" method="get"  onSubmit={this.formOnSubmit}>
      <label htmlFor="header-search">
          <span className="visually-hidden">Search Location</span>
      </label>
      <input
          type="text"
          id="header-search"
          placeholder="Filter Location"
          name="s" 
          style={{width:"300px"}}
      />
      <button type="submit">Search</button>

  </form></div> <div className='card_offer'>
                        <Card data={this.state.RequirementTab} group={this.state.AccountType} search_location={this.state.search_location} />
</div>
                    </Tab.Pane>,
                },
                {
                    menuItem: <Menu.Item key='Offer'><TabTopDesign value="Offer" /></Menu.Item>,
                    render: () => <Tab.Pane attached={false}>
                        <div style={{'marginBottom': '10px'}} className="search_bar_feed">
    <form action="/" method="get"  onSubmit={this.formOnSubmit}>
      <label htmlFor="header-search">
          <span className="visually-hidden">Search Location</span>
      </label>
      <input
          type="text"
          id="header-search"
          placeholder="Filter Location"
          name="s" 
          style={{width:"300px"}}
      />
      <button type="submit">Search</button>

  </form></div> <div className='card_offer'>
                        <Card data={this.state.OfferTab} group={this.state.AccountType} search_location={this.state.search_location} /> 
                        </div>
                    </Tab.Pane>,
                },
                {
                    menuItem:<Menu.Item style={window.innerWidth<=1000?{display:'none'}:{}} active={false} key='Create'><Link to='/post/new'style={{marginLeft:'1rem',marginTop:'1rem'}} >
                    <Button  color="blue" >
                        <Icon name="pencil" />
                        Create New Post
                        </Button>
                    </Link></Menu.Item>
                }
            ]
        }

    }
    

   

    changePanes = () =>{
        const panes = this.state.panes;
        this.setState({panes : []});
        this.setState({panes:panes});
    }

    componentDidMount=async()=>{
    
        this.setState({screenWidth : window.innerWidth});
        window.addEventListener('resize', this.resizeWindow);
        if(!localStorage.getItem("Guest")){
        const profileData = await api.getProfileData({Email:localStorage.getItem('Email'), Mobile : localStorage.getItem('Mobile')});
        if(profileData.data.user.type==='error')    {this.LogUserOut(profileData.data.message);  return ;  }
        this.setState({...profileData.data.user,loading:false});
        localStorage.setItem("Username",profileData.data.user.Username)
        
        const Notifications = await NotificationApi.getAllNotification({Username:localStorage.getItem("Username")})
    
     
        if(Notifications.data.Notifications) {
            this.setState({Notifications : Notifications.data.Notifications.data, UnreadNotifications : Notifications.data.Notifications.Unread});}
        }
       this.setState({loading:false});
        const feedData = await api.getPosts({Username:localStorage.getItem('Username'), number:this.state.skip});
     
        var fullDuniyaData = await api.getDuniyaPosts({skip : this.state.DuniyaSkip});

    
        this.setState({skip : 1, DuniyaSkip : 1});

        const ActualDuniyaData ={
            data:[]
        };
        for(let i=0;i<fullDuniyaData.data.length;i++)
        {
            const Other_user = fullDuniyaData.data[i]["Username"];
        
            const FollowerData = await FollowApi.getFollowData({Username: Other_user})
        
            const blocked_users = FollowerData.data.data?.Block;
          
            if(blocked_users && !blocked_users.includes(localStorage.getItem("Username"))) {    // if not blocked

                ActualDuniyaData.data.push(fullDuniyaData.data[i]) 
            }
        }
      
        //------------------------------------------ start code comment by suraj and this code added in this file only in line no 170-------------------------------------------------------------------------------------------------------------------///
        // fullDuniyaData = ActualDuniyaData;
        // this.setState({TimeLineTab : feedData.data.Posts});
        // this.setState({ExploreTab : fullDuniyaData.data});

          
        //------------------------------------------ end code comment by suraj  an-------------------------------------------------------------------------------------------------------------------///

        // const CollabTab = fullDuniyaData.data.filter((item)=>item["Type"]==="Collaboration");
        const CollabTab = []
        const RequirementTab= []
        const OfferTab = []
     
        for(let i = 0;i<fullDuniyaData.data.length;i++)
        {
            if(fullDuniyaData.data[i]["Type"]==="Collaboration")
                CollabTab.push(fullDuniyaData.data[i]);
            else if(fullDuniyaData.data[i]["Type"]==="Requirement")
                RequirementTab.push(fullDuniyaData.data[i]);
            else        OfferTab.push(fullDuniyaData.data[i]);
        }
        // const RequirementTab = fullDuniyaData.data.filter((item)=>item['Type']==="Requirement");
        // const OfferTab = fullDuniyaData.data.filter((item)=>item['Type']==="Offer");

   
        fullDuniyaData = ActualDuniyaData;
        this.setState({TimeLineTab : feedData.data.Posts});
        this.setState({ExploreTab : fullDuniyaData.data});
        this.setState({CollabTab : CollabTab});
        this.setState({RequirementTab : RequirementTab});
        this.setState({OfferTab : OfferTab});



        fetchTimelineTimeout = await setInterval(async() => {
            let data = await api.getPosts({Username : localStorage.getItem("Username"), number: this.state.skip});
            data = data.data.Posts;
            if(data.length===0){
                clearInterval(fetchTimelineTimeout);
                return ;
            }
            const tt = this.state.TimeLineTab;
            for(let i = 0;i<data.length;i++)        tt.push(data[i]);
            await this.setState({TimeLineTab : tt,skip:this.state.skip+1});
            await this.changePanes();
        }, 6000);

        fetchExploreTimeout = await setInterval(async() => {
            let data = await api.getDuniyaPosts({skip : this.state.DuniyaSkip});
   
            data = data.data;
            if(data.length===0){
                clearInterval(fetchExploreTimeout);
           
                return ;
            }
            const tt = this.state.ExploreTab;
            const Offer12 = this.state.OfferTab;
            const Collab12 = this.state.CollabTab;
            const Requirement12 = this.state.RequirementTab;

            for(let i =0 ;i<data.length;i++){
                tt.push(data[i]);
                if(data[i]["Type"]==="Offer" || data[i]["SubType"]==="Offer")       Offer12.push(data[i]);
                else if(data[i]["Type"]==="Requirement")        Requirement12.push(data[i]);
                else                                            Collab12.push(data[i]);
            }
            
            await this.setState({ExploreTab : tt, DuniyaSkip : this.state.DuniyaSkip+1,OfferTab:Offer12,CollabTab:Collab12,RequirementTab:Requirement12});
            await this.changePanes();


           

        }, 6000 );


    

    }

    resizeWindow = () =>{
        this.setState({screenWidth : window.innerWidth});
    }

    LogUserOut = (Message) =>{
        localStorage.clear();
        this.setState({SnackbarOpen : true,AlertSeverity:'error', AlertText:Message});
        setTimeout(() => {window.location.href = '/'}, 1000);
    }

    // TabTopDesign = props => {
    //     return (<div className={`w-100 d-flex align-items-center ${window.innerWidth<700?'flex-column':''}`} >
    //         {props.value==="Timeline"?<MdTimeline size='1.75em'  style={{paddingLeft:'1rem',boxSizing:'content-box'}} />:null}
    //         {props.value==="Explore"?<FaWpexplorer size='1.75em'  style={{paddingLeft:'1rem',boxSizing:'content-box'}} />:null}
    //         {props.value==="Collab"?<AiOutlineUsergroupAdd size='1.75em'  style={{paddingLeft:'1rem',boxSizing:'content-box'}} />:null}
    //         {props.value==="Requirement"?<FiUserPlus size='1.75em'  style={{paddingLeft:'1rem',boxSizing:'content-box'}} />:null}
    //         {props.value==="Offer"?<GoTag size='1.75em'  style={{paddingLeft:'1rem',boxSizing:'content-box'}} />:null}
    //         {
    //             window.innerWidth>500?
    //             <span style={{marginLeft:'1rem',fontWeight:'600', textOverflow:'elipsis', whiteSpace:'nowrap', overflow:'hidden'}} className={`${window.innerWidth<700?'mt-1':''}`}>{props.value}</span>
    //             :
    //             null
    //         }
    //     </div>);
    // }

    formOnSubmit = (e) => {
        e.preventDefault();
        this.setState({search_location: e.target.s.value})
    }


    render() {
      
        return (
            <div>
            {/* <div style={{'float':'right','left':'80vw','marginBottom': '10vh'}}>
          <form action="/" method="get"  onSubmit={this.formOnSubmit}>
            <label htmlFor="header-search">
                <span className="visually-hidden">Search Location</span>
            </label>
            <input
                type="text"
                id="header-search"
                placeholder="Filter Location"
                name="s" 
            />
            <button type="submit">Search</button>

        </form></div> */}
                {this.state.loading?<></>
                :
                <div style={{marginTop:'4rem'}}>
                    <div><Navbar Username={this.state.Username} Notifications={this.state.Notifications} Unread={this.state.UnreadNotifications} /></div>
                    
                    <div  className='mt-1 d-flex feedItemHere align-items-center'>
                        {
                            window.innerWidth>1000
                            ?
                            <Tab className='w-100' menu={{secondary: true,vertical:true}} panes={this.state.panes}  />
                            :
                            <Tab className='w-100 m-auto' menu={{fixed:'bottom', secondary: false}} panes={this.state.panes}  />
                        }
                        
                    </div>
                    <div>

                        {
                            window.innerWidth<=1000?
                            <Button color='blue' style={{position:'fixed', zIndex:'2', bottom:'4rem',padding:'1rem', right:'2rem', borderRadius:'50%', border:'1px solid #aaa', boxShadow:'0 0 4px #666'}}>
                                <Link to='/post/new' style={{color:'white',textDecoration:'none'}} >
                                    <Icon name="plus" style={{margin:'0',padding:'0'}} />
                                </Link>
                            </Button>
                            :
                            null
                        }
                    </div>
                </div>
                }
            </div>
        );
    }
}

export default Feed;