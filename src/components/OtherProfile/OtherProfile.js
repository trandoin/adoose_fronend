import React, { Component } from "react";
import Navbar from "../Navbar/Navbar";
import ImagePortion from "../Profile/ImagePortion";
import MidPortion from "../Profile/MidPortion";
import LastPortion from "../Profile/LastPortion";
import * as api from "../../api/Profile";
import { Tab, Button, Dropdown, Icon } from "semantic-ui-react";
import AboutSection from "../Profile/AboutSection";
import { Rate } from "antd";
import Modal from "react-bootstrap/Modal";
import WorkSection from "../Profile/WorkSection";
import CommentsSection from "../Profile/CommentsSection";
import * as NotificationApi from "../../api/NotificationApi";
import { IoSettingsOutline } from "react-icons/io5";
import * as RatingApi from "../../api/RatingApi";
import { TiTickOutline } from "react-icons/ti";
import { AiOutlineUserAdd } from "react-icons/ai";
import * as FollowApi from "../../api/Follow";
import * as ReportApi from "../../api/Report";
import Card from "../Card/Card";
import { HiCurrencyDollar } from "react-icons/hi";
import { BsChatDots, BsFillBarChartFill } from "react-icons/bs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";

var startComments = 0;
var CommentFetcher = null;

var startPosts = 0;
var PostFetcher = null;
export default class OtherProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SnackbarOpen: false,
      AlertSeverity: "error",
      AlertText: "",
      RateModal: false,
      loading: true,
      GivingStars: 0,
      LeadsCount: " ",
      FollowersCount: "",
      FollowingCount: "",
      LeadsDetails: [],
      PostsDetails: [],
      Notifications: ["aa", "bb", "cc"],
      UnreadNotifications: 0,
      open: false,
      Fee: 0,
    };
  }

  panes = [
    {
      menuItem: "About",
      render: () => (
        <Tab.Pane attached={false}>
          <AboutSection
            Other={true}
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

  __DEV__ = document.domain === "localhost";

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
    if (response.data.result.length === 0) {
      clearInterval(CommentFetcher);
    } else {
      const existing = this.state.LeadsDetails;
      existing.push(...response.data.result);
      this.setState({ LeadsDetails: existing });
    }
  };
  componentDidMount = async () => {
    const otherPerson = this.props.match.params.user;
    localStorage.setItem("Other_User",otherPerson)
    localStorage.setItem("User1",localStorage.getItem("Username"))
    localStorage.setItem("User2",otherPerson)
    const profileData = await api.getOthersProfileData({
      Username: otherPerson,
    });
    await this.setState({ ...profileData.data.user, loading: false });

    // const MainprofileData = await api.getProfileData({
    //   Email: localStorage.getItem("Email"),
    //   Mobile: localStorage.getItem("Mobile"),
    // });
    const fee = profileData.data.user.Fee;
    await this.setState({ Fee: fee });

    const isUserFollowed = await FollowApi.isUserFollowed({
      Username: localStorage.getItem("Username"),
      otherPerson: otherPerson,
    });
    console.log(isUserFollowed);
    if (isUserFollowed.data.type === "error")
      this.setState({ isUserFollowed: false });
    else this.setState({ isUserFollowed: true });

    const LeadsData = await api.getLeadsData({ Username: otherPerson });
    this.setState({ LeadsCount: LeadsData.data.result.LeadsCount });
   console.log(this.state.Username)
    const PublicRatingData = await RatingApi.getPublicRating({
      Username1: localStorage.getItem("Username"),
      Username2: this.state.Username,
    });
    console.log(PublicRatingData);
    if (PublicRatingData.data)
      this.setState({
        AlreadyRated: true,
        GivingStars: PublicRatingData.data.Stars,
      });
    else this.setState({ AlreadyRated: false, GivingStars: 0 });

    const Notifications = await NotificationApi.getAllNotification({
      Username: localStorage.getItem("Username"),
    });

    const FollowerData = await api.getFollowData({ Username: otherPerson });
    console.log(FollowerData);
    this.setState({
      FollowersCount: FollowerData.data.data.FollowersCount,
      FollowingCount: FollowerData.data.data.FollowingCount,
    });

    this.setState({
      Notifications: Notifications.data.Notifications.data,
      UnreadNotifications: Notifications.data.Notifications.Unread,
    });
    console.log(this.state);

    const PostsData = await api.getPostsData({ Username: otherPerson });
    this.setState({ KhudKiPost: PostsData });

    this.PeriodicCommentFetch();
    this.PeriodicPostFetch();
  };

  ShowRateModal = () => {
    this.setState({ RateModal: true });
  };
  CloseRateModal = () => {
    this.setState({ RateModal: false });
  };

  renewPublicRating = async () => {
    this.componentDidMount();
  };

  saveRating = async (data) => {
    console.log("Rating...");
    await RatingApi.postPublicRating(data);
    console.log("Rated");
    // await this.renewPublicRating();
  };

  followUser = async () => {
    const data = await FollowApi.followUser({
      Username: localStorage.getItem("Username"),
      otherPerson: this.state.Username,
    });
    console.log(data);
    const otherPerson = this.props.match.params.user;
    const FollowerData = await api.getFollowData({ Username: otherPerson });
    this.setState({
      FollowersCount: FollowerData.data.data.FollowersCount,
      FollowingCount: FollowerData.data.data.FollowingCount,
      isUserFollowed: true,
    });
  };

  unfollowUser = async () => {
    const data = await FollowApi.unfollowUser({
      Username: localStorage.getItem("Username"),
      otherPerson: this.state.Username,
    });
    console.log(data);
    const otherPerson = this.props.match.params.user;
    const FollowerData = await api.getFollowData({ Username: otherPerson });
    this.setState({
      FollowersCount: FollowerData.data.data.FollowersCount,
      FollowingCount: FollowerData.data.data.FollowingCount,
      isUserFollowed: false,
    });
  };

  Report = async () => {
    console.log("Reported");
    const user = localStorage.getItem("Username");
    const other_user = this.props.match.params.user;
    await ReportApi.Report({
      LoggedInUser: user,
      OtherUser: other_user,
    });
  };

  Block = async () => {
    console.log("Blocked");
    const user = localStorage.getItem("Username");
    const other_user = this.props.match.params.user;
    await FollowApi.blocked({
      Username: user,
      otherPerson: other_user,
    });
  };

  loadScript = (src) => {
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

  displayRazorpay = async () => {
    const res = await this.loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    // const profileData = await api.getProfileData({
    //   Email: localStorage.getItem("Email"),
    //   Mobile: localStorage.getItem("Mobile"),
    // });
    const fee = this.state.Fee;
    console.log(fee) 
    const req = {
      'Fee':fee
    }
    var data = await axios.post("http://localhost:5000/razorpay",req);

     console.log(data.data)
     data = data.data
     console.log(data.amount.toString())
     const NetAmount = 0.9 * this.state.Fee;
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
          localStorage.setItem("userToCall",localStorage.getItem('Other_User'))
           const req = {
             Username1: localStorage.getItem('Other_User'),
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

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
    this.displayRazorpay()
  };

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
                  window.innerWidth < 600 ? "mx-auto text-center" : "d-flex"
                }`}
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  color: "green",
                }}
              >
                <span
                  className={`${
                    window.innerWidth < 600 ? "" : "w-25 text-center"
                  }`}
                >
                  {this.state.AccountType}
                </span>
                <Dropdown
                  className={`ms-auto onHoverGrey`}
                  style={
                    window.innerWidth < 600
                      ? { position: "fixed", right: "2rem" }
                      : {}
                  }
                  direction="left"
                  as="icon"
                  icon={
                    <IoSettingsOutline
                      size="1.3em"
                      color="black"
                      style={{ padding: "0.4rem", boxSizing: "content-box" }}
                    />
                  }
                >
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={this.Block}>Block</Dropdown.Item>
                    <Dropdown.Item onClick={this.Report}>Report</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
                  <LastPortion
                    otherPerson={this.state.Username}
                    Professions={this.state.Profession}
                  />
                </div>
              </div>

              <div
                className={`align-items-center mt-4 ${
                  window.innerWidth < 600
                    ? "w-100 d-flex mb-2"
                    : "w-100 d-flex mb-2"
                }`}
              >
                {window.innerWidth > 600 ? (
                  <div
                    className={`${
                      window.innerWidth < 600 ? "w-100 d-flex" : "w-25 d-flex"
                    }`}
                  >
                    <Button
                      variant="primary"
                      onClick={this.ShowRateModal}
                      color="facebook"
                      className="mx-auto mx-1 my-1"
                      style={{ width: "fit-content" }}
                    >
                      <BsFillBarChartFill
                        style={{
                          fontWeight: "600",
                          marginRight: "0.6rem",
                          fontWeight: "600",
                        }}
                        size="1.3em"
                      />
                      Rate user
                    </Button>
                  </div>
                ) : null}
                {window.innerWidth < 600 ? (
                  <Button
                    variant="primary"
                    className="mx-1 my-1"
                    onClick={this.ShowRateModal}
                    color="facebook"
                    style={{ width: "fit-content" }}
                  >
                    <BsFillBarChartFill
                      style={{
                        fontWeight: "600",
                        marginRight: "0.6rem",
                        fontWeight: "600",
                      }}
                      size="1.3em"
                    />
                  </Button>
                ) : null}
                <div
                  className="ms-auto"
                  style={
                    window.innerWidth <= 800
                      ? { marginRight: "0" }
                      : { marginRight: "2rem" }
                  }
                >
                  {this.state.isUserFollowed ? (
                    <Button
                      className="ms-auto my-1 mx-1"
                      color="green"
                      onClick={this.unfollowUser}
                    >
                      <TiTickOutline
                        style={{ marginRight: "0.6rem", fontWeight: "600" }}
                        size="1.3em"
                      />
                      {window.innerWidth < 600 ? (
                        <span></span>
                      ) : (
                        <span>Followed</span>
                      )}
                    </Button>
                  ) : (
                    <Button
                      className="ms-auto my-1  mx-1"
                      color="blue"
                      onClick={this.followUser}
                    >
                      <AiOutlineUserAdd
                        style={{ marginRight: "0.6rem", fontWeight: "600" }}
                        size="1.3em"
                      />
                      {window.innerWidth < 600 ? (
                        <span></span>
                      ) : (
                        <span>Follow</span>
                      )}
                    </Button>
                  )}

                  <Button className=" my-1 mx-1" color="yellow">
                    <BsChatDots
                      style={{
                        fontWeight: "600",
                        marginRight: "0.6rem",
                        fontWeight: "600",
                      }}
                      size="1.3em"
                    />
                    {window.innerWidth < 600 ? (
                      <span></span>
                    ) : (
                      <span>Messages</span>
                    )}
                  </Button>
                  {/* <Button className=" my-1 mx-1" color='teal' onClick={this.clicked}><HiCurrencyDollar style={{marginRight:'0.6rem',fontWeight:'600'}}  size="1.3em" />
                        {
                            window.innerWidth<600?<span></span>:<span>Superchat</span>
                        }
                        </Button> */}
                  <Button
                    className=" my-1 mx-1"
                    color="teal"
                    onClick={this.handleClickOpen}
                  >
                    <HiCurrencyDollar
                      style={{ marginRight: "0.6rem", fontWeight: "600" }}
                      size="1.3em"
                    />
                    {window.innerWidth < 600 ? (
                      <span></span>
                    ) : (
                      <span>Superchat</span>
                    )}
                  </Button>
                  <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Procedding towards Video Chat"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        You need to pay <strong>{this.state.Fee}</strong> to
                        proceed towards video chat
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={this.handleClose} autoFocus>
                        Pay Now
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </div>
              <Modal show={this.state.RateModal} onHide={this.CloseRateModal}>
                <Modal.Body>
                  {this.state.AlreadyRated ? (
                    <span>
                      You have already rated {this.state.Username}. Want to
                      chnage your rating ?
                    </span>
                  ) : (
                    <span>Rate {this.state.Username}</span>
                  )}
                  <br />
                  <Rate
                    style={{ color: "#ffc800", width: "100%", margin: "auto" }}
                    className="text-center"
                    onChange={(e) => {
                      console.log(e);
                      this.setState({ GivingStars: e });
                    }}
                    value={this.state.GivingStars}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button color="grey" onClick={this.CloseRateModal}>
                    Close
                  </Button>
                  <Button
                    color="blue"
                    onClick={() => {
                      this.saveRating({
                        Username1: localStorage.getItem("Username"),
                        Username2: this.state.Username,
                        stars: this.state.GivingStars,
                      });
                      this.CloseRateModal();
                    }}
                  >
                    Rate him
                  </Button>
                </Modal.Footer>
              </Modal>

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

    //             <hr className='mt-1' />

    //             <div className='d-flex flex-column' style={{padding:'1rem 2rem'}}>
    //                 <div className='w-25 text-center' style={{fontSize:'1.4rem',fontWeight:'500'}}>{this.state.AccountType}</div>

    //                 <div className="d-flex w-100">
    //                     <div style={{width:'25%'}}><ImagePortion ProfileImage={this.state.ProfileImage} /></div>
    //                     <div style={{width:'37%'}}><MidPortion Username={this.state.Username} Name={this.state.Name} Gender={this.state.Gender} Locations={this.state.Location} Languages={this.state.Language} /></div>
    //                     <div style={{width:'38%'}}><LastPortion Professions = {this.state.Profession} /></div>
    //                 </div>

    //                 <div className="d-flex w-50 justify-content-between align-items-center m-auto">
    //                     <div className="text-center">

    //                         <div><span style={{fontSize:'1.5rem',fontWeight:'500'}}>Followers</span></div>
    //                         <div><span style={{fontSize:'1.5rem'}}>{this.state.FollowersCount}</span></div>
    //                     </div>
    //                     <div className="text-center">
    //                         <div><span style={{fontSize:'1.5rem',fontWeight:'500'}}>Following</span></div>
    //                         <div><span style={{fontSize:'1.5rem'}}>{this.state.FollowingCount}</span></div>
    //                     </div>
    //                     <div className="text-center">
    //                         <div><span style={{fontSize:'1.5rem',fontWeight:'500'}}>Leads</span></div>
    //                         <div><span style={{fontSize:'1.5rem'}}>{this.state.LeadsCount}</span></div>
    //                     </div>
    //                 </div>

    //                 <br/><br/>

    //                 <div>
    //                     <div className='m-auto' style={{width:'82.5%'}}>
    //                         <span style={{fontSize:'1.4rem',fontWeight:'500', textDecoration:'underline'}}>Brief Details </span>
    //                         <pre>{this.state.BriefDetails}</pre>
    //                     </div>
    //                     <br />
    //                 </div>

    //                 <div className='m-auto' style={{width:'82.5%'}}>
    //                     <Tab className='ml-0'  menu={{ secondary: true }} panes={this.panes} />
    //                 </div>

    //             </div>

    //         </div>
    //         }
    //     </div>
    // )
  }
}
