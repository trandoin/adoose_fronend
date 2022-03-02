import React from 'react'
import styled from 'styled-components';
import {Rate} from 'antd';

export default function ImagePortion(props) {

    

    return (
        <div className="mt-3 p-2 d-flex align-items-center flex-column">

        <div style={{width:'8rem',height:'8rem',
            // border:'0 solid black',
             overflow:'hidden',borderRadius:'50%'
            ,boxShadow:'0 0 4px #444',
            // background:'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1nkp-dEqC23OPyqnHGDYzH15Q3IwAHiqW9A&usqp=CAU") center top/cover no-repeat'
            background:`url("${props.ProfileImage}") center top/cover no-repeat`
            }}>
                    {/* <img 
                    // src={props.ProfileImage}
                    src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1nkp-dEqC23OPyqnHGDYzH15Q3IwAHiqW9A&usqp=CAU"}
                     style={{width:'100%',height:'100%',borderRadius:'50%'}}  /> */}
            </div>
            <br />
            <br />
            {/* TODO : Write appropriate Rating */}
            <Rate disabled style={{color:'#ffc800',width:'100%',margin:'auto'}} className="text-center" defaultValue={props.stars}  />
            <span style={{fontSize:'1.1rem',fontWeight:'600'}}>Rating</span>
        </div>
    )
}
