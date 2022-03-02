import React from "react";
import VectorImage from "../../images/VecotrImage3.png";
import Secure from "../../images/SecureIcon.png";
import Adoose from "../../images/adoose.png";
import { Input,Button } from "semantic-ui-react";

export default function Support() {
  const [value, setValue] = React.useState("100");

  return (
    <div>
      <div className="mx-auto" style={{ width: "80%" }}>
        <div className={`${window.innerWidth<1000?"d-flex flex-column":"d-flex flex-row justify-content-center"}`}>
          <div
            style={{
              borderRadius: "10px",
              padding: "25px",
              margin: "10px",
              backgroundColor: "white",
            }}
            className="col-lg-7"
          >
            <div className="mx-auto">
              <img
                src={VectorImage}
                alt="Vector image 3"
                style={{ width: "100%" }}
              />
            </div>
            <div>
                <div style={{width:'150px'}}>
                    <img
                        src={Adoose}
                        alt="Adoose Logo"
                        style={{ width: "100%",height:'100%', marginLeft: "-15px" }}
                    />
                </div>
            
              <h3>Some reason to support Adoose</h3>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni impedit odio illum dignissimos delectus ullam accusantium labore, at saepe reiciendis ipsam nam alias et totam. Ex ipsam natus adipisci dolore?</p>
            </div>
          </div>

          {/* <!-- LEFT BOX --> */}
          <div style={{borderRadius: "10px",margin: "10px",backgroundColor: "white",paddingTop:'2rem'}} className="col-lg-5 ">
            <div className="d-flex mx-auto" style={{ width: "230px", marginTop: "10px" }}>
              <img src={Secure} alt="Secure Icon" className="pr-2" style={{ width: "30px", height: "33px" }}/>
              <p className="" style={{marginLeft:'1rem', fontWeight: "650", fontSize: "20px" }}>Secure Transactions</p>
            </div>
            <div
              className="mx-auto"
              style={{
                width: "273px",
                marginTop: "20px",
                marginBottom: "30px",
              }}
            >
              <p style={{marginLeft: "7px",marginTop: "10px",fontWeight: "500",textAlign: "center"}}>Enter Amount below</p>
              <div className="d-flex w-100 flex-wrap justify-content-between">
                <button
                    type="button"
                    onClick={(e) => {setValue("100");}}
                    className="btn btn-outline-info px-2 my-1"
                    style={{width:'30%',boxShadow: "rgb(65, 65, 65) 0px 0px 3px",fontWeight: "bold",border: "white 1px solid"}}>Rs 100</button>
              
                <button
                        type="button"
                        onClick={(e) => {setValue("200");}}
                        className="btn btn-outline-info px-2  my-1"
                        style={{width:'30%',boxShadow: "rgb(65, 65, 65) 0px 0px 3px",fontWeight: "bold",border: "white 1px solid"}}>Rs 200</button>
                
                <button
                        type="button"
                        onClick={(e) => {setValue("500");}}
                        className="btn btn-outline-info px-2  my-1"
                        style={{width:'30%',boxShadow: "rgb(65, 65, 65) 0px 0px 3px",fontWeight: "bold",border: "white 1px solid"}}>Rs 500</button>
                
                <button
                        type="button"
                        onClick={(e) => {setValue("1000");}}
                        className="btn btn-outline-info px-2  my-1"
                        style={{width:'30%',boxShadow: "rgb(65, 65, 65) 0px 0px 3px",fontWeight: "bold",border: "white 1px solid"}}>Rs 1000</button>
                <button
                        type="button"
                        onClick={(e) => {setValue("5000");}}
                        className="btn btn-outline-info px-2  my-1"
                        style={{width:'30%',boxShadow: "rgb(65, 65, 65) 0px 0px 3px",fontWeight: "bold",border: "white 1px solid"}}>Rs 5000</button>
                
                <button
                        type="button"
                        onClick={(e) => {setValue("10000");}}
                        className="btn btn-outline-info px-2  my-1"
                        style={{width:'30%',boxShadow: "rgb(65, 65, 65) 0px 0px 3px",fontWeight: "bold",border: "white 1px solid"}}>Rs 10000</button>
                
                
            </div>
              
              
              <div
                className="mx-auto"
                style={{ marginTop: "20px", width: "258px" }}
              >
                <div className="mb-3">
                  <Input
                    type="number"
                    label="Rs"
                    labelPosition="left"
                    onChange={(e) => {setValue(e.target.value);}}
                    value={value}
                    
                    aria-label="Amount"
                    style={{color: "rgb(0, 204, 255)",fontSize: "larger",fontWeight: "bold",width:'75%'}}
                  />
                </div>
              </div>
            </div>
            <div className="mx-auto mt-3 d-flex" style={parseInt(value)<0?{cursor:'not-allowed'}:{}}>
              <Button disabled={parseInt(value)<=0} color="blue" className="btn btn-primary mx-auto" type="submit" >Support</Button>
            </div>
          </div>
        </div>
        {/* <!-- FOOTER --> */}
        <div className="d-flex justify-content-around">
          {/* <div>
            Is my payment is secured ?
          
          </div>
          <div>
            Are payments taxable ?
          </div> */}
        </div>
      </div>
    </div>
  );
}
