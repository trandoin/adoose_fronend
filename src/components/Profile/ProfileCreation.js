import React, { Component } from 'react'
import {Upload, Tabs, Radio,Button,Popover,Space,Input,Modal} from 'antd';
import { Input as Input1} from 'semantic-ui-react'
import '../../CSS/Profile/profileCreation.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {VscSymbolNamespace} from 'react-icons/vsc';
import * as api from '../../api/ProfileCreation';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import storage from '../firebase/firebase';
import { ref,uploadBytes,getDownloadURL } from "firebase/storage"
import {RiLoader2Line} from 'react-icons/ri';
import {Dropdown} from 'semantic-ui-react';
import LeftPart from './LeftPart';

const { TabPane } = Tabs;
const { TextArea } = Input;

const usernameRegex = /^[a-zA-Z_-][a-z0-9_-]{3,15}$/;


const ProfessionOptions = [
    {key:'A',value:'A',text:'A'},
    {key:'B',value:'B',text:'B'},
    {key:'C',value:'C',text:'C'},
    {key:'D',value:'D',text:'D'},
    {key:'E',value:'E',text:'E'},
    {key:'F',value:'F',text:'F'},
]

const LocationOptions = [
    {key:'Aaa',value:'Aaa',text:'Aaa'},
    {key:'Aaab',value:'Aaab',text:'Aaab'},
    {key:'Aaac',value:'Aaac',text:'Aaac'},
    {key:'Bbb',value:'Bbb',text:'Bbb'},
    {key:'Ccc',value:'Ccc',text:'Ccc'},
    {key:'Ddd',value:'Ddd',text:'Ddd'},
    {key:'Eee',value:'Eee',text:'Eee'},
    {key:'Fff',value:'Fff',text:'Fff'},
]

const LanguageOptions = [
    {key:'hindi',value:'hindi',text:'hindi'},
    {key:'English',value:'English',text:'English'},
    {key:'C',value:'C',text:'C'},
    {key:'D',value:'D',text:'D'},
    {key:'E',value:'E',text:'E'},
    {key:'F',value:'F',text:'F'},
]


export default class ProfileCreation extends Component {

    constructor(props) {
        super(props);
        this.state = {
          mode: 'left',
          loading : true,
          SnackbarOpen : false,
          AlertSeverity : null,
          AlertText : null,
          usernameLoading : false,
          usernameError : false,
          GeneralEmptinessError : false,
          workModalVisible : false,
        };
    }

    AlertMiUi = props =>    <MuiAlert  elevation={6} variant="filled" {...props}  />
    
    autoCloseSnackbar = () =>{ this.setState({SnackbarOpen : false}); }

    resizeWindow = () =>{  window.innerWidth<=760?this.setState({mode:'top'}):this.setState({mode:'left'});}

    FieldLabel = styled.div`
        font-weight:500;
        color:black;
        font-size: 1.1rem;
        margin:0.5rem 0;
    `;

    UsernameHints = (
        <ul>
            <li>Must have atleast 8 characters</li>
            <li>Atleast one smallcase, one uppercase and one number</li>
            <li>Atleast one special character like @,#,$,%</li>
        </ul>
      );

    GlobalValueChecker = (value,Expression) =>{
        if(value && value.length>0){
            if(Expression) {
                let x = Expression.test(value);
                return x;
            }
            else return true;
        }
        else  return false;
    }

    // AlertErrorState = (value,Expression)=>{
    // }

    LogUserOut = (Message) =>{
        localStorage.clear();
        this.setState({SnackbarOpen : true,AlertSeverity:'error', AlertText:Message});
        setTimeout(() => {window.location.href = '/'}, 1000);
    }

    RedirectToHome = ()=>{
        this.setState({SnackbarOpen : true,AlertSeverity: 'error',AlertText:'This user has already a profile created. Redirecting...'});
        setTimeout(() => {window.location.href = '/';}, 1000);
    }

