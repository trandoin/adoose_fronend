import React, { Component } from "react";
import Navbar from "../Navbar/Navbar";
import { Input, Radio, Segment, TextArea, Button } from "semantic-ui-react";
import { Accordion, Icon as Icon1 } from "semantic-ui-react";
import { IoClose } from "react-icons/io5";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import * as api from "../../api/Profile.js";
import * as api1 from "../../api/feed.js";
import storage from '../firebase/firebase';
import { ref,uploadBytes,getDownloadURL } from "firebase/storage"

export default class CreatePost extends Component {
  constructor() {
    super();
    this.state = {
      SnackbarText : "",
      SnackbarOpen : false,
      SnackbarAlert : 'error',
      ErrorInCreationPost : false,
      Type: "Offer",
      CollabType: "",
      RequirementType: "",
      uploading:false,
      OfferType: "",
      Requirement: "",
      Date: "",
      GenderForPost: "Male",
      LocationForPost: [],
      LanguageForPost: [],
      Heading: "",
      OfferImage: "",
      ValidFrom: "",
      ValidUpto: "",
      Description: "",
    };
  }

  resetDataValues = () => {
    this.setState({
      Type: "",
      CollabType: "",
      RequirementType: "",
      OfferType: "",
      Requirement: "",
      Date: "",
      GenderForPost: "Male",
      LocationForPost: [],
      LanguageForPost: [],
      Heading: "",
      OfferImage: "",
      ValidFrom: "",
      ValidUpto: "",
      Description: "",
    });
  };

  createIssueNode=()=>{
    this.setState({SnackbarOpen:true,SnackbarText:'Fill All empty Details', SnackbarAlert:'error'});
  }

  readImages = async(e)=>{
    this.setState({uploading:true});
    const file = e.target.files[0];
    if(!file)       return ;
    const images = ref(storage,`${this.state.Username}/CardImage/${localStorage.getItem("Username")}/${Date.now()}`);
    
    uploadBytes(images, file).then((snapshot) => {
        console.log(snapshot);
        getDownloadURL(images).then((url) => {this.setState({OfferImage : url,uploading:false})})
      });
}

  SendPostToBackend = async(e)=>{
      e.preventDefault();
      if(!this.state.Type || this.state.Type.length===0){
        this.createIssueNode();
        return false;
      }
      
      if(this.state.Type==="Collaboration")
      {
        this.setState({Requirement : this.state.Requirement.trim()});
        this.resetEmptyArrayLocation();
        if(this.state.LocationForPost.length===0){
          this.createIssueNode();
          return false;
        }
            if(!this.state.CollabType || this.state.CollabType.length===0 || this.state.Requirement.length===0){
              this.createIssueNode();
              return false;
            }
      }
      else if(this.state.Type==="Requirement")
      {
        this.setState({Requirement : this.state.Requirement.trim()});
        
        this.resetEmptyArrayLocation();
        this.resetEmptyArrayLanguage();
        if(!this.state.RequirementType || this.state.RequirementType.length===0 || this.state.Requirement.length===0){
              this.createIssueNode();
              return false;
        }
        if(this.state.LocationForPost.length===0 || this.state.LanguageForPost.length===0){
          this.createIssueNode();
          return false;
        }
      }
      else if(this.state.Type==="Offer")
      {
        this.setState({Heading : this.state.Heading.trim()});
        if(!this.state.OfferType || this.state.OfferType.length===0 || this.state.Heading.length===0){
          this.createIssueNode();
          return false;
        }
      }
      else{
        this.createIssueNode();
        return false;
      }

      


      // connection to API
      this.setState({Date : new Date().toISOString()});

      const Response = await api1.postNewPost({data : this.state});
      console.log(Response);
      
      this.setState({SnackbarOpen:true,SnackbarText:Response.data.message,SnackbarAlert:Response.data.type});
      if(Response.data.type==="success")
      {
        setTimeout(() => {
          window.location.href='/feed';
        }, 1000);
      }
  }

