import React from 'react'
import {Button} from 'antd';
import {IoIosArrowDropdown} from 'react-icons/io';
import {IoIosArrowDropup} from 'react-icons/io';
import { Label,Icon,Button as Bt1,Divider } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import Badge from 'react-bootstrap/Badge'
import {GoLocation} from 'react-icons/go';
import {IoLanguage} from 'react-icons/io5';

function LocationArrayComponent(props){
    const zx = props.Location.map((loc,index)=><Badge bg="success" style={{fontSize:'1.2rem', fontWeight:'500'}} className="d-flex mx-2 align-items-center my-1" key={index}>{loc}</Badge>
    // <span className="px-3" key={index}>{loc}</span>
    );

    return <div className='d-flex align-items-start'>
        {/* <HiLocationMarker /> */}
        <div className="my-1" style={{whiteSpace:'nowrap'}}>
        <GoLocation />
        <span style={{marginRight:'2rem'}}>Locations</span>
        </div>
        <div className='d-flex flex-wrap'>{zx}</div>
    </div>
}

function LanguageArrayComponent(props){
    const zx = props.Language.map((loc,index)=><Badge bg="success" style={{fontSize:'1.2rem', fontWeight:'500'}} className="d-flex mx-2 align-items-center my-1" key={index}>{loc}</Badge>);

    return <div className='d-flex align-items-start'>
        <div className="my-1" style={{whiteSpace:'nowrap'}}>
        <IoLanguage />
        <span style={{marginRight:'2rem'}}>Languages</span>
        </div>
        <div className='d-flex flex-wrap'>{zx}</div>
    </div>
}

function getDoubleDigit(number){
    if(number>9) return number;
    else        return '0'+String(number);
}

function changeDateFormat(date){
    const XX = new Date(date);
    const curr = new Date(Date.now());

    let TimeDiff = curr.getTime() - XX.getTime();
    let AMPM = XX.getHours()>=12?"PM":"AM";
    if(TimeDiff<86400000*2)
    {
        if(XX.getDate()===curr.getDate() && XX.getMonth()===curr.getMonth() && XX.getFullYear()===curr.getFullYear())
            return "Today , "+getDoubleDigit(XX.getHours())+':'+ getDoubleDigit(XX.getMinutes()) + AMPM;
        if(curr.getTime()-curr.getTime()%86400000 - XX.getTime()<86400000)
            return "Yesterday , "+getDoubleDigit(XX.getHours()%12)+':'+ getDoubleDigit(XX.getMinutes()) + AMPM;
    }

    return String( getDoubleDigit(XX.getHours())+":"+ getDoubleDigit(XX.getMinutes()) + AMPM+" , "+ getDoubleDigit(XX.getDate())+'/'+getDoubleDigit(XX.getMonth())+'/'+XX.getFullYear() );
}

export default function Card(props){

    console.log(props.data);
    console.log(props.search_location)
    if(!props.data)     return <div></div>;
    const zx = props.data.map((item,index)=>{

        console.log(item)
        if(item && (props.search_location =='' || props.search_location == item.Location[0]))
        {
            return <SingleCard AccountType={props.group} data={item} key={index} />;
        }
            else    return null;
    })
    return <div>{zx}</div>
}

