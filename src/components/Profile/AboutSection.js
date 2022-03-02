import React,{useState,useRef, useEffect } from 'react';
import {Button} from 'antd';
import { TextArea } from 'semantic-ui-react';

export default function AboutSection(props) {

    const [editAbout,changeEditAbout] = React.useState(false);
    const [content,changeContent] = React.useState(props.About);
    
    // const inputRef = useRef(null);
    // useEffect(() => {
    //     inputRef.current.focus();
    // }, [inputRef]);

    const onEditButtonClick = () =>{
        changeContent(props.About);
        changeEditAbout(true);
    }

    const onEditCancel = ()=>{
        changeEditAbout(false);
    }

    const onSaveEdit = () =>{
        props.changeAbout(content);
        changeEditAbout(false);
    }

    console.log(editAbout);

    return (
        <div>
            {
                editAbout===false?
                <div>
                    <pre style={{fontFamily:'inherit'}}>{props.About}</pre>
                    {
                        props.Other===false ? 
                        <div>
                            <br />
                            <Button type="primary" onClick={onEditButtonClick} >Edit</Button>
                        </div>
                        :
                        null
                    }
                </div>
                :
                <div>
                    <TextArea style={{width:'100%', borderRadius:'0.5rem'}} rows={5} onChange={(e)=>{changeContent(e.target.value)}} value={content} />
                    <br />
                    <br />
                    <Button type="secondary" onClick={onEditCancel}>Cancel</Button>
                    
                    <Button className="ms-2" type="primary" onClick={onSaveEdit}>Done</Button>
                </div>
            }
        </div>
    )
}
