import React from "react";
import Header from "../Tokens/Header/Header";
import TopBanner from "../TopBanner/TopBanner";
import Tokens from "./Tokens/Tokens";
import Footer from "../Footer/Footer";

const  Bridgev2 =() => {
    return (
        <React.Fragment>
            <div className="main-wrapper">
                <Header />
                <TopBanner />
                <Tokens />
                <Footer />
            </div>
        </React.Fragment>
    );
}
export default Bridgev2;