  componentDidMount = async () => {
    this.setState({ screenWidth: window.innerWidth });
    window.addEventListener("resize", this.resizeWindow);
    const profileData = await api.getProfileData({
      Email: localStorage.getItem("Email"),
      Mobile: localStorage.getItem("Mobile"),
    });
    if (profileData.data.user.type === "error") {
      this.LogUserOut(profileData.data.message);
      return;
    }
    this.setState({ ...profileData.data.user,
        AccountType : profileData.data.user.AccountType,
        Name : profileData.data.user.Name,
        Email : profileData.data.user.Email,
        Username : profileData.data.user.Username,
        Mobile : profileData.data.user.Mobile,
        
        loading: false });
  };

  resizeWindow = () => {
    this.setState({ screenWidth: window.innerWidth });
  };

  // Data Change Methods
  handleChangeType = (e, { value }) => {
    console.log("value",value)
    this.resetDataValues();
    this.setState({ Type: value });
  };

  resetEmptyArrayLocation = () => {
    let LocationForPost = this.state.LocationForPost;
    let newLocationForPost = [];
    for (let i = 0; i < LocationForPost.length; i++)
      if (LocationForPost[i] && LocationForPost[i].length > 0)
        newLocationForPost.push(LocationForPost[i]);
    this.setState({ LocationForPost: newLocationForPost });
  };
  resetEmptyArrayLanguage = () => {
    let LanguageForPost = this.state.LanguageForPost;
    let newLanguageForPost = [];
    for (let i = 0; i < LanguageForPost.length; i++)
      if (LanguageForPost[i] && LanguageForPost[i].length > 0)
        newLanguageForPost.push(LanguageForPost[i]);
    this.setState({ LanguageForPost: newLanguageForPost });
  };

  LanguageShowAsList = (props) => {
    const rendered = props.value.map((language, index) => (
      <span
        key={index}
        className={`ArrayInPostCreation px-3 py-2 mx-1 d-flex`}
        style={{
          backgroundColor: "rgba(240,240,240,0.7)",
          borderRadius: "4px",
          border: "1px solid lightblue",
        }}
      >
        <Input
          style={{
            overflow: "visible",
            backgroundColor: "transparent !important",
            border: "0 !important",
            minWidth:`${language.toString().length+7}ch`
          }}
          className="d-flex"
          value={language}
          onChange={(e) => {
            let LanguageForPost = this.state.LanguageForPost;
            LanguageForPost[index] = e.target.value;
            this.setState({ LanguageForPost: LanguageForPost });
          }}
          onBlur={() => {
            this.resetEmptyArrayLanguage();
          }}
        />
        <span
          className={`ms-2 d-flex align-items-center ms-auto`}
          style={{ cursor: "pointer" }}
          onClick={() => {
            let LanguageForPost = this.state.LanguageForPost;
            LanguageForPost.splice(index, 1);
            this.setState({ LanguageForPost: LanguageForPost });
          }}
        >
          <IoClose />
        </span>
      </span>
    ));

    return (
        <div className={`d-flex flex-wrap ${window.innerWidth<600?'flex-column':''}`}>
        {rendered}
        {this.state.LanguageForPost.length < 3 ? (
          <Button
            color="blue"
            onClick={() => {
              let LanguageForPost = this.state.LanguageForPost;
              LanguageForPost.push("");
              this.setState({ LanguageForPost: LanguageForPost });
            }}
          >
            Add
          </Button>
        ) : (
          <></>
        )}
      </div>
    );
  };

