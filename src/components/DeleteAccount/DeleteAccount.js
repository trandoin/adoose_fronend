import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteAccount() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    const req = {
      Username: localStorage.getItem("Username")
    }
    axios.post('http://localhost:5000/profile/delete',req)
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div>
      <Button variant="contained" style={{fontSize: '16px',fontFamily:"'Baloo Bhai 2', 'cursive'"}} onClick={handleClickOpen}>Delete Account</Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Are you sure you want to delete the Account"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleClose}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}