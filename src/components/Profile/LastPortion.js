import React from 'react'
import { Button } from 'semantic-ui-react';

function displayListList(List){
    const ls = List.map((ll,index)=><li key={index}>{ll}</li>)
    return <ul style={{listStyleType:'none',padding:'0'}}>{ls}</ul>;
}

export default function LastPortion(props) {

    

    return (
        <div className="mt-3 p-2 d-flex flex-column" >
            <div>
                <span style={{fontWeight:'600', borderBottom:'1px solid #333', width:'fit-content',padding: '0 2rem 0 0',marginBottom:'1rem'}}>Professions</span>
                {displayListList(props.Professions)}
            </div>

        </div>
    )
}