    componentDidMount = async()=>{
        
        this.resizeWindow();
        window.addEventListener('resize',this.resizeWindow);
        
        const profileData = await api.getProfileData({Email:localStorage.getItem('Email'), Mobile : localStorage.getItem('Mobile')});
        if(profileData.data.user.type==='error')    {this.LogUserOut(profileData.data.message);  return ;  }
        if(profileData.data.user.filled===true)     {this.RedirectToHome(); return ;}

        if(!profileData.data.user.Profession)     profileData.data.user.Profession = []
        if(!profileData.data.user.Language)       profileData.data.user.Language = []
        if(!profileData.data.user.Location)       profileData.data.user.Location = []
        if(!profileData.data.user.work)             profileData.data.user.work = []
        if(!profileData.data.user.workImage)        profileData.data.user.workImage = [];

        console.log(profileData.data.user);
        await this.setState({...profileData.data.user,loading:false});
        console.log(this.state);
    }

    usernameIschanging = async(x)=>{
        await this.setState({usernameLoading:true, Username : x});

        const checker = await this.GlobalValueChecker(x,usernameRegex);
        if(!checker)
        {
            await this.setState({usernameError:true, usernameLoading : false});
            return ;
        }
        console.log("ab")
        const data = await api.checkUsernameAvailability({username : this.state.Username,Email:localStorage.getItem('Email'), Mobile:localStorage.getItem('Mobile')});
        if(data.data.type==='success')      await this.setState({usernameLoading : false,usernameError : false});
        else                                await this.setState({usernameLoading:false,usernameError : true});
    }

    changeProfession = async(e,data)=>{     this.setState({Profession : data.value.slice(0,3)});    }

    changeBriefDetailsSection = (x)=>{
        if(x.length<=100)                                       this.setState({BriefDetails:x});
        if(this.state.GeneralEmptinessError && x.length>0)      this.setState({GeneralEmptinessError : false});
    }

    // TODO: 
    workDetails = async(e)=>{
        e.preventDefault();
        const workTitle = e.target.workTitle.value;
        const workDesc = e.target.workDesc.value;
        const workLink1 = e.target.workLink1.value;
        const workLink2 = e.target.workLink2.value;
        const workLink3 = e.target.workLink3.value;
        const workLink4 = e.target.workLink4.value;

        const workAppend = [workTitle,workDesc,workLink1+" "+workLink2+' '+workLink3 + ' '+workLink4];

        
        this.setState({work : workAppend});
        let workImageState = [];
        console.log(e.target.workImage.files);
        if(e.target.workImage.files.length>0)
        {
            for(let i =0;i<e.target.workImage.files.length;i++)
            {
                const newWorkImage = e.target.workImage.files[i];
                let reader = new FileReader();
                let url = reader.readAsDataURL(newWorkImage);
                reader.onloadend = (e)=>{
                    const base64 = reader.result;
                    workImageState.push(base64);
                    this.setState({workImage : workImageState});
                }
            }
        }
        this.setState({workModalVisible : false});
    }

    DeleteWork = ()=>{
        this.setState({work : [], workImage : []});
    }

    changeLanguage = async(e,data)=>{   this.setState({Language : data.value.slice(0,3)})   }
    changeLocation = async(e,data)=>{this.setState({Location : data.value.slice(0,3)});}



    changeAccountType = ()=>{
        if(this.state.AccountType==="Organisation")         this.setState({AccountType : "Individual"});
        else                                                this.setState({AccountType : "Organisation"});
    }

