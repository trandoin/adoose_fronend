import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import TextField from "@mui/material/TextField";
import "./AccountDetails.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(false);
    const req = {
      acc_no: e.target.acno.value,
      name: e.target.name.value,
      ifsc: e.target.ifsc.value,
    };
    axios.post("http://localhost:5000/account/details", req);
  };

  return (
    <div>
      <Button
        variant="contained"
        style={{ fontSize: "16px", fontFamily: "'Baloo Bhai 2', 'cursive'" }}
        onClick={handleOpen}
      >
        Add a/c
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "16px",
              fontFamily: "'Baloo Bhai 2', 'cursive'",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Please add your Account details
            </Typography>
          </div>
          <form
            style={{ marginTop: "3px" }}
            onSubmit={handleSubmit}
            method="post"
          >
            <label
              for="name"
              style={{
                fontSize: "16px",
                fontFamily: "'Baloo Bhai 2', 'cursive'",
              }}
            >
              <strong>Recipient Name</strong>
            </label>
            <br />
            <input
              type="text"
              id="name"
              name="name"
              className="modal-input-box"
              required
            />
            <br />
            <label
              for="acno"
              style={{
                fontSize: "16px",
                fontFamily: "'Baloo Bhai 2', 'cursive'",
              }}
            >
              <strong>Account Number</strong>
            </label>
            <br />
            <input
              type="text"
              id="acno"
              name="acno"
              className="modal-input-box"
              required
            />
            <br />
            <label
              for="ifsc"
              style={{
                fontSize: "16px",
                fontFamily: "'Baloo Bhai 2', 'cursive'",
              }}
            >
              <strong>IFSC Code</strong>
            </label>
            <br />
            <input
              type="text"
              id="ifsc"
              name="ifsc"
              className="modal-input-box"
              required
            />
            <br /> <br />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "16px",
                fontFamily: "'Baloo Bhai 2', 'cursive'",
              }}
            >
              <Button variant="contained" type="Submit">
                Add Details
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