  LocationShowAsList = (props) => {
    const rendered = props.value.map((location, index) => (
      <span
        key={index}
        className={`ArrayInPostCreation px-3 py-2 mx-1 d-flex`}
        style={{
          backgroundColor: "rgba(240,240,240,0.7)",
          borderRadius: "4px",
          border: "1px solid lightblue",
        }}
      >
        <Input
          style={{
            overflow: "visible",
            backgroundColor: "transparent !important",
            border: "0 !important",
            minWidth:`${location.toString().length+7}ch`
          }}
          className="d-flex"
          value={location}
          onChange={(e) => {
            let LocationForPost = this.state.LocationForPost;
            LocationForPost[index] = e.target.value;
            this.setState({ LocationForPost: LocationForPost });
          }}
          onBlur={() => {
            this.resetEmptyArrayLocation();
          }}
        />
        <span 
          className={`ms-2 d-flex align-items-center ms-auto`}
          style={{ cursor: "pointer" }}
          onClick={() => {
            const LocationForPost = this.state.LocationForPost;
            LocationForPost.splice(index, 1);
            this.setState({ LocationForPost: LocationForPost });
          }}
        >
          <IoClose />
        </span>
      </span>
    ));

    return (
      <div className={`d-flex flex-wrap ${window.innerWidth<600?'flex-column':''}`}>
        {rendered}
        {this.state.LocationForPost.length < 3 ? (
          <Button
            color="blue"
            onClick={() => {
              let LocationForPost = this.state.LocationForPost;
              LocationForPost.push("");
              this.setState({ LocationForPost: LocationForPost });
            }}
          >
            Add
          </Button>
        ) : (
          <></>
        )}
      </div>
    );
  };

