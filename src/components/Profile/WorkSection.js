import React from 'react'

export default function WorkSection(props) {

    const GetLink = () =>{
        let allLink = props.work[2].split(' ').filter(String);
        const res = allLink.map((link,index)=>{
            return (
                <li key={index}><a target="_blank" href={link}>{link}</a></li>
            )
        });
        return <ul>{res}</ul>
    }

    return (
        <div>
            <div><span style={{fontSize:'1.5rem'}}><b>{props.work[0]}</b></span></div>
            <span style={{fontSize:'1.2rem'}}>{props.work[1]}</span>
            <GetLink />
            <div className="d-flex flex-wrap">
                {
                    props.workImage.map((image,index)=><div style={{width:'6rem',height:'6rem', marginRight:'2rem'}} key={index}><img style={{width:'100%',height:'100%'}} src={image} /></div>)
                }
            </div>

        </div>
    )
    
}
