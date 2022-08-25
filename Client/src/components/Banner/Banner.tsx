// import { useState, useEffect } from "react";
// import { Container, Row, Col } from "react-bootstrap";
// import ProfileImg from "../../assets/images/profile-img.png";
// import BannerBg from "../../assets/images/banner-bg.png";
// import { Wallets } from "../../utils/sharedVariable"
// import "./Banner.css";
// const Banner = (props: any) => {
//   const [wallet, setWallet] = useState(null);
//   const [selectedWallet, setSelectedWallet] = useState(null);
//   const [mail, setMail] = useState(null);
//   const [userName, setUserName] = useState(null);
//   useEffect(() => {
//     setMail(Wallets?.wallet?.email);
//     setUserName(Wallets?.wallet?.username);
//     if (props.SelectedWallet === "Binance") {
//       setWallet(Wallets?.wallet?.bsc.public_key);
//     } else {
//       setWallet(Wallets?.wallet?.sol.public_key);
//     }
//   }, [selectedWallet, props.LoggedIn]);

//   useEffect(() => {
//     setSelectedWallet(props.SelectedWallet);
//   }, [props.SelectedWallet]);
//   useEffect(() => {
//     if (props.LoggedOut) {
//       setWallet(null);
//       setSelectedWallet(null);
//       setMail(null);
//     }
//   }, [props.LoggedOut, props.LoggedIn]);
//   return (
//     <section className="banner">
//       <div className="banner-bg">
//         <img className="img-fluid" src={BannerBg} alt="banner Background" />
//       </div>
//       <Container fluid className="block-container">
//         <Row>
//           <Col lg={12}>
//             <div className="user-profile">
//               <div className="banner-user-img">
//                 <img
//                   className="img-fluid"
//                   src={ProfileImg}
//                   alt="Profile Image"
//                 />
//               </div>
//               <h2>{userName}</h2>
//               <span className=" wallet-address">
//                 {wallet
//                   ? `${wallet.substring(0, 6)}...${wallet.substring(40, 44)}`
//                   : "0x78nd"}
//               </span>
//               <span className="E-mail">{mail ? mail : "@loremIpsum"}</span>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );
// };

// export default Banner;
