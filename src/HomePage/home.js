import React from "react";
import logo from '../images/logo.svg';
import "./home.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import home_logo from '../images/home_page1.png';
const Home = () => {

   const clicked = () =>{
        window.location.href = '/signin'
    }

    return (
        <section id="header" className="">
            <div className="container-fluid color1 hei">
                <div className="row">
                    <div className="col-md-10 m-auto">
                        <div className="row mt-5 d-flex align-items-center  ">
                            <div className="col-md-5 pt-5 order-2 order-lg-1" >
                                <h1 className="hei1"> Get Highly skilled professional for your valuable work </h1>
                                <h5 className="my-3 hei2"> A platform for organisation, freelancers and skilled people who wanted to work and hire professionals for their work.</h5>
                                <div className=" get_start">
                                    <a href="#" type="button" className="btn btn-light " onClick={clicked}> Start Now</a>
                                </div>
                            </div>

                            <div className="col-md-7 order-1 order-lg-2 header-img">
                                {/* <img src={logo} className="image-fluid animated" alt="home img"  /> */}
                                <img src={home_logo} className="image-fluid animated" alt="home img"   />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
           
        </section>
    );
};

export default Home;