    SwitchRightPart = props =>{
        switch (props.x) {
            case 0:
                return (
                    <div>
                        <div style={{fontSize:'1.3rem'}}>Let's Start creating your profile.</div>
                        <div style={{color:'#888', fontWeight:'400'}}>We ask detailed information to provide better insights with every search.<br />Don't Worry! Your information will always be safe with us.</div>

                        

                    </div>
                );
            case 1:
                return (
                    <div>
                        <div style={{fontSize:'1.3rem'}}>Account's Important Information</div>
                        <div style={{color:'#888', fontWeight:'400'}}>Try to make it unique and cool. People will get to know you by your username</div>
                        <br />
                        <this.FieldLabel style={{color:this.state.Username!=null?"#888":'black'}}>Username</this.FieldLabel>
                        <TextField style={{color:'black'}} variant='outlined' color='primary' size='small' fullWidth  type="text" placeholder='elon_musk' name='Username' required onChange={(e)=>{this.usernameIschanging(e.target.value)}} error={this.state.usernameError} value={this.state.Username}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><VscSymbolNamespace size='1.3em' /></InputAdornment>), endAdornment:(<InputAdornment position='end'>{this.state.usernameLoading===true?<RiLoader2Line size='1.3em' />:<></>}</InputAdornment>)}} />
                    </div>
                );
            case 2:
                return (
                    <div>
                        <div style={{fontSize:'1.3rem'}}>Gender related Information</div>
                        <div>Help us to identify you with your unique identity</div>
                        <div style={{color:'#888', fontWeight:'400'}}>It's completely okay to not reveal your gender.</div>

                        <br />
                        <Radio.Group onChange={(e)=>{this.setState({Gender : e.target.value})}} value={this.state.Gender}>
                            <Space direction="vertical">
                            <Radio value="Male">Male</Radio>
                            <Radio value="Female">Female</Radio>
                            <Radio value="Other">Don't wish to reveal</Radio>
                            </Space>
                        </Radio.Group>

                    </div>
                );
            case 3:
                return (
                    <div>
                        <div style={{fontSize:'1.3rem'}}>Tell us what you are best at.</div>
                        <div style={{color:'#888', fontWeight:'400'}}>You can write atmost 3 professions.</div>

                        <div className="d-flex align-items-center">
                            <this.FieldLabel style={{color:this.state.Username!=null?"#888":'black'}}>Select Professions</this.FieldLabel>
                            <span style={{color:'green'}} className='ms-auto'><b>{this.state.Profession.length}/3</b></span>
                        </div>
                        <Dropdown
                            placeholder='Profession'
                            fluid
                            multiple
                            noResultsMessage = {"No location found"}
                            search
                            value = {this.state.Profession}
                            onChange = {this.changeProfession}
                            selection
                            options={ProfessionOptions}
                        />
                    </div>
                );
            case 4:
                return (
                    <div>
                        <div style={{fontSize:'1.3rem'}}>Tell us a bit about yourself under 100 words.</div>
                        <div style={{color:'#888', fontWeight:'400'}}>This will be shown to every user who gets your posts or profile. Make it crisp and special.</div>
                        <br />
                        <TextArea autoSize={{minRows:4,maxRows:10}} value={this.state.BriefDetails} onChange={(e)=>{this.changeBriefDetailsSection(e.target.value)}} />
                        <div class='d-flex ms-auto'><span>{100-this.state.BriefDetails.length} characters remaining</span></div>
                        <br />
                        <div>
                            <b>What do you represent ?</b>
                            <br />
                            <Radio.Group onChange={this.changeAccountType} value={this.state.AccountType}>
                                <Radio value="Individual" >Individual</Radio>
                                <Radio value="Organisation" >Organisation</Radio>
                            </Radio.Group>
                        </div>

                    </div>
                );
            case 5:
                return (
                    <div>
                        <div style={{fontSize:'1.3rem'}}>Showcase your work history</div>
                        <div style={{color:'#888', fontWeight:'400'}}>Advisable is to put your work experiences in reverse order</div>
                        <br />

                        {   
                            this.state.work.length>0
                            ?
                            <div><div className='d-flex align-items-center' style={{fontSize:'1.3rem'}}>
                            <b>My work</b>
                        </div>
                        <ol className='m-0 p-0 my-2'>
                        <li className='my-2' style={{listStyleType:'none'}} className='border m- p-2'>
                            <div className='d-flex align-items-center'>
                                <b>{this.state.work[0]}</b>
                                <Button className='ms-auto' type='danger' onClick={()=>{this.DeleteWork()}}>Delete</Button>
                            </div>
                        </li>
                    </ol>
                    </div>
                            :
                            null
                        }
                        
                        <br />
                        {/* <Modal destroyOnClose title="Add work details" visible={this.state.workModalVisible} footer={null}>
                            <form method="POST" onSubmit={(e)=>{this.workDetails(e)}}>
                                <TextField label="Title" variant='standard' color='primary' size='small' fullWidth  type="text" name='workTitle' required/>
                                <br /><br />
                                <TextField  label="Description" variant='filled' multiline minRows={4} color='primary' size='small' fullWidth  type="text" name='workDesc' />
                                <br /><br />
                                <TextField  label="Link" variant='standard' color='primary' size='small' fullWidth type="url" name='workLink' />
                                <br /><br />
                                <input type="file" name="workImage" label="Upload your work picture" accept=".jpg,.jpeg,.png" />
                                <br /><br />
                                <Button htmlType ="reset"  type="default" style={{color:"grey"}} onClick={()=>{this.setState({workModalVisible : false})}} >cancel</Button>
                                <span className='mx-2'><Button htmlType="submit" type="primary">Submit</Button> </span>
                                
                            </form>
                        </Modal> */}
                        <Modal destroyOnClose title="Add work details" visible={this.state.workModalVisible} footer={null}>
                            <form method="POST" onSubmit={(e)=>{this.workDetails(e)}}>
                                <TextField label="Title" variant='standard' color='primary' size='small' fullWidth  type="text" name='workTitle' required/>
                                <br /><br />
                                <TextField  label="Description" variant='filled' multiline minRows={4} color='primary' size='small' fullWidth  type="text" name='workDesc' />
                                <br /><br />
                                <TextField  label="Link" variant='standard' color='primary' size='small' fullWidth type="url" name='workLink1' />
                                <TextField  label="Link" variant='standard' color='primary' size='small' fullWidth type="url" name='workLink2' />
                                <TextField  label="Link" variant='standard' color='primary' size='small' fullWidth type="url" name='workLink3' />
                                <TextField  label="Link" variant='standard' color='primary' size='small' fullWidth type="url" name='workLink4' />
                                <br /><br />
                                <input type="file" name="workImage" label="Upload your work picture" accept=".jpg,.jpeg,.png" multiple />/*
                                <br /><br />
                                <Button htmlType ="reset"  type="default" style={{color:"grey"}} onClick={()=>{this.setState({workModalVisible : false})}} >cancel</Button>
                                <span className='mx-2'><Button htmlType="submit" type="primary">Submit</Button> </span>
                                
                            </form>
                        </Modal>
                        {this.state.work.length==0
                        ?
                        <Button type="primary" onClick={()=>{this.setState({workModalVisible:true})}}>
                            Add Work
                        </Button>
                            :null
                        }

                    </div>
                );
            case 6:
                return (
                    <div>
                        <div style={{fontSize:'1.3rem'}}>Tell us what you can speak.</div>
                        <div style={{color:'#888', fontWeight:'400'}}>You can write atmost 3 Languages.</div>

                        <div className='d-flex align-items-center'>
                            <this.FieldLabel>Select Languages</this.FieldLabel>
                            <span style={{color:'green'}} className='ms-auto'><b>{this.state.Language.length}/3</b></span>
                        </div>
                        <Dropdown
                            placeholder='Language'
                            fluid
                            noResultsMessage = {"No location found"}
                            search
                            multiple
                            value = {this.state.Language}
                            onChange = {this.changeLanguage}
                            selection
                            options={LanguageOptions}
                        />
                    </div>
                );
            case 7:
                return (
                    <div>
                        <div style={{fontSize:'1.3rem'}}>Tell us where you are.</div>
                        <div style={{color:'#888', fontWeight:'400'}}>You can write atmost 3 Locations.</div>

                        
                        <this.FieldLabel>Select Locations</this.FieldLabel>
                        
                        
                        <Dropdown
                            placeholder='Location'
                            fluid
                            noResultsMessage = {"No location found"}
                            search
                            multiple
                            value = {this.state.Location}
                            onChange = {this.changeLocation}
                            selection
                            minCharacters={2}
                            options={LocationOptions}
                        />

                    </div>
                );
            case 8:
                return (
                    <div>
                        <div style={{fontSize:'1.3rem'}}>Tell us how to reach you</div>
                        <div style={{color:'#888', fontWeight:'400'}}></div>

                        <br/>

                        {/* // fb insta twitter linkedin pinterwst youtube  */}
                        <div className='d-flex flex-column'>
                        <Input1 className="my-1" label='Facebook' />
                        <Input1 className="my-1" label='Instagram' />
                        <Input1 className="my-1" label='Twitter'  />
                        <Input1  className="my-1"label='Linkedin' />
                        <Input1  className="my-1"label='Pinterest' />
                        <Input1  className="my-1"label='Youtube' />
                        </div>


                        <div style={{color:'#888', fontWeight:'400'}}></div>
                    </div>
                );
            case 9:
                return (
                    <div>
                        <div style={{fontSize:'1.3rem', padding:'0.5rem 0'}}>Your profile picture</div>
                        {
                            this.state.ProfileImage!=""?
                                <div className='d-flex align-items-center my-2' >
                                    <img style={{height:'3rem', width:'2.5rem',fontSize:'0.9rem'}} src={this.state.ProfileImage} />
                                    <span style={{fontSize:'0.9rem', marginLeft:'0.5rem'}}><b>Selected image</b></span>
                                </div>
                                : null
                        }
                        <input type='file' accept='.jpg,.jpeg,.png' name='profilePic' onChange={this.readImages} />
                    </div>
                );
        }
    }

    readImages = async(e)=>{
        const file = e.target.files[0];
        if(!file)       return ;
        const images = ref(storage,`${this.state.Username}/profilePic/image`);
        
        console.log('image')
        uploadBytes(images, file).then((snapshot) => {
            console.log(snapshot);
            getDownloadURL(images).then((url) => {this.setState({ProfileImage:url})})
          })
          .catch((err)=>{
             console.log(err)
          });
        // images.getDownloadURL().then((url) => {this.setState({ProfileImage : url})});
        console.log(file);
    }

    nextChange = async() =>{

        const getVal = this.state.filledCount;
        if(getVal===0)              this.setState({filledCount : getVal+1});
        else if(getVal===1)
        {
            await this.usernameIschanging(this.state.Username);
            if(this.state.usernameError===true)         return ;
            else                                        await this.setState({filledCount : getVal+1});
            const zx = await api.saveUserName({Username : this.state.Username, Email:localStorage.getItem('Email'),Mobile:localStorage.getItem('Mobile')});
            if(zx.data.type==='error'){
                await this.setState({SnackbarOpen: true,AlertText:zx.data.message,AlertSeverity:'error'});
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
            
        }
        else if(getVal===2)
        {
            if(this.state.Gender===undefined || this.state.Gender===null)           this.setState({GeneralEmptinessError:true});
            else
            {
                const data = await api.saveGender({Username : this.state.Username,Gender:this.state.Gender});
                if(data.data.type==='error'){
                    await this.setState({SnackbarOpen: true,AlertText:data.data.message,AlertSeverity:'error'});
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                }
                else    this.setState({GeneralEmptinessError:false,filledCount:getVal+1});
            }
        }
        else if(getVal===3){
            const Profession = this.state.Profession;
            if(Profession[0]==null && Profession[1]===null && Profession[2]===null)         this.setState({GeneralEmptinessError:true});
            else{
                const data = await api.saveProfession({Username : this.state.Username,Profession:Profession});
                if(data.data.type==='error')
                {
                    await this.setState({SnackbarOpen: true,AlertText:data.data.message,AlertSeverity:'error'});
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                }
                else    this.setState({GeneralEmptinessError:false,filledCount:getVal+1});
            }
        }
        else if(getVal===4){
            const BriefDetails =this.state.BriefDetails;
            const AccountType = this.state.AccountType;
            if(!BriefDetails || !AccountType ||  BriefDetails.length===0 || AccountType.length===0)     this.setState({GeneralEmptinessError:true});
            else
            {
                const data = await api.saveBriefDetails({Username : this.state.Username, BriefDetails : BriefDetails});
                if(data.data.type==='error')
                {
                    await this.setState({SnackbarOpen: true,AlertText:data.data.message,AlertSeverity:'error'});
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                }
                else        this.setState({GeneralEmptinessError:false,filledCount:getVal+1});
            }
        }
        else if(getVal===5){
            const work = this.state.work;
            
            if(!work || work.length===0)     this.setState({GeneralEmptinessError : true});
            else{
                const data = await api.saveWork({work : work, workImage:[], Username : this.state.Username});
                if(data.data.type==='error')
                {
                    await this.setState({SnackbarOpen: true,AlertText:data.data.message,AlertSeverity:'error'});
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                }
                else{
                    for(let i =0;i<this.state.workImage.length;i++)
                    {
                        const data1 = await api.addWorkImage({Username : this.state.Username, Image : this.state.workImage[i]});
                        if(data1.data.type==="error")
                        {
                            await this.setState({SnackbarOpen: true,AlertText:data.data.message,AlertSeverity:'error'});
                                setTimeout(() => {
                                    window.location.href = '/';
                                }, 1000);
                        }
                    }

                    this.setState({filledCount : getVal+1, GeneralEmptinessError:false});
                    
                }
            }
        }
        else if(getVal===6)
        {
            const language = this.state.Language;
            if(language.length===0) this.setState({GeneralEmptinessError:true});
            else
            {
                const data = await api.saveLanguage({language : language, Username : this.state.Username});
                if(data.data.type==='error')
                {
                    await this.setState({SnackbarOpen: true,AlertText:data.data.message,AlertSeverity:'error'});
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                }
                else        this.setState({GeneralEmptinessError:false,filledCount:getVal+1});
            }
        }
        else if(getVal===7){
            const Location = this.state.Location;
            if(Location.length===0) this.setState({GeneralEmptinessError:true});
            else
            {
                const data = await api.saveLocation({Location : Location, Username : this.state.Username});
                if(data.data.type==='error')
                {
                    await this.setState({SnackbarOpen: true,AlertText:data.data.message,AlertSeverity:'error'});
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                }
                else        this.setState({GeneralEmptinessError:false,filledCount:getVal+1});
            }
        }
        else if(getVal===8){
            //TODO : Social media parts here
            const data = await api.saveSocialMedia({Username : this.state.Username});
            if(data.data.type==='error')
                {
                    await this.setState({SnackbarOpen: true,AlertText:data.data.message,AlertSeverity:'error'});
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                }
            else        this.setState({GeneralEmptinessError:false,filledCount:getVal+1});
        }
        else if(getVal===9){
            const ProfileImage = this.state.ProfileImage;
            if(!ProfileImage || ProfileImage.length===0) this.setState({GeneralEmptinessError:true});
            else
            {
                const data = await api.saveProfileImage({ProfileImage : ProfileImage, Username : this.state.Username});
                if(data.data.type==='error')
                {
                    await this.setState({SnackbarOpen: true,AlertText:data.data.message,AlertSeverity:'error'});
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                }
                else{
                    const data1 = await api.saveAccountType({Username : this.state.Username, AccountType : this.state.AccountType});
                    if(data1.data.type==='error')
                    {
                        await this.setState({SnackbarOpen: true,AlertText:data.data.message,AlertSeverity:'error'});
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 1000);
                    }
                    else {
                        await this.setState({GeneralEmptinessError:false,filledCount:22, filled : true});
                        this.setState({SnackbarOpen : true, AlertText : "Account setup successfully. Redirecting...", AlertSeverity : 'success'})
                        setTimeout(() => {
                            window.location.href='/feed';
                        }, 1500);
                    }
                }
            }
        }

        console.log(this.state);
    }

    RightPart = props =>{

        return (
            <div style={{boxShadow:'0 0 8px #bbb',boxSizing:'border-box',margin:'0.5rem'}}>
                <div style={{fontSize:'1.6rem', padding:'1.5rem', background:'rgb(249,249,249)',borderBottom:'1px solid #ccc'}}>{props.text}</div>
                <div style={{ padding:'1.5rem', background:'white'}}>
                    <this.SwitchRightPart x = {props.x} />
                    <div style={{marginTop:'0.5rem' ,color:'darkred', fontWeight:'500', opacity:this.state.GeneralEmptinessError===true?'1':'0'}}>Fill in the required Fields to proceed</div>
                </div>
                <hr style={{marginTop:'0'}} />
                <div className='d-flex align-items-center m-4 pb-3' >
                    <button disabled={this.state.filledCount===0} className='BackButton' onClick= {()=>{let x = this.state.filledCount;this.setState({filledCount:x-1,GeneralEmptinessError:false}); console.log("Changed")}} >Back</button>
                    <button className="ms-auto NextButton" onClick={this.nextChange} >Next</button>
                </div>
            </div>
        );
    }

    
    render() {

        return (
            <div>
                <Snackbar open={this.state.SnackbarOpen} autoHideDuration={5000} onClose={this.autoCloseSnackbar}>
                    <this.AlertMiUi  onClose={this.autoCloseSnackbar} severity={this.state.AlertSeverity}>{this.state.AlertText}</this.AlertMiUi>
                </Snackbar>

                {
                    window.innerWidth>760?
                    <div  className='w-100 mb-5' style={{height:'70px',background:'rgb(29,67,84)',color:'white'}}>Appbar here</div>
                    : null
                }
                

                <div className='m-auto m-4' style={{maxWidth:'1000px'}} >
                    {
                        this.state.loading==false?
                        <Tabs activeKey = {String(this.state.filledCount)} tabPosition={this.state.mode} onTabClick = {null}>
                            <TabPane tab={<LeftPart x={0} text={"Getting Started"} filledCount={this.state.filledCount} />} key="0">
                                <this.RightPart x = {0} text={"Getting Started"} />
                            </TabPane>
                             <TabPane tab={<LeftPart x={1} text={"Account"}  filledCount={this.state.filledCount} />} key="1">
                                <this.RightPart x = {1} text={"Account"} />
                            </TabPane>
                            <TabPane tab={<LeftPart x={2} text={"Gender"} filledCount={this.state.filledCount} />} key="2">
                                <this.RightPart x = {2} text={"Gender"} />
                            </TabPane>
                            <TabPane tab={<LeftPart x={3} text={"Profession"} filledCount={this.state.filledCount} />} key="3">
                                <this.RightPart x = {3} text={"Profession"} />
                            </TabPane>
                            <TabPane tab={<LeftPart x={4} text={"Overview"} filledCount={this.state.filledCount} />} key="4">
                                <this.RightPart x = {4} text={"Overview"} />
                            </TabPane>
                            <TabPane tab={<LeftPart x={5} text={"Work"} filledCount={this.state.filledCount} />} key="5">
                                <this.RightPart x = {5} text={"Work"} />
                            </TabPane>
                            <TabPane tab={<LeftPart x={6} text={"Language"} filledCount={this.state.filledCount} />} key="6">
                                <this.RightPart x = {6} text={"Language"} />
                            </TabPane>
                            <TabPane tab={<LeftPart x={7} text={"Location"} filledCount={this.state.filledCount} />} key="7">
                                <this.RightPart x = {7} text={"Location"} />
                            </TabPane>
                            <TabPane tab={<LeftPart x={8} text={"Social Media"} filledCount={this.state.filledCount} />} key="8">
                                <this.RightPart x = {8} text={"Social Media"} />
                            </TabPane>
                            <TabPane tab={<LeftPart x={9} text={"Profile Photo"} filledCount={this.state.filledCount} />} key="9">
                                <this.RightPart x = {9} text={"Profile Photo"} />
                            </TabPane>


                        </Tabs>
                        :
                        null
                    }
                </div>
            </div>
        )
    }
}
