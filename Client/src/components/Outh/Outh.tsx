import { ChangeEvent, useState } from "react";
import { Modal, Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import femaleWarrior from "../../assets/images/female-warrior.jpg";
import mobileFemaleWarrior from "../../assets/images/mobile-female-warrior.jpg";
import logo from "../../assets/images/logo.svg";
import TopGear from "../../assets/images/fram-top-gear.png"
import OuthBg from "../../assets/images/token-trans-bg3.png"
import OuthBg2 from "../../assets/images/outh-bg.png"
import Mobilelogo from "../../assets/images/mobile-logo.svg"
import MobileGear from "../../assets/images/header-right-gear.png"
import CenterGear from "../../assets/images/center-gear-2.png"
import leftGear from "../../assets/images/left-upper-gear.png"
import MobileFormLeftGear from "../../assets/images/mobile-form-left-gear.png"
import MobileFormRightGear from "../../assets/images/mobile-form-right-gear.png"
import leftBgGear from "../../assets/images/left-bg-gear.png"
import rightGear from "../../assets/images/right-bg-gear1.png"
import LeftBottomGear from "../../assets/images/header-bottom-gear.png"
import MenuBottomGear from "../../assets/images/menu-bottom-gear.png"
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SignUp, WalletSignUp } from "../../utils/api/Web3.api";
import { Login, WalletLogin } from "../../utils/api/Web3.api";

interface login {
  Email: string;
  Password: string;
}
interface signUpError {
  TitleId: string;
  Email: string;
  Username: string;
  Password: string;
}

