import React from "react";
import logo from '../images/logo.svg';
import "./home.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";


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
                            <div className="col-md-5 pt-5 order-2 order-lg-1 mt-4" >
                                <h1 className="hei1"> Grow Your business with <strong className="brand-name"> Trando</strong>  </h1>
                                <h5 className="my-3 hei2"> We are the team of talented developer making websites</h5>
                                <div className="mt-5">
                                    <a href="#" type="button" class="btn btn-outline-primary " onClick={clicked}> Get Started</a>
                                </div>
                            </div>

                            <div className="col-md-7 order-1 order-lg-2 header-img">
                                <img src={logo} className="image-fluid animated" alt="home img" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;