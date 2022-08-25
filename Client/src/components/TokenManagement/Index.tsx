import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Tokens/Header/Header";
import TokensManage from "./TokenManage";


const TokenManagement = () => {
  return (
    <div className="main-wrapper">
      <Header />
      <TokensManage />
      <Footer />
    </div>
  );
};

export default TokenManagement;