function SingleCard(props) {

    const [fullView, changeFullView] = React.useState(false);
    
    if(props.data.Type==="Collaboration")
    {

    return (
        <div style={{fontSize:'1.2rem',margin:'0.5rem',marginTop:'0',zIndex:'-1','position': 'absolute'}} className="mr-1 p-1 postCardsData">
            <div className="d-flex p-2">
                <div style={window.innerWidth>700?{width:'13%'}:{width:'25%'}}  className="d-flex">
                    <div className="d-flex flex-column align-items-center">
                        {/* <span style={{fontSize:'1rem',backgroundColor:'teal', padding:'0.25rem 1rem', borderRadius:'0.4rem',color:'white'}}>
                            Individual
                        </span> */}
                        <Label as='a' color='blue' ribbon size="large">
                        {props.AccountType}
                        </Label>
                        <div style={{width:'4rem', height:'4rem', marginTop:'0.7rem'}}>
                            <img style={{width:'100%', height:'100%',borderRadius:'50%', overflow:'hidden'}} 
                            src={`https://firebasestorage.googleapis.com/v0/b/adoose-3a465.appspot.com/o/${props.data["Username"]}%2FprofilePic%2Fimage?alt=media`} />
                        </div>
                    </div>
                </div>

                <div style={window.innerWidth>700?{width:'87%'}:{width:'75%'}} className='d-flex flex-column'>
                    <div className='ms-auto'>{changeDateFormat(props.data["Date"])}</div>
                    <div className='d-flex' style={{marginTop:'0.7rem'}}>
                        <b><span>@{props.data["Username"]}</span></b>
                        <span className='ms-auto' style={{fontWeight:'600', color:'green'}}>{props.data["CollabType"]+props.data["RequirementType"]+props.data["OfferType"]}</span>
                    </div>
                    <span>{props.data["Name"]}</span>
                    {
                        window.innerWidth>500?
                        <div>
                            <div style={{height:'0.1rem'}}></div>
                            <LocationArrayComponent Location={props.data["Location"]} />
                            <div style={{height:'0.5rem'}}></div>
                            
                            <span className="d-flex align-items-center"style={{color:'#999'}}>
                            <Icon name="plus square outline" style={{lineHeight : 'normal'}} />
                            Requirement
                            <hr style={{marginLeft:'0.5rem',width:'100%'}} />
                            </span>
                            
                            <div className="p-2" style={{background:'#ccc',borderRadius:'5px'}}>{props.data["Requirement"]}</div>
                        </div>
                        :null
                    }
                </div>
            </div>
            {
                window.innerWidth<=500?
                <div className="p-2">
                    <div style={{height:'0.1rem'}}></div>
                    <LocationArrayComponent Location={props.data["Location"]} />
                    <div style={{height:'0.5rem'}}></div>
                            
                            
                    <span className="d-flex align-items-center">
                        <Icon name="plus square outline" style={{lineHeight : 'normal'}} />
                        Requirement
                        <hr style={{marginLeft:'0.5rem',width:'100%'}} />
                    </span>
                            
                    
                    <div className="p-2" style={{background:'#ccc',borderRadius:'5px'}}>{props.data["Requirement"]}</div>
                </div>
                : null
            }

            <div className='d-flex p-2'>
                <Bt1 color="primary" onClick={()=>{changeFullView(!fullView)}} className="d-flex align-items-center px-2 py-1 border" style={{borderRadius:'5px', fontWeight:'500', fontSize:'1rem', paddingRight:'1rem'}}>
                    {
                        fullView?
                        <div className="d-flex align-items-center"><IoIosArrowDropup   size="1.5rem" style={{margin : '0 5px'}}/>Details</div>
                        :
                        <div className="d-flex align-items-center"><IoIosArrowDropdown size="1.5rem" style={{margin : '0 5px'}}/>Details</div>
                    }
                    </Bt1>
                <div className='ms-auto'>
                    {
                        localStorage.getItem("Username")==props.data["Username"]?
                        <Link to={`/profile`} >visit profile</Link>
                        :
                        <Link to={`/Users/${props.data["Username"]}`} >visit profile</Link>
                    }
                </div>
                    
            </div>

            <div style={{transition:'all 2s ease'}}>
            {
                fullView?
                <div style={fullView?{display:'block',fontSize:'1rem'}:{display:'none',transition:'all 2s ease'}} className='p-3'>
                    {props.data["Description"]}
                </div>
                :
                null
            }
            </div>
        </div>
    )

        }
        else if(props.data.Type==="Requirement")
        {
            return (
                <div style={{fontSize:'1.2rem',margin:'0.5rem',marginTop:'0',zIndex:'-1'}} className="mr-1 p-1 postCardsData">
            <div className="d-flex p-2">
                <div style={window.innerWidth>700?{width:'13%'}:{width:'25%'}}  className="d-flex">
                    <div className="d-flex flex-column align-items-center">
                        {/* <span style={{fontSize:'1rem',backgroundColor:'teal', padding:'0.25rem 1rem', borderRadius:'0.4rem',color:'white'}}>
                            Individual
                        </span> */}
                        <Label as='a' color='blue' ribbon size="large">
                        {props.AccountType}
                        </Label>
                        <div style={{width:'4rem', height:'4rem', marginTop:'0.7rem'}}>
                            <img style={{width:'100%', height:'100%',borderRadius:'50%', overflow:'hidden'}} 
                            src={`https://firebasestorage.googleapis.com/v0/b/adoose-3a465.appspot.com/o/${props.data["Username"]}%2FprofilePic%2Fimage?alt=media`} />
                        </div>
                    </div>
                </div>

                <div style={window.innerWidth>700?{width:'87%'}:{width:'75%'}} className='d-flex flex-column'>
                    <div className='ms-auto'>{changeDateFormat(props.data["Date"])}</div>
                    <div className='d-flex' style={{marginTop:'0.7rem'}}>
                        <b><span>@{props.data["Username"]}</span></b>
                        <span className='ms-auto' style={{fontWeight:'600', color:'green'}}>{props.data["CollabType"]+props.data["RequirementType"]+props.data["OfferType"]}</span>
                    </div>
                    <span>{props.data["Name"]}</span>
                    <br />
                    <span>Gender : {props.data.Gender}</span>
                    {
                        window.innerWidth>500?
                        <div>
                            <div style={{height:'0.1rem'}}></div>
                            <LocationArrayComponent Location={props.data["Location"]} />
                            <div style={{height:'0.5rem'}}></div>
                            <LanguageArrayComponent Language={props.data["Language"]} />
                            <div style={{height:'0.5rem'}}></div>

                            <span className="d-flex align-items-center"style={{color:'#999'}}>
                            <Icon name="plus square outline" style={{lineHeight : 'normal'}} />
                            Requirement
                            <hr style={{marginLeft:'0.5rem',width:'100%'}} />
                            </span>
                            
                            <div className="p-2" style={{background:'#ccc',borderRadius:'5px'}}>{props.data["Requirement"]}</div>
                        </div>
                        :null
                    }
                </div>
            </div>
            {
                window.innerWidth<=500?
                <div className="p-2">
                    <div style={{height:'0.1rem'}}></div>
                    <LocationArrayComponent Location={props.data["Location"]} />
                    <div style={{height:'0.5rem'}}></div>
                    <LanguageArrayComponent Language={props.data["Language"]} />
                    <div style={{height:'0.5rem'}}></div>
                            
                            
                    <span className="d-flex align-items-center">
                        <Icon name="plus square outline" style={{lineHeight : 'normal'}} />
                        Requirement
                        <hr style={{marginLeft:'0.5rem',width:'100%'}} />
                    </span>
                            
                    
                    <div className="p-2" style={{background:'#ccc',borderRadius:'5px'}}>{props.data["Requirement"]}</div>
                </div>
                : null
            }

            <div className='d-flex p-2'>
                <Bt1 color="primary" onClick={()=>{changeFullView(!fullView)}} className="d-flex align-items-center px-2 py-1 border" style={{borderRadius:'5px', fontWeight:'500', fontSize:'1rem', paddingRight:'1rem'}}>
                    {
                        fullView?
                        <div className="d-flex align-items-center"><IoIosArrowDropup   size="1.5rem" style={{margin : '0 5px'}}/>Details</div>
                        :
                        <div className="d-flex align-items-center"><IoIosArrowDropdown size="1.5rem" style={{margin : '0 5px'}}/>Details</div>
                    }
                    </Bt1>
                <div className='ms-auto'>
                    {
                        localStorage.getItem("Username")==props.data["Username"]?
                        <Link to={`/profile`} >visit profile</Link>
                        :
                        <Link to={`/Users/${props.data["Username"]}`} >visit profile</Link>
                    }
                </div>
                    
            </div>

            <div style={{transition:'all 2s ease'}}>
            {
                fullView?
                <div style={fullView?{display:'block',fontSize:'1rem'}:{display:'none',transition:'all 2s ease'}} className='p-3'>
                    {props.data["Description"]}
                </div>
                :
                null
            }
            </div>
        </div>
            )
        }
        else{
            return (
                <div style={{fontSize:'1.2rem',margin:'0.5rem',marginTop:'0',zIndex:'-1'}} className="mr-1 p-1 postCardsData">
            <div className="d-flex p-2">
                <div style={window.innerWidth>700?{width:'13%'}:{width:'25%'}}  className="d-flex">
                    <div className="d-flex flex-column align-items-center">
                        <Label as='a' color='blue' ribbon size="large">
                        {props.AccountType}
                        </Label>
                        <div style={{width:'4rem', height:'4rem', marginTop:'0.7rem'}}>
                            <img style={{width:'100%', height:'100%',borderRadius:'50%', overflow:'hidden'}} 
                            src={`https://firebasestorage.googleapis.com/v0/b/adoose-3a465.appspot.com/o/${props.data["Username"]}%2FprofilePic%2Fimage?alt=media`} />
                        </div>
                    </div>
                </div>

                <div style={window.innerWidth>700?{width:'87%'}:{width:'75%'}} className='d-flex flex-column'>
                    <div className='ms-auto'>{changeDateFormat(props.data["Date"])}</div>
                    <div className='d-flex' style={{marginTop:'0.7rem'}}>
                        <b><span>@{props.data["Username"]}</span></b>
                        <span className='ms-auto' style={{fontWeight:'600', color:'green'}}>{props.data["CollabType"]+props.data["RequirementType"]+props.data["OfferType"]}</span>
                    </div>

                    <div className={`d-flex ${window.innerWidth<700?"flex-column" : ""}`} style={{marginTop:'0.7rem'}}>
                        <span>{props.data["Name"]}</span>
                        <div className="d-flex ms-auto flex-column">
                            <span>Valid from : {new Date(props.data.ValidFrom).toDateString()}</span>
                            <span>Valid Upto : {new Date(props.data.ValidUpto).toDateString()}</span>
                        </div>

                    </div>
                    
                    {
                        window.innerWidth>500?
                        <div>
                            <span className="d-flex align-items-center"style={{color:'#999'}}>
                            <Icon name="plus square outline" style={{lineHeight : 'normal'}} />
                            Heading
                            <hr style={{marginLeft:'0.5rem',width:'100%'}} />
                            </span>
                            <div className="p-2" style={{background:'#ccc',borderRadius:'5px'}}>{props.data["Heading"]}</div>

                            <img src={props.data.OfferImage} style={{maxWidth:'100%'}} />
                        </div>
                        :null
                    }
                </div>
            </div>
            {
                window.innerWidth<=500?
                <div className="p-2">

                    <div style={{height:'0.5rem'}}></div>
                            
                            
                    <span className="d-flex align-items-center">
                        <Icon name="plus square outline" style={{lineHeight : 'normal'}} />
                        Heading
                        <hr style={{marginLeft:'0.5rem',width:'100%'}} />
                    </span>
                    <div className="p-2" style={{background:'#ccc',borderRadius:'5px'}}>{props.data["Heading"]}</div>
                    <img src={props.data.OfferImage} style={{maxWidth:'100%'}} />
                </div>
                : null
            }


            <div className='d-flex p-2'>
                <Bt1 color="primary" onClick={()=>{changeFullView(!fullView)}} className="d-flex align-items-center px-2 py-1 border" style={{borderRadius:'5px', fontWeight:'500', fontSize:'1rem', paddingRight:'1rem'}}>
                    {
                        fullView?
                        <div className="d-flex align-items-center"><IoIosArrowDropup   size="1.5rem" style={{margin : '0 5px'}}/>Details</div>
                        :
                        <div className="d-flex align-items-center"><IoIosArrowDropdown size="1.5rem" style={{margin : '0 5px'}}/>Details</div>
                    }
                    </Bt1>
                <div className='ms-auto'>
                    {
                        localStorage.getItem("Username")==props.data["Username"]?
                        <Link to={`/profile`} >visit profile</Link>
                        :
                        <Link to={`/Users/${props.data["Username"]}`} >visit profile</Link>
                    }
                </div>
                    
            </div>

            <div style={{transition:'all 2s ease'}}>
            {
                fullView?
                <div style={fullView?{display:'block',fontSize:'1rem'}:{display:'none',transition:'all 2s ease'}} className='p-3'>
                    {props.data["Description"]}
                </div>
                :
                null
            }
            </div>
        </div>
            )
        }
}
