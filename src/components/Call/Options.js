import React, { useState, useContext } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import { SocketContext } from '../../SocketContext';

const Sidebar = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);

  return (
    <div>
            {/* <Grid >
              { ? (
                <Button variant="contained" color="secondary" onClick={leaveCall} >
                  Hang Up
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={() => {console.log("Click k baad ye print hoga : ",me); callUser(me)}} >
                  Call
                </Button>
              )}
            </Grid>
        {children}
         */}
    </div>
  );
};

export default Sidebar;