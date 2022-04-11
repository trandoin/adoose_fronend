import React from 'react'
import {MdTimeline} from 'react-icons/md';
import {FaWpexplorer} from 'react-icons/fa';
import {FiUserPlus} from 'react-icons/fi';
import {AiOutlineUsergroupAdd} from 'react-icons/ai';
import {GoTag} from 'react-icons/go';


const TabTopDesign = ({value}) => {
    return (<div className={`w-100 d-flex align-items-center ${window.innerWidth<700?'flex-column':''}`} >
    {value==="Timeline"?<MdTimeline size='1.75em'  style={{paddingLeft:'1rem',boxSizing:'content-box'}} />:null}
    {value==="Explore"?<FaWpexplorer size='1.75em'  style={{paddingLeft:'1rem',boxSizing:'content-box'}} />:null}
    {value==="Collab"?<AiOutlineUsergroupAdd size='1.75em'  style={{paddingLeft:'1rem',boxSizing:'content-box'}} />:null}
    {value==="Requirement"?<FiUserPlus size='1.75em'  style={{paddingLeft:'1rem',boxSizing:'content-box'}} />:null}
    {value==="Offer"?<GoTag size='1.75em'  style={{paddingLeft:'1rem',boxSizing:'content-box'}} />:null}
    {
        window.innerWidth>500?
        <span style={{marginLeft:'1rem',fontWeight:'600', textOverflow:'elipsis', whiteSpace:'nowrap', overflow:'hidden'}} className={`${window.innerWidth<700?'mt-1':''}`}>{value}</span>
        :
        null
    }
</div>);
}

export default TabTopDesign

