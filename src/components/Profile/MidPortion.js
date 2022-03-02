import React from 'react'

function displayList(List){
    const ren = List.map((ll,index)=><pre key={index} className="px-2 mx-2" style={{display:'inline',fontWeight:'600',fontFamily:'unset'}}>   {ll}    </pre>);
    return <span>: {ren}</span>;
}

export default function MidPortion(props) {
    return (
        <div className="mt-3 p-2 d-flex flex-column" style={window.innerWidth<600?{margin:'auto',textAlign:'center'}:{}}>
            <span style={{fontWeight:'600'}}>@{props.Username}</span>
            <div style={{height:'1rem'}} />
            <span style={{color:'green'}}>{props.Name}</span>
            <div style={{height:'1rem'}} />
            <span style={{textAlign:'initial'}}>
                <div style={window.innerWidth<600?{whiteSpace:'nowrap',display:'inline-block'}:{width:'10rem',whiteSpace:'nowrap',display:'inline-block'}}>Gender</div>
                {displayList([props.Gender])}
            </span>
            <span style={{textAlign:'initial'}}>
            <div style={window.innerWidth<600?{whiteSpace:'nowrap',display:'inline-block'}:{width:'10rem',whiteSpace:'nowrap',display:'inline-block'}}>Locations</div>
                {displayList(props.Locations)}</span>
                <span style={{textAlign:'initial'}}>
                <div style={window.innerWidth<600?{whiteSpace:'nowrap',display:'inline-block'}:{width:'10rem',whiteSpace:'nowrap',display:'inline-block'}}>Languages</div>
                {displayList(props.Languages)}</span>
        </div>
    )
}
