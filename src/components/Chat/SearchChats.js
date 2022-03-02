import React, { useState } from 'react'
import * as api from "../../api/Chats.js";

import { Search, Grid, Label } from 'semantic-ui-react'

const resultRenderer = ({ person }) => (<div className="w-100">
<span style={{width:'10rem'}}>
<Label horizontal>
  {person.split('$')[1]}
</Label>
</span>
<span style={{color:'black'}}>{person.split('$')[0]}</span>
</div>
);

const initialState = {
    loading: false,
    results: [],
    value: '',
  }
  
  function exampleReducer(state, action) {
    switch (action.type) {
      case 'CLEAN_QUERY':
        return initialState
      case 'GET_USERS':
        return {...state,loading:true,value: action.query}
      case 'FINISH_SEARCH':
        return { ...state, loading: false, results: action.results }
      case 'UPDATE_SELECTION':
        return { ...state, value: action.selection }
  
      default:
        throw new Error()
    }
  }

function SearchChats(props) {
  
    const [state, dispatch] = React.useReducer(exampleReducer, initialState)
    const { loading, results,value} = state
        
    const handleSearchChange = React.useCallback(async(e, data) => {

        
        dispatch({ type: 'GET_USERS', query: data.value })

        const People1 = await api.getSearchedUser({text : value,Username:localStorage.getItem("Username")});
        console.log(People1.data.data);
        
        const people = People1.data.data;
        console.log("Got users : ", people);
        
        if (data.value.length === 0) {
            dispatch({ type: 'CLEAN_QUERY' })
            return ;
        }

        let result = [];
        for(let i = 0;i<people.length;i++)
            if(people[i]["Name"] && people[i]["Name"].toUpperCase().includes(data.value.toUpperCase()))      result.push({person:`${people[i]["Name"]}$${people[i]["Username"]}`});
            else if(people[i]["Username"] && people[i]["Username"].toUpperCase().includes(data.value.toUpperCase()))      result.push({person:`${people[i]["Name"]}$${people[i]["Username"]}`});
            else if(people[i]["Email"] && people[i]["Email"].toUpperCase().includes(data.value.toUpperCase()))      result.push({person:`${people[i]["Name"]}$${people[i]["Username"]}`});

        dispatch({type: 'FINISH_SEARCH',results: result})
        console.log("Query End : ", result);
      });

  return (
    <Grid className="w-100 mx-auto">
      <Grid.Column>
        <Search
        className="searchbarForChat"
          loading={loading}
          onSearchChange={handleSearchChange}
          resultRenderer={resultRenderer}
          results={results}
          value={value}
          onResultSelect={(e,{result})=>{
            console.log(result.person.split('$')[1]);
            props.addChatToList(result.person.split('$')[1]);
            dispatch({type:'CLEAN_QUERY'});
          }}
        />
      </Grid.Column>
    </Grid>
  )
}

export default SearchChats;