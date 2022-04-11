import React from 'react'
import {VscDebugStart} from 'react-icons/vsc';
import {GoVerified} from 'react-icons/go';

export default function LeftPart(props) {
    return (
        <div className='d-flex align-items-center w-100 px-3 py-2' style={props.filledCount>=props.x?{color:'black',fontWeight:'500'}:{color:'#888',fontWeight:'500'}}>
            <div><VscDebugStart size='1.4em' style={props.filledCount==props.x?{color:'green',maxWidth:"2em",marginRight:'0.7rem'}:{maxWidth:"2em",marginRight:'0.7rem'}} /></div>
            <div><span style={{color:props.filledCount===props.x?'green': props.filledCount>props.x?'rgba(0,0,0,0.85)':'#888', fontWeight:'600'}}>{props.text}</span></div>
            <div className = 'd-flex align-items-center ms-auto'><GoVerified size='1.1em' style={props.filledCount>props.x?{color:'green'}:{color:'#888'}} /></div>
        </div>
    )
}
