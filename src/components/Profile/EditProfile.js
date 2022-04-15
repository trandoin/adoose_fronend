import React,{useState,useEffect} from 'react'
import Navbar from '../Navbar/Navbar';
import { editProfielData,getProfileData}  from '../../api/Profile';
import {Dropdown} from 'semantic-ui-react';
import storage from '../firebase/firebase';
import { ref,uploadBytes,getDownloadURL } from "firebase/storage"
import * as NotificationApi from "../../api/NotificationApi";
import {Link} from 'react-router-dom';

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
const EditProfile = () => {
    const [state, setstate] = useState({loading:false,edit_info:null});
    const {loading,edit_info} = state;

    useEffect(async () => {
        const profileData = await getProfileData({
            Email: localStorage.getItem("Email"),
            Mobile: localStorage.getItem("Mobile") || null,
          });
    
          if (profileData.data.type === "error") {
            localStorage.clear();
            window.location.href = "/";
      
          }else{
            setstate({...state,['edit_info']:profileData.data.user});
           
          }
    }, []);

    const  changeProfession = async(e,data)=>{  
    
        
        state.edit_info.Profession = data.value.slice(0,3);
      
        setstate({...state  })
    }


    const changeLocation = async(e,data)=>{

      state.edit_info.Location = data.value.slice(0,3);
      setstate({...state});
    
    }

    const changeLanguage = async(e,data)=>{  
      state.edit_info.Language = data.value.slice(0,3);
      setstate({...state});
   
       }

      const Inputchange =(e) =>{
        const {name,value} = e.target;
        state.edit_info[name] = value;
        setstate({...state});
      }

    const EditProfile_fun = async(e) =>{
      e.preventDefault();
     
      const res = await editProfielData(state.edit_info);
      if(res.data.type == "success"){
        await localStorage.setItem("Email", res.data.user.Email);
        window.location.href= "/profile";
      }
     


    }   


    const  readImages = async(e)=>{
      const file = e.target.files[0];
      
      if(!file)       return ;
      const images = ref(storage,`${state.edit_info?.Username}/profilePic/image`);
    
      uploadBytes(images, file).then((snapshot) => {
          console.log(snapshot);
          getDownloadURL(images).then((url) => {
              state.edit_info.ProfileImage = url;

              setstate({...state});

            // this.setState({ProfileImage:url})
          }
            )
        })
        .catch((err)=>{
           console.log(err)
        });
     
  }   


    return (
        <div
          className="ProfilePageMaster"
          style={{  marginTop: "3rem" }}
        >
          {loading ? (
            <></>
          ) : (

            <div>
               {/* <div>
              <Navbar
                Username={state.edit_info?.Username}
                Notifications={Notifications}
                Unread={UnreadNotifications}
              />
            </div> */}
              <Link className='btn btn-warning mx-2' to="/profile">Go Back</Link>
              {/* <hr className="mt-1" /> */}
              <div
                className="d-flex flex-column"
                style={
                  {
                    
                        // height:"100vh",
                        width:"100%",
                        // backgroundColor: "#fcfce0",
                        display:"flex",
                        justifyContent:"center",
                        alignItems:"center"
                      }
                }
              >
              <form  method="post" className='edit_profile_form' onSubmit={EditProfile_fun} style={{width:"40%",backgroundColor:"white",padding:"50px"}}>
                  <h1 className='text-center'>Edit Profile</h1>
                <div className="form-group">
                    <label htmlFor="">Name :</label>
                    <input type="text" className='form-control' name="Name" onChange={Inputchange} value={edit_info?.Name}  />
                </div>
                <div className="form-group">
                    <label htmlFor="">Email  :</label>
                    <input type="text" className='form-control' name="Email" onChange={Inputchange} value={edit_info?.Email ? edit_info?.Email:edit_info?.Mobile } />
                </div>
                <div className="form-group">
                    <label htmlFor="">Location :</label>
                    <Dropdown
                            placeholder='Location'
                            fluid
                            noResultsMessage = {"No location found"}
                            search
                            multiple
                            value={edit_info?.Location}
                            onChange = {changeLocation}
                            selection
                            minCharacters={2}
                            options={LocationOptions}
                        />
                        <p className='text-danger'>** You can select max 3 location only</p>
                </div>
                <div className="form-group">
                    <label htmlFor="">Language :</label>
                  
                    <Dropdown
                            placeholder='Language'
                            fluid
                            noResultsMessage = {"No Language found"}
                            search
                            multiple
                            value={edit_info?.Language}
                            onChange = {changeLanguage}
                            selection
                            minCharacters={2}
                            options={LanguageOptions}
                        />
                            <p className='text-danger'>** you can select max 3 language only</p>
                </div>
                <div className="form-group">
                    <label htmlFor="">Profession :</label>
                    <Dropdown
                            placeholder='Profession'
                            fluid
                            multiple
                            noResultsMessage = {"No Profession found"}
                            search
                            value = {edit_info?.Profession}
                            onChange = {changeProfession}
                            selection
                            options={ProfessionOptions}
                        />
                        <p className='text-danger'>** you can select max 3 profession only</p>
                </div>
                <div className="form-group">
                    <label htmlFor="">Profile Image :</label>
                    <input type="file" className='form-control' onChange={readImages} />
                </div>
                <div className="form-group mt-3">
                    <button type="submit" className='btn btn-primary'>Edit Profile</button>
                </div>
                


              </form>
            </div>
            </div>
          )}
        </div>
      );
}

export default EditProfile
