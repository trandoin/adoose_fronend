import React, { useEffect } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Navbar from "../Navbar/Navbar";
import * as NotificationApi from "../../api/NotificationApi";
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(user, amount) {
  return { user, amount};
}



export default function CustomizedTables() {

    const [orders,setorders] = React.useState([]);
    const [rows,setrows] = React.useState([]);
    const [notifications,setnotifications] = React.useState([]);
    const [unread,setunread] = React.useState([])

    useEffect(() => {
        async function fetchData() {
            const req = {
                Username: localStorage.getItem("Username")
            }
            const res = await axios.post("http://localhost:5000/orders/GetOrders",req)
            const Notifications = await NotificationApi.getAllNotification({
                Username: localStorage.getItem("Username")
              });
              if(Notifications.data.Notifications) {
              setnotifications(Notifications.data.Notifications.data);
              setunread(Notifications.data.Notifications.Unread);
              }
            setorders(res.data)
            const temp_rows = [];
            for(let ele of res.data) {
                temp_rows.push(createData(ele.Username2,ele.NetAmount))
            }
            setrows(temp_rows)
        }
       fetchData()
    }, [])

  return (
      <div>
           <div>
              <Navbar
                Username={localStorage.getItem("Username")}
                Notifications={notifications}
                Unread={unread}
              />
            </div>
     
      <div style={{width: '800px',marginLeft: '300px',marginTop: '80px'}}>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell style={{fontSize: '16px',fontFamily:"'Baloo Bhai 2', 'cursive'"}}>Service User</StyledTableCell>
            <StyledTableCell align="right" style={{fontSize: '16px',fontFamily:"'Baloo Bhai 2', 'cursive'"}}>Net Amount&nbsp;(Rs)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.user}>
              <StyledTableCell component="th" scope="row" style={{fontSize: '16px',fontFamily:"'Baloo Bhai 2', 'cursive'"}}>
                {row.user}
              </StyledTableCell>
              <StyledTableCell align="right" style={{fontSize: '16px',fontFamily:"'Baloo Bhai 2', 'cursive'"}}>{row.amount}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div> </div>
  );
}