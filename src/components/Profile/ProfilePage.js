import React, { Component } from "react";
import Navbar from "../Navbar/Navbar";
import ImagePortion from "./ImagePortion";
import MidPortion from "./MidPortion";
import LastPortion from "./LastPortion";
import * as api from "../../api/Profile";
import { Tab } from "semantic-ui-react";
import Button from '@mui/material/Button';
import AboutSection from "./AboutSection";
import WorkSection from "./WorkSection";
import CommentsSection from "./CommentsSection";
import * as NotificationApi from "../../api/NotificationApi";
import Card from "../Card/Card";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/Check";
import AccountDetails from '../AccountDetails/AccountDetails';
import DeleteAccount from '../DeleteAccount/DeleteAccount';
import MyOrders from '../MyOrders/MyOrders'

var startComments = 0;
var CommentFetcher = null;

var startPosts = 0;
var PostFetcher = null;

export default class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SnackbarOpen: false,
      AlertSeverity: "error",
      AlertText: "",
      loading: true,
      LeadsCount: " ",
      FollowersCount: " ",
      FollowingCount: " ",
      LeadsDetails: [],
      PostsDetails: [],
      Notifications: ["Loading..."],
      UnreadNotifications: 0,
      Fee: 0,
    };
  }

  changeAbout = async (x) => {
    if (!x) x = "";
    const data = await api.saveAbout({
      Username: this.state.Username,
      About: x,
    });
    if (data.data.type === "error")
      this.LogUserOut("Some Error Occured. Logging you out..");
    else {
      console.log("Updated to ", x);
      this.setState({ About: x });
    }
  };

  panes = [
    {
      menuItem: "About",
      render: () => (
        <Tab.Pane attached={false}>
          <AboutSection
            Other={false}
            About={this.state.About}
            changeAbout={this.changeAbout}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Work",
      render: () => (
        <Tab.Pane attached={false}>
          <WorkSection
            work={this.state.work}
            workImage={this.state.workImage}
          />
        </Tab.Pane>
      ),
    },
    {
      // TODO : show Posts in this tab
      menuItem: "Activities",
      render: () => (
        <Tab.Pane attached={false}>
          <Card group={this.state.AccountType} data={this.state.PostsDetails} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Comments",
      render: () => (
        <Tab.Pane attached={false}>
          <CommentsSection Comments={this.state.LeadsDetails} />
        </Tab.Pane>
      ),
    },
  ];

  componentDidMount = async () => {
    const profileData = await api.getProfileData({
      Email: localStorage.getItem("Email"),
      Mobile: localStorage.getItem("Mobile") || null,
    });
    console.log("profiledata",profileData);
    if (profileData.data.type === "error") {
      this.LogUserOut(profileData.data.message);
      return;
    }
    const fee = profileData.data.user.Fee;
    await this.setState({ Fee: fee });
    await this.setState({ ...profileData.data.user, loading: false });

    const LeadsData = await api.getLeadsData({ Username: this.state.Username });
    console.log(LeadsData);
    this.setState({ LeadsCount: LeadsData.data.result?.LeadsCount });

    const Notifications = await NotificationApi.getAllNotification({
      Username: this.state.Username,
    });
    if(Notifications.data.Notifications) {
    this.setState({
      Notifications: Notifications.data.Notifications.data,
      UnreadNotifications: Notifications.data.Notifications.Unread,
    });
  }
    const FollowerData = await api.getFollowData({
      Username: this.state.Username,
    });
    this.setState({
      FollowersCount: FollowerData.data.data?.FollowersCount,
      FollowingCount: FollowerData.data.data?.FollowingCount,
    });

    const PostsData = await api.getPostsData({ Username: this.state.Username });
    this.setState({ KhudKiPost: PostsData });
    console.log(PostsData);

    console.log(this.state);

    this.PeriodicCommentFetch();
    this.PeriodicPostFetch();
  };

  PeriodicPostFetch = async () => {
    PostFetcher = setInterval(this.FetchPostUtility, 3000);
  };

  PeriodicCommentFetch = async () => {
    CommentFetcher = setInterval(this.FetchCommentsUtility, 3000);
  };

  FetchPostUtility = async () => {
    const response = await api.getPostsDataPartial({
      Username: this.state.Username,
      start: startPosts,
      end: startPosts + 5,
    });
    console.log(response);
    startPosts += 5;
    if (response.data.result.length == 0) clearInterval(PostFetcher);
    else {
      const existing = this.state.PostsDetails;
      existing.push(...response.data.result);
      this.setState({ PostsDetails: existing });
      console.log(this.state);
    }
  };

  FetchCommentsUtility = async () => {
    const response = await api.getLeadsDataPartial({
      Username: this.state.Username,
      start: startComments,
      end: startComments + 5,
    });
    console.log(response);
    startComments += 5;
    if (response.data.result.length == 0) {
      clearInterval(CommentFetcher);
    } else {
      const existing = this.state.LeadsDetails;
      existing.push(...response.data.result);
      this.setState({ LeadsDetails: existing });
    }
  };

  LogUserOut = (Message) => {
    localStorage.clear();
    this.setState({
      SnackbarOpen: true,
      AlertSeverity: "error",
      AlertText: Message,
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  formOnSubmit = async () => {
  //  e.preventDefault();
    const Username = this.state.Username;
    const Fee = document.getElementById('fee').value
    console.log(Fee);
    if((+Fee)<1){
        alert('Please enter a valid amount')
    }
    else {
    const response = await api.addFee({ Username, Fee });
    const profileData = await api.getProfileData({
      Email: localStorage.getItem("Email"),
      Mobile: localStorage.getItem("Mobile"),
    });
    const fee = profileData.data.user.Fee;
    await this.setState({ Fee: fee });
    document.getElementById("fee").value = ''
   }
  };

  GetOrders = () =>{
     window.location.href = '/orders'
  }

  render() {
    return (
      <div
        className="ProfilePageMaster"
        style={{ backgroundColor: "white", marginTop: "3rem" }}
      >
        {this.state.loading ? (
          <></>
        ) : (
          <div>
            <div>
              <Navbar
                Username={this.state.Username}
                Notifications={this.state.Notifications}
                Unread={this.state.UnreadNotifications}
              />
            </div>
            <hr className="mt-1" />
            <div
              className="d-flex flex-column"
              style={
                window.innerWidth > 1000
                  ? {
                      padding: "1rem 2rem",
                      paddingTop: "2rem",
                      fontSize: "1.5rem",
                      backgroundColor: "#fcfce0",
                    }
                  : {
                      padding: "0",
                      paddingTop: "2rem",
                      fontSize: "1rem",
                      backgroundColor: "#fcfce0",
                    }
              }
            >
              <div
                className={`${
                  window.innerWidth < 600
                    ? "mx-auto w-25 text-center"
                    : "w-25 text-center"
                }`}
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  color: "green",
                }}
              >
                {this.state.AccountType}
              </div>

              <div
                className={`${
                  window.innerWidth < 600
                    ? "d-flex w-100 flex-column mx-auto"
                    : "d-flex w-100"
                }`}
              >
                <div
                  className={`${
                    window.innerWidth < 600 ? "mx-auto w-100" : "w-25"
                  }`}
                >
                  <ImagePortion
                    ProfileImage={this.state.ProfileImage}
                    stars={this.state.Stars}
                  />
                </div>
                <div
                  style={{ width: "37%", flexGrow: "1" }}
                  className={`${
                    window.innerWidth < 600 ? "mx-auto w-100" : ""
                  }`}
                >
                  <MidPortion
                    Username={this.state.Username}
                    Name={this.state.Name}
                    Gender={this.state.Gender}
                    Locations={this.state.Location}
                    Languages={this.state.Language}
                  />
                </div>
                <div
                  style={
                    window.innerWidth < 600
                      ? { width: "100%" }
                      : { width: "25%", marginLeft: "auto" }
                  }
                >
                  <LastPortion Professions={this.state.Profession} />
              
                  <div style={{marginTop: '25px'}}>
                  <Button variant="contained" style={{fontSize: '16px',fontFamily:"'Baloo Bhai 2', 'cursive'"}} onClick={this.GetOrders}>My Orders</Button>
                 
                  </div>
              
                </div>
                <div
                  style={
                    window.innerWidth < 600
                      ? { width: "100%" }
                      : { width: "25%", marginLeft: "auto" }
                  }
                >
                  <div style={{ marginTop: "28px", marginBottom: "20px" }}>
                    <p>
                      <strong>
                        Service Charge{" "}
                        <span style={{ color: "blue" }}>{this.state.Fee}</span>
                      </strong>
                    </p>
                    <input
                      type="text"
                      id="fee"
                      placeholder="New Charge"
                      name="s"
                      style={{ borderRadius: "5px", width: "80px", marginRight: '10px'}}
                    />
                    <button onClick={this.formOnSubmit} style={{borderRadius: '10px'}}>
                   <span style={{height:'300px'}}><CheckCircleOutlineRoundedIcon/></span></button>
                  </div>
                  <AccountDetails />
                  <div style={{marginTop: '30px'}}>
                      <DeleteAccount />
                  </div>
                </div>
                
              </div>

              <div
                className="ABCDEFGH"
                style={{
                  backgroundColor: "#00d5ff40",
                  borderRadius: "10px",
                  boxShadow: "0 0 3px #",
                  paddingBottom: "3rem",
                }}
              >
                <div
                  className="d-flex justify-content-between align-items-center mx-auto Kudimenuhendi"
                  style={{ marginTop: "4rem", padding: "1rem" }}
                >
                  <div className="text-center">
                    {/* TODO : Arrange count */}
                    <div>
                      <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                        Followers
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "1.5rem" }}>
                        {this.state.FollowersCount}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div>
                      <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                        Following
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "1.5rem" }}>
                        {this.state.FollowingCount}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div>
                      <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                        Leads
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "1.5rem" }}>
                        {this.state.LeadsCount}
                      </span>
                    </div>
                  </div>
                </div>

                <hr style={{ height: "3px" }} />

                <br />
                <br />

                <div>
                  <div
                    className="m-auto menunachando"
                    style={{ width: "82.5%" }}
                  >
                    <span style={{ fontWeight: "600" }}>Brief Details </span>
                    <br />
                    <pre>
                      <span
                        style={{
                          wordSpacing: "0.34rem",
                          whiteSpace: "initial",
                        }}
                      >
                        {this.state.BriefDetails}
                      </span>
                    </pre>
                    <br />
                  </div>
                  <br />
                </div>

                <div className="m-auto ProfileSlave">
                  <Tab
                    className="ml-0"
                    menu={{ secondary: true }}
                    panes={this.panes}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
