import React from 'react'

export default function WorkSection(props) {

    console.log("props",props);
    const GetLink = () =>{
       
        if(props.work >2 ){
            let allLink = props?.work[2].split(' ').filter(String);
            let res = allLink.map((link,index)=>{
                return (
                    <li key={index}><a target="_blank" href={link}>{link}</a></li>
                )
            });
            return <ul>{res}</ul>
        }else{
            return '' ;
        }
     
     
    }

    return (
        <div>
        {!props.work || props.work.length === 0 ? (
          <span style={{ fontWeight: "500", fontSize: "1.1rem" }}>
            No Records Found
          </span>
        ) : (
            <div>
            <div><span style={{fontSize:'1.5rem'}}><b>{props?.work[0]}</b></span></div>
            <span style={{fontSize:'1.2rem'}}>{props?.work[1]}</span>
            <GetLink />
            <div className="d-flex flex-wrap">
                {
                    props?.workImage.map((image,index)=><div style={{width:'6rem',height:'6rem', marginRight:'2rem'}} key={index}><img style={{width:'100%',height:'100%'}} src={image} /></div>)
                }
            </div>

        </div>
        )}
       
      </div>
       
    )
    
}