  AccordianInsideContent = () => {
    switch (this.state.Type) {
      case "Collaboration":
        return (
          <div>
            <div>
              <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                Collab Type
              </span>
              <span>
                <Radio
                    className="mx-3"
                    label="Promotion"
                    value="Promotion"
                    checked={this.state.CollabType === "Promotion"}
                    onChange={() => {
                    this.setState({ CollabType: "Promotion" });
                    }}
                />
                <Radio
                    className="mx-3"
                    label="Sponsorship"
                    value="Sponsorship"
                    checked={this.state.CollabType === "Sponsorship"}
                    onChange={() => {
                    this.setState({ CollabType: "Sponsorship" });
                    }}
                />
              </span>
            </div>
            <hr />
            <div
              className={
                window.innerWidth < 600
                  ? `d-flex my-4 flex-column`
                  : `d-flex my-4`
              }
            >
              <span style={{ marginRight: "1rem", minWidth: "22%" }}>
                Requirement
              </span>
              <Input
                style={{ width: "100%" }}
                fluid
                value={this.state.Requirement}
                onChange={(e) => {
                  this.setState({ Requirement: e.target.value.substr(0, 150) });
                }}
                label={{
                  basic: true,
                  content: `${this.state.Requirement.length}/150`,
                }}
                labelPosition="right"
              />
            </div>

            <div
              className={
                window.innerWidth < 600
                  ? `d-flex my-4 flex-column`
                  : `d-flex my-4`
              }
            >
              <span style={{ marginRight: "1rem", minWidth: "22%" }}>
                Location
              </span>
              {this.LocationShowAsList({value:this.state.LocationForPost})}
              {/* <this.LocationShowAsList value={this.state.LocationForPost} /> */}
            </div>

            <div
              className={
                window.innerWidth < 600
                  ? `d-flex flex-column my-4`
                  : `d-flex my-4`
              }
            >
              <span style={{ marginRight: "1rem", minWidth: "22%" }}>
                Additional Description
              </span>
              <TextArea
                style={{ width: "100%", padding: ".67857143em 1em" }}
                rows={4}
                value={this.state.Description}
                onChange={(e, { value }) => {
                  this.setState({ Description: value });
                }}
              />
            </div>
          </div>
        );
      case "Requirement":
        return (
          <div>
            <div>
              <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                Requirement Type
              </span>
              <span>
                <Radio
                  className="mx-3"
                  label="Professional"
                  value="Professional"
                  checked={this.state.RequirementType === "Professional"}
                  onChange={() => {
                    this.setState({ RequirementType: "Professional" });
                  }}
                />
                <Radio
                  className="mx-3"
                  label="Accesories"
                  value="Accesories"
                  checked={this.state.RequirementType === "Accesories"}
                  onChange={() => {
                    this.setState({ RequirementType: "Accesories" });
                  }}
                />
              </span>
            </div>
            <hr />

            <div
              className={
                window.innerWidth < 600
                  ? `d-flex my-4 flex-column`
                  : `d-flex my-4 align-items-center`
              }
            >
              <span style={{ marginRight: "1rem", minWidth: "22%" }}>
                Requirement
              </span>
              <Input
                style={{ width: "100%" }}
                fluid
                value={this.state.Requirement}
                onChange={(e) => {
                  this.setState({ Requirement: e.target.value.substr(0, 150) });
                }}
                label={{
                  basic: true,
                  content: `${this.state.Requirement.length}/150`,
                }}
                labelPosition="right"
              />
            </div>

            <div
              className={
                window.innerWidth < 600
                  ? `d-flex my-4 flex-column`
                  : `d-flex my-4 align-items-center`
              }
            >
              <span style={{ marginRight: "1rem", minWidth: "22%" }}>
                Gender
              </span>

              <div>
                <Radio
                  label="Male"
                  name="Gender"
                  value="Male"
                  checked={this.state.GenderForPost === "Male"}
                  onChange={() => {
                    this.setState({ GenderForPost: "Male" });
                  }}
                />

                <Radio
                  className="mx-4"
                  label="Female"
                  name="Gender"
                  value="Female"
                  checked={this.state.GenderForPost === "Female"}
                  onChange={() => {
                    this.setState({ GenderForPost: "Female" });
                  }}
                />

                <Radio
                  label="Both"
                  name="Gender"
                  value="Both"
                  checked={this.state.GenderForPost === "Both"}
                  onChange={() => {
                    this.setState({ GenderForPost: "Both" });
                  }}
                />
              </div>
            </div>

            <div
              className={
                window.innerWidth < 600
                  ? `d-flex my-4 flex-column`
                  : `d-flex my-4 align-items-center`
              }
            >
              <span style={{ marginRight: "1rem", minWidth: "22%" }}>
                Location
              </span>
              {this.LocationShowAsList({value:this.state.LocationForPost})}
              {/* <this.LocationShowAsList value={this.state.LocationForPost} /> */}
            </div>

            <div
              className={
                window.innerWidth < 600
                  ? `d-flex my-4 flex-column`
                  : `d-flex my-4 align-items-center`
              }
            >
              <span style={{ marginRight: "1rem", minWidth: "22%" }}>
                Language
              </span>
              {this.LanguageShowAsList({value:this.state.LanguageForPost})}
              {/* <this.LanguageShowAsList value={this.state.LanguageForPost} /> */}
            </div>

            <div
              className={
                window.innerWidth < 600
                  ? `d-flex flex-column my-4`
                  : `d-flex my-4 align-items-center`
              }
            >
              <span style={{ marginRight: "1rem", minWidth: "22%" }}>
                Additional Description
              </span>
              <TextArea
                style={{ width: "100%", padding: ".67857143em 1em" }}
                rows={4}
                value={this.state.Description}
                onChange={(e, { value }) => {
                  this.setState({ Description: value });
                }}
              />
            </div>
          </div>
        );
      case "Offer":
        return (
          <div>
            <div>
              <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>Offer Type</span>
              <Radio
                className="mx-3"
                label="Offer"
                value="Offer"
                checked={this.state.OfferType === "Offer"}
                onChange={() => {
                  this.setState({ OfferType: "Offer" });
                }}
              />
            </div>

            <hr />

            <div
              className={
                window.innerWidth < 600
                  ? `d-flex my-4 flex-column`
                  : `d-flex my-4 align-items-center`
              }
            >
              <span style={{ marginRight: "1rem", minWidth: "22%" }}>
                Heading
              </span>
              <Input
                style={{
                  width: "100%",
                  fontWeight: "800",
                  fontSize: "1.25rem",
                }}
                fluid
                value={this.state.Heading}
                onChange={(e) => {
                  this.setState({ Heading: e.target.value });
                }}
              />
            </div>

            <div
              className={
                window.innerWidth < 600
                  ? `d-flex my-4 flex-column`
                  : `d-flex my-4 align-items-center`
              }
            >
              <span style={{ marginRight: "1rem", minWidth: "22%" }}>
                Validity
              </span>
              <span>
                <span>
                  From{" "}
                  <Input
                    type="date"
                    value={this.state.ValidFrom}
                    onChange={(e) => {
                      this.setState({ ValidFrom: e.target.value });
                    }}
                  />
                </span>
              </span>
              <span className="ms-3">
                <span>
                  To{" "}
                  <Input
                    type="date"
                    value={this.state.ValidUpto}
                    onChange={(e) => {
                      this.setState({ ValidUpto: e.target.value });
                    }}
                  />
                </span>
              </span>
            </div>

            <div
              className={
                window.innerWidth < 600
                  ? `d-flex my-4 flex-column`
                  : `d-flex my-4 align-items-center`
              }
            >
              <span style={{ marginRight: "1rem", minWidth: "22%" }}>
                Offer Image
              </span>
              <Input type="file" onChange={this.readImages} />
            </div>

            <div
              className={
                window.innerWidth < 600
                  ? `d-flex flex-column my-4`
                  : `d-flex my-4 align-items-center`
              }
            >
              <span style={{ marginRight: "1rem", minWidth: "22%" }}>
                Additional Description
              </span>
              <TextArea
                style={{ width: "100%", padding: ".67857143em 1em" }}
                rows={4}
                value={this.state.Description}
                onChange={(e, { value }) => {
                  this.setState({ Description: value });
                }}
              />
            </div>
          </div>
        );
      default:
        return <></>;
    }
  };