const SignUpModel = (props: any) => {
  let history = useNavigate()
  const [show, setShow] = useState<boolean>(false);
  const [loginform, setloginform] = useState<boolean>(true);
  const loginClose = () => setloginform(false);
  const loginShow = () => setloginform(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [serverLoginMessage, setServerLoginMessage] = useState();
  let emailRegex = /\S+@\S+\.\S+/;
  const [serverMessage, setServerMessage] = useState();
  const [loader, setLoader] = useState<boolean>(false);
  const [walletKeys, setWalletKeys] = useState(null);
  const [hideShowPassword, setHideShowPassword] = useState(false)
  const [hideShowLoginPassword, setHideShowLoginPassword] = useState(false)
  const [serverLogin, setServerLogin] = useState<login>({
    Email: "", Password: "",
  });
  const [loginError, setLoginError] = useState<login>({
    Email: "", Password: "",
  });
  const [serverError, setServerError] = useState<signUpError>({
    TitleId: "", Email: "", Username: "", Password: "",
  });
  const [serverLoginError, setServerLoginError] = useState<login>({
    Email: "", Password: "",
  });

  //signUp Form Validation
  const validationSchema = Yup.object().shape({
    Username: Yup.string().required("Username is required"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    checkbox: Yup.boolean().oneOf(
      [true],
      "You must accept the terms and conditions"
    ),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const signUpSubmit = async (data: any) => {

    const email = data.email;
    const Username = data.Username;
    const titleId = "8f269";
    const password = data.password;
    //play-fab signup payload
    const signupPayload = { email, Username, password, titleId };
    //Project-Seed signup payload
    const payload: any = { email, titleId, username: Username };

    let response;
    setLoader(true);
    //play-fab signup 
    response = await SignUp(signupPayload);

    if (response.status === 200) {

      setLoader(false);
      setServerError(null);
      setServerMessage(null);
      //Project-Seed signup
      const walletResponse = await WalletSignUp(payload);
      if (walletResponse.status) {
        //set the Wallets in localStorage
        localStorage.setItem("Wallets", JSON.stringify(walletResponse));
        setWalletKeys(walletResponse);
        toast.success("Sign up Successfully");
        //set the expire date and time in localStorage
        localStorage.setItem(
          "expire",
          response.data.data.EntityToken.TokenExpiration
        );
        //set the authorization in localStorage
        localStorage.setItem(
          "authorization",
          response.data?.data?.EntityToken?.EntityToken
        );
        //Pass the Sign-up response to header function
        props.OuthHandler(false);
        setShow(false);
        history("/")
        data = null;
      } else {
        toast.error(walletResponse.message);
      }
    } else if (response.error) {
      setLoader(false);
      if (!response.errorDetails) {
        setServerMessage(response.errorMessage);
        setServerError(null);
      } else {
        setServerError({
          ...serverError,
          Email: response.errorDetails?.Email,
          TitleId: response.errorDetails?.TitleId,
          Username: response.errorDetails?.Username,
          Password: response.errorDetails?.Password,
        });
        setServerMessage(null);
      }
    }
    setLoader(false);

    data = null;

  };
  const submitLogin = async (e: any) => {

    let error = false;
    e.preventDefault();
    setServerLoginError(null);
    setServerLoginMessage(null);
    if (!serverLogin.Email && !serverLogin.Password) {
      setLoginError({
        ...loginError,
        Email: "Email  is required",
        Password: "Password  is required",
      });
      error = true;
    } else if (!serverLogin.Password) {
      setLoginError({
        ...loginError,
        Password: "Password  is required",
      });
      error = true;
    } else if (!serverLogin.Email) {
      setLoginError({
        ...loginError,
        Email: "Email  is required",
      });
      error = true;
    }
    else {
      setLoginError({
        ...loginError,
        Email: "",
        Password: "",
      });
      error = false;
    }

    if (!error) {
      const email = serverLogin.Email;
      const titleId = "8f269";
      const password = serverLogin.Password;
      const loginPayload = {
        titleId,
        email,
        password,
      };
      const payload: any = { email, titleId };
      let response;
      setLoader(true);
      
      response = await Login(loginPayload);

      if (response.status === 200) {

        setLoader(false);
        setServerLoginError(null);
        setServerLoginMessage(null);
        const walletResponse = await WalletLogin(payload);
        if (walletResponse.status) {
          localStorage.setItem("expire", response?.data?.data.EntityToken.TokenExpiration);
          localStorage.setItem("authorization", response?.data?.data.EntityToken.EntityToken);
          localStorage.setItem("Wallets", JSON.stringify(walletResponse));
          props.OuthHandler(false);
          setWalletKeys(walletResponse);
          history("/")
        } else {
          let username = email.split("@")[0];
          let signUpPayload: any = {
            username,
            email,
            titleId,
          };
          const walletResponse = await WalletSignUp(signUpPayload);
          if (walletResponse.status) {
            localStorage.setItem("Wallets", JSON.stringify(walletResponse));
            setWalletKeys(walletResponse);
            localStorage.setItem(
              "expire",
              response.data.data.EntityToken.TokenExpiration
            );
            props.OuthHandler(false);
            setShow(false);
            history("/")
          } else {
            toast.error(walletResponse.message);
            setLoader(false);
            setServerLogin({
              ...serverLogin
              , Email: '',
              Password: ''
            })
          }
        }
      } else {
        setLoader(false);
        setServerLoginMessage(response.errorMessage);
        setServerLogin({
          ...serverLogin,
          Email: "",
          Password: "",
        });
      }
      setLoader(false);
      setServerLogin({
        ...serverLogin,
        Email: "",
        Password: "",
      });
    }

  };
  return (
    <div>
      {walletKeys ? (
        walletKeys?.wallet?.sol?.public_key
      ) : (
        <>
          <div className="seed-header position-relative">
            <Navbar expand="lg">
              <Container fluid className="p-0 justify-content-center">
                <Link to="/" className="navbar-brand me-0 d-md-inline-block d-none">
                  <figure className="mb-0">
                    <img src={logo} alt="Site Logo"></img>
                  </figure>
                </Link>
                <Link to="/" className="navbar-brand me-0 d-md-none d-inline-block">
                  <figure className="mb-0">
                    <img src={Mobilelogo} alt="Site Logo"></img>
                  </figure>
                </Link>
              </Container>
              <figure className="left-gear mb-0">
                <img className="img-fluid" src={leftGear} alt="leftGear" />
              </figure>
              <figure className="left-right-gear mb-0">
                <img className="img-fluid" src={leftGear} alt="leftGear" />
              </figure>
              <figure className="center-gear mb-0">
                <img src={CenterGear} alt="molile header gear" />
              </figure>
              <figure className="left-bottom-gear mb-0">
                <img src={LeftBottomGear} alt="Header bottom gear" />
              </figure>
              <figure className="right-bottom-gear mb-0">
                <img src={LeftBottomGear} alt="Header bottom gear" />
              </figure>
            </Navbar>
          </div>
          <div className="login">
            <div className="modal-content">
              <div className="modal-body p-0 fram">
                <div className="p-0 fram-content">
                  <div
                    className={`warrior-img-section ${loginform ? "warrior-img-position" : ""
                      }`}
                  >
                    <div className="warrior-img d-lg-block d-none">
                      <img src={femaleWarrior} alt="warrior img" />
                    </div>
                    <div className="warrior-img d-lg-none">
                      <img src={mobileFemaleWarrior} alt="warrior img" />
                    </div>
                    <strong className="logo">
                      <a href="/" className="d-inline-block">
                        <img src={logo} />
                      </a>
                    </strong>
                    <div
                      className={`login-detail sign-up-content mobile-display ${loginform ? "hidden" : ""
                        }`}
                    >
                      <h3>Welcome back, Avorian!</h3>
                      <p>
                        Already have an Outland Odyssey account?
                        <br />
                        Enter your personal details to Sign in.
                      </p>
                      <button
                        className="bottom-btn login-signup-btn login-btn bg-transparent border-0 token-trans-link text-center position-relative p-0"
                        onClick={loginShow}
                      >
                        <figure className="mb-0">
                          <img className="img-fluid" src={OuthBg} alt="token-bg" />
                        </figure>
                        <span>Sign in</span>
                      </button>
                    </div>
                    <div
                      className={`login-detail login-content mobile-display ${loginform ? "show-content" : "hidden"
                        } `}
                    >
                      <h3>Greetings, fellow heroes!</h3>
                      <p>
                        Don’t have an Outland Odyssey account?
                        <br />
                        Enter your personal details to join us in Avoria.
                      </p>
                      <button
                        className="bottom-btn login-signup-btn signup-btn bg-transparent border-0 token-trans-link text-center position-relative p-0"
                        onClick={loginClose}
                      >
                        <figure className="mb-0">
                          <img className="img-fluid" src={OuthBg} alt="token-bg" />
                        </figure>
                        <span>Sign Up</span>
                      </button>
                    </div>
                  </div>
                  <div
                    className={`form-content sign-up-show ${loginform ? "sign-up-hide" : ""
                      }`}
                  >
                    <div className="header-wrapper">
                      <h4 className="d-lg-block d-none">SIGN UP</h4>
                      <p>Please sign up to continue.</p>
                    </div>
                    <div className="text-danger">
                      <p>{serverError?.TitleId} </p>
                      <p>{serverError?.Username} </p>
                      <p>{serverError?.Email} </p>
                      <p>{serverError?.Password} </p>
                      <p>{serverMessage}</p>
                    </div>
                    <form onSubmit={handleSubmit(signUpSubmit)}>
                      <div className="input-wrapper">
                        <label htmlFor="">E-mail</label>
                        <div className="form-input position-relative">
                          <input
                            name="email"
                            type="email"
                            {...register("email")}
                            className={`form-control ${errors.email ? "is-invalid" : ""
                              }`}
                            placeholder="Input email address"
                          />
                          <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 1.875C19 0.84375 18.145 0 17.1 0H1.9C0.855 0 0 0.84375 0 1.875V13.125C0 14.1562 0.855 15 1.9 15H17.1C18.145 15 19 14.1562 19 13.125V1.875ZM17.1 1.875L9.5 6.5625L1.9 1.875H17.1ZM17.1 13.125H1.9V3.75L9.5 8.4375L17.1 3.75V13.125Z" fill="#E3D99B" />
                          </svg>
                          <div className="invalid-feedback">
                            {errors.email?.message}
                          </div>
                        </div>
                      </div>
                      <div className="input-wrapper">
                        <label htmlFor="">Username</label>
                        <div className="form-input position-relative">
                          <input
                            placeholder="Input Username"
                            name="Username"
                            type="text"
                            {...register("Username")}
                            className={`form-control ${errors.Username ? "is-invalid" : ""
                              }`}
                            autoFocus
                          />
                          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.5 0C4.256 0 0 4.256 0 9.5C0 14.744 4.256 19 9.5 19H14.25V17.1H9.5C5.377 17.1 1.9 13.623 1.9 9.5C1.9 5.377 5.377 1.9 9.5 1.9C13.623 1.9 17.1 5.377 17.1 9.5V10.8585C17.1 11.609 16.4255 12.35 15.675 12.35C14.9245 12.35 14.25 11.609 14.25 10.8585V9.5C14.25 6.878 12.122 4.75 9.5 4.75C6.878 4.75 4.75 6.878 4.75 9.5C4.75 12.122 6.878 14.25 9.5 14.25C10.811 14.25 12.008 13.718 12.863 12.8535C13.4805 13.699 14.5445 14.25 15.675 14.25C17.5465 14.25 19 12.73 19 10.8585V9.5C19 4.256 14.744 0 9.5 0ZM9.5 12.35C7.923 12.35 6.65 11.077 6.65 9.5C6.65 7.923 7.923 6.65 9.5 6.65C11.077 6.65 12.35 7.923 12.35 9.5C12.35 11.077 11.077 12.35 9.5 12.35Z" fill="#E3D99B" />
                          </svg>
                          <div className="invalid-feedback">
                            {errors.Username?.message}
                          </div>
                        </div>
                      </div>
                      <div className="input-wrapper">
                        <label htmlFor="">Password</label>
                        <div className="form-input position-relative">
                          <input
                            name="password"
                            type={hideShowPassword ? "text" : "password"}
                            {...register("password")}
                            className={`form-control ${errors.password ? "is-invalid" : ""
                              }`}
                            placeholder="Input Password"
                          />
                          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 6.66667H13V4.7619C13 2.13333 10.76 0 8 0C5.24 0 3 2.13333 3 4.7619V6.66667H2C0.9 6.66667 0 7.52381 0 8.57143V18.0952C0 19.1429 0.9 20 2 20H14C15.1 20 16 19.1429 16 18.0952V8.57143C16 7.52381 15.1 6.66667 14 6.66667ZM5 4.7619C5 3.18095 6.34 1.90476 8 1.90476C9.66 1.90476 11 3.18095 11 4.7619V6.66667H5V4.7619ZM14 18.0952H2V8.57143H14V18.0952ZM8 15.2381C9.1 15.2381 10 14.381 10 13.3333C10 12.2857 9.1 11.4286 8 11.4286C6.9 11.4286 6 12.2857 6 13.3333C6 14.381 6.9 15.2381 8 15.2381Z" fill="#E3D99B" />
                          </svg>
                          <span role="button" className={hideShowLoginPassword ? "eye-close" : ""}></span>
                          <svg onClick={() => setHideShowPassword(!hideShowPassword)} role="button" className="eye-svg" width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1.86667C13.4455 1.86667 16.5182 3.85467 18.0182 7C16.5182 10.1453 13.4545 12.1333 10 12.1333C6.54545 12.1333 3.48182 10.1453 1.98182 7C3.48182 3.85467 6.55455 1.86667 10 1.86667ZM10 0C5.45455 0 1.57273 2.90267 0 7C1.57273 11.0973 5.45455 14 10 14C14.5455 14 18.4273 11.0973 20 7C18.4273 2.90267 14.5455 0 10 0ZM10 4.66667C11.2545 4.66667 12.2727 5.712 12.2727 7C12.2727 8.288 11.2545 9.33333 10 9.33333C8.74545 9.33333 7.72727 8.288 7.72727 7C7.72727 5.712 8.74545 4.66667 10 4.66667ZM10 2.8C7.74545 2.8 5.90909 4.68533 5.90909 7C5.90909 9.31467 7.74545 11.2 10 11.2C12.2545 11.2 14.0909 9.31467 14.0909 7C14.0909 4.68533 12.2545 2.8 10 2.8Z" fill="#E3D99B" />
                          </svg>
                          <div className="invalid-feedback">
                            {errors.password?.message}
                          </div>
                        </div>
                      </div>
                      <div className="input-wrapper add-margin">
                        <label htmlFor="">Confirm Password</label>
                        <div className="form-input position-relative">
                          <input
                            name="confirmPassword"
                            type="password"
                            {...register("confirmPassword")}
                            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""
                              }`}
                            placeholder="Retype Password"
                          />
                          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 6.66667H13V4.7619C13 2.13333 10.76 0 8 0C5.24 0 3 2.13333 3 4.7619V6.66667H2C0.9 6.66667 0 7.52381 0 8.57143V18.0952C0 19.1429 0.9 20 2 20H14C15.1 20 16 19.1429 16 18.0952V8.57143C16 7.52381 15.1 6.66667 14 6.66667ZM5 4.7619C5 3.18095 6.34 1.90476 8 1.90476C9.66 1.90476 11 3.18095 11 4.7619V6.66667H5V4.7619ZM14 18.0952H2V8.57143H14V18.0952ZM8 15.2381C9.1 15.2381 10 14.381 10 13.3333C10 12.2857 9.1 11.4286 8 11.4286C6.9 11.4286 6 12.2857 6 13.3333C6 14.381 6.9 15.2381 8 15.2381Z" fill="#E3D99B" />
                          </svg>
                          <div className="invalid-feedback">
                            {errors.confirmPassword?.message}
                          </div>
                        </div>
                      </div>
                      <div className="text-center terms-of-use">
                        {/* <input
                          name="checkbox"
                          type="checkbox"
                          {...register("checkbox")}
                          className={`me-1 ${
                            errors.checkbox ? "is-invalid" : ""
                          }`}
                          /> */}
                        <span>By continuing, you agree to our <a className="text-white" href="/">Terms of Use</a></span>
                        <div className="invalid-feedback">
                          {errors.checkbox?.message}
                        </div>
                      </div>
                      <div className="form-btn-wrapper text-center">
                        <button className="form-btn sign-up-btn bg-transparent border-0 token-trans-link text-center position-relative p-0" type="submit">
                          {loader ? (
                            <div className="spinner-border1 " role="status">
                              <span className="sr-only"></span>
                            </div>
                          ) : (
                            // "Sign Up"
                            <>
                              <figure className="mb-0">
                                <img className="img-fluid" src={OuthBg2} alt="Background img" />
                              </figure>
                              <span>Sign Up</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                    <figure className="form-left-gear mb-0 d-lg-none">
                      <img src={MobileFormLeftGear} alt="Form gear" />
                    </figure>
                    <figure className="form-right-gear mb-0 d-lg-none">
                      <img src={MobileFormRightGear} alt="Form gear" />
                    </figure>
                  </div>
                  <div
                    className={`login-detail login-content d-lg-none ${loginform ? "show-content" : "hidden"} `}
                  >
                    <span className="me-lg-1 mobile-sign-font">Don’t have an Outland Odyssey account? </span>
                    <button
                      className="bottom-btn login-signup-btn signup-btn bg-transparent border-0 token-trans-link text-center position-relative p-0"
                      onClick={loginClose}
                    >
                      <span className="position-relative start-0 text-decoration-underline mobile-sign-font"> Sign Up</span>
                    </button>
                  </div>
                  <h2 className={`fram-title d-lg-none ${loginform ? "block" : "hidden"}`}>
                    Sign in
                  </h2>
                  <h2 className={`fram-title d-lg-none ${loginform ? "hidden" : "block"}`}>
                    Sign Up
                  </h2>
                  <div
                    className={`form-content login-hide ${loginform ? "login-show" : ""
                      }`}
                  >
                    <div className="header-wrapper">
                      <h4 className="d-lg-block d-none">Sign in</h4>
                      <p>Please sign in to continue.</p>
                    </div>
                    <div className="text-danger">
                      <p>{serverLoginError?.Email} </p>
                      <p>{serverLoginError ? serverLoginError?.Password : null} </p>
                      <p>{serverLoginMessage ? serverLoginMessage : null}</p>
                    </div>
                    <form action="">
                      <div className="input-wrapper">
                        <label htmlFor="">Email</label>
                        <div className="form-input position-relative">
                          <input
                            placeholder="Input Email Address"
                            type="email"
                            value={serverLogin.Email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              setServerLogin({
                                ...serverLogin,
                                Email: e.target.value,
                              });
                              setLoginError({
                                ...loginError,
                                Email: "",
                              });
                              if (!e.target.value) {
                                setLoginError({
                                  ...loginError,
                                  Email: "Email  is required",
                                });
                              }
                              if (!emailRegex.test(e.target.value)) {
                                setLoginError({
                                  ...loginError,
                                  Email: "Enter the valid email address",
                                  Password: "",
                                });
                              }
                            }}
                          />
                          <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 1.875C19 0.84375 18.145 0 17.1 0H1.9C0.855 0 0 0.84375 0 1.875V13.125C0 14.1562 0.855 15 1.9 15H17.1C18.145 15 19 14.1562 19 13.125V1.875ZM17.1 1.875L9.5 6.5625L1.9 1.875H17.1ZM17.1 13.125H1.9V3.75L9.5 8.4375L17.1 3.75V13.125Z" fill="#E3D99B" />
                          </svg>
                          <div className="error-msg">{loginError.Email}</div>
                        </div>
                      </div>
                      <div className="input-wrapper">
                        <label htmlFor="">Password</label>
                        <div className="form-input position-relative">
                          <input
                            placeholder="Input password"
                            value={serverLogin.Password}
                            type={hideShowLoginPassword ? "text" : "password"}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              setServerLogin({
                                ...serverLogin,
                                Password: e.target.value,
                              });
                              setLoginError({
                                ...loginError,
                                Password: "",
                              });
                              if (!e.target.value) {
                                setLoginError({
                                  ...loginError,
                                  Password: "Password  is required",
                                });
                              } else if (e.target.value.length < 6) {
                                setLoginError({
                                  ...loginError,
                                  Email: "",
                                  Password: "Password must be at least 6 digits",
                                });
                              }
                            }}
                          />
                          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.5 0C4.256 0 0 4.256 0 9.5C0 14.744 4.256 19 9.5 19H14.25V17.1H9.5C5.377 17.1 1.9 13.623 1.9 9.5C1.9 5.377 5.377 1.9 9.5 1.9C13.623 1.9 17.1 5.377 17.1 9.5V10.8585C17.1 11.609 16.4255 12.35 15.675 12.35C14.9245 12.35 14.25 11.609 14.25 10.8585V9.5C14.25 6.878 12.122 4.75 9.5 4.75C6.878 4.75 4.75 6.878 4.75 9.5C4.75 12.122 6.878 14.25 9.5 14.25C10.811 14.25 12.008 13.718 12.863 12.8535C13.4805 13.699 14.5445 14.25 15.675 14.25C17.5465 14.25 19 12.73 19 10.8585V9.5C19 4.256 14.744 0 9.5 0ZM9.5 12.35C7.923 12.35 6.65 11.077 6.65 9.5C6.65 7.923 7.923 6.65 9.5 6.65C11.077 6.65 12.35 7.923 12.35 9.5C12.35 11.077 11.077 12.35 9.5 12.35Z" fill="#E3D99B" />
                          </svg>
                          <span role="button" className={hideShowLoginPassword ? "eye-close" : ""}></span>
                          <svg onClick={() => setHideShowLoginPassword(!hideShowLoginPassword)} role="button" className="eye-svg" width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1.86667C13.4455 1.86667 16.5182 3.85467 18.0182 7C16.5182 10.1453 13.4545 12.1333 10 12.1333C6.54545 12.1333 3.48182 10.1453 1.98182 7C3.48182 3.85467 6.55455 1.86667 10 1.86667ZM10 0C5.45455 0 1.57273 2.90267 0 7C1.57273 11.0973 5.45455 14 10 14C14.5455 14 18.4273 11.0973 20 7C18.4273 2.90267 14.5455 0 10 0ZM10 4.66667C11.2545 4.66667 12.2727 5.712 12.2727 7C12.2727 8.288 11.2545 9.33333 10 9.33333C8.74545 9.33333 7.72727 8.288 7.72727 7C7.72727 5.712 8.74545 4.66667 10 4.66667ZM10 2.8C7.74545 2.8 5.90909 4.68533 5.90909 7C5.90909 9.31467 7.74545 11.2 10 11.2C12.2545 11.2 14.0909 9.31467 14.0909 7C14.0909 4.68533 12.2545 2.8 10 2.8Z" fill="#E3D99B" />
                          </svg>
                          <div className="error-msg">{loginError.Password}</div>
                        </div>
                      </div>
                      <div className="input-wrapper confirm-hidden">
                        <label htmlFor="">Username</label>
                        <div className="form-input position-relative">
                          <input type="text" value={null} readOnly />
                        </div>
                      </div>
                      <div className="input-wrapper confirm-hidden add-margin">
                        <label htmlFor="">Confirm Password</label>
                        <div className="form-input position-relative">
                          <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="text-center terms-of-use">
                        <span>Forgot password?</span>
                      </div>
                      <div className="form-btn-wrapper text-center">
                        <button className="form-btn bg-transparent border-0 token-trans-link text-center position-relative p-0" onClick={submitLogin}>
                          {loader ? (
                            <div className="spinner-border1" role="status">
                              <span className="sr-only"></span>
                            </div>
                          ) : (
                            <>
                              <figure className="mb-0">
                                <img className="img-fluid" src={OuthBg2} alt="Background img" />
                              </figure>
                              <span>Sign In</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                    <figure className="form-left-gear mb-0 d-lg-none">
                      <img src={MobileFormLeftGear} alt="Form gear" />
                    </figure>
                    <figure className="form-right-gear mb-0 d-lg-none">
                      <img src={MobileFormRightGear} alt="Form gear" />
                    </figure>
                  </div>
                  <div
                    className={`login-detail sign-up-content d-lg-none ${loginform ? "hidden" : ""}`}
                  >
                    <span className="me-lg-1 mobile-sign-font">Already have an Outland Odyssey account? </span>
                    <button
                      className="bottom-btn login-signup-btn login-btn bg-transparent border-0 token-trans-link text-center position-relative p-0"
                      onClick={loginShow}
                    >
                      <span className="position-relative start-0 text-decoration-underline mobile-sign-font">Sign in</span>
                    </button>
                  </div>
                  <div
                    className={`warrior-img-section login-position ${loginform ? "warrior-img-position" : ""
                      }`}
                  >
                    <strong className="logo hidden">
                      <a href="/" className="d-inline-block">
                        <img src={logo} />
                      </a>
                    </strong>
                  </div>
                </div>
                <figure className="mb-0 fram-top-gear">
                  <img src={TopGear} alt="Gear img" />
                </figure>
              </div>
            </div>
          </div>
        </>
      )
      }
    </div >
  );
};
export default SignUpModel;