  handleClose = ()=>{
      this.setState({SnackbarOpen:false});
  }

  AlertMiUi = props =>{
    return <MuiAlert  elevation={6} variant="filled" {...props}  />
}

  render() {
    return (
        <div>
          <Snackbar open={this.state.SnackbarOpen} autoHideDuration={5000} onClose={this.handleClose}>
            <this.AlertMiUi  onClose={this.handleClose} severity={this.state.SnackbarAlert}>{this.state.SnackbarText}</this.AlertMiUi>
          </Snackbar>

        {/* <div><Navbar Username={this.state.Username} /></div> */}
        <div className="p-3">
          <h3>
            <b>Create New Post...</b>
          </h3>
          <div
            className={`d-flex  ${
              this.state.screenWidth < 800
                ? "flex-column"
                : "align-items-center"
            }`}
          >
            <span style={{ marginRight: "1rem", whiteSpace: "nowrap" }}>
              What do you want to post ?{" "}
            </span>
            <Segment className="my-0 mx-2 p-0">
              <Radio
                style={{ cursor: "pointer" }}
                className="p-3"
                label="Collaboration"
                value="Collaboration"
                onChange={this.handleChangeType}
                checked={this.state.Type === "Collaboration"}
              />
            </Segment>
            <Segment className="my-0 mx-2 p-0">
              <Radio
                style={{ cursor: "pointer" }}
                className="p-3"
                label="Requirement"
                value="Requirement"
                onChange={this.handleChangeType}
                checked={this.state.Type === "Requirement"}
              />
            </Segment>
            <Segment className="my-0 mx-2 p-0">
              <Radio
                style={{ cursor: "pointer" }}
                className="p-3"
                label="Offer"
                value="Offer"
                onChange={this.handleChangeType}
                checked={this.state.Type === "Offer"}
              />
            </Segment>
          </div>
          <div style={{ marginTop: "2rem" }}>
            {this.state.Type === "" ? null : (
              <Accordion fluid styled>
                <Accordion.Title
                  active
                  index={0}
                  onClick={null}
                  style={{ fontSize: "1.2rem" }}
                >
                  <Icon1 name="dropdown" />
                  {this.state.Type}
                </Accordion.Title>
                <Accordion.Content active>
                  <this.AccordianInsideContent />
                </Accordion.Content>
              </Accordion>
            )}
          </div>
          <span style={{fontWeight:800, color:'darkred', fontSize:'0.9rem', opacity : `${this.state.ErrorInCreationPost?'1':'0'}`}}>Fill All the required details.</span>
          <br />
          <Button color='blue' className='mt-2' disabled={this.state.uploading} onClick={(e)=>{this.SendPostToBackend(e)}}>{
          this.state.uploading?<span>Uploading</span>:<span>Send</span>
  }</Button>
        </div>
      </div>
    );
  }
}
