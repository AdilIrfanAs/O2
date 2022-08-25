import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Login, WalletLogin } from "./../../api/Web3.api";

const WalletLoginpage = (props: any) => {
  const [serverMessage, setServerMessage] = useState();

  const [serverLoginMessage, setServerLoginMessage] = useState();
  const [loader, setLoader] = useState(false);
  const [walletKeys, setWalletKeys] = useState(null);
  const [serverLoginError, setServerLoginError] = useState({
    TitleId: "",
    Email: "",
    Username: "",
    Password: "",
  });
  const validationSchema = Yup.object().shape({
    TitleId: Yup.string()
      .required("TitleId is required")
      .matches(
        /^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/,
        "Must Contain One alphabat One Number Character"
      )
      .max(24),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const submit = async (data: any) => {
    setServerLoginError(null);
    setServerLoginMessage(null);
    const email = data.email;
    const titleId = data.TitleId;
    const network = props.network;
    const payload: any = { email, titleId };
    let response;
    setLoader(true);
    response = await Login(data);
    localStorage.setItem("expire", response.data.data.EntityToken.TokenExpiration);
  
    localStorage.setItem(
      "authorization",
      response.data.data.EntityToken.EntityToken
    );

    if (response.status === 200) {
      setLoader(false);
      setServerLoginError(null);
      setServerLoginMessage(null);
      const walletResponse = await WalletLogin(payload);
      if (walletResponse.status) {
        localStorage.setItem("Wallets", JSON.stringify(walletResponse));
        toast.success("Connected");
        setWalletKeys(walletResponse);
        props.modelhandler(false, walletResponse);
      } else {
        toast.error(walletResponse.message);
      }
    } else if (response.error) {
      setLoader(false);
      setServerLoginMessage(response.errorMessage);
    }
    setLoader(false);
    data = null;
  };
  return (
    <div>
      <div className="text-danger">
        <p>{serverLoginError?.TitleId} </p>
        <p>{serverLoginError?.Email} </p>
        <p>{serverLoginError ? serverLoginError?.Password : null} </p>
        <p>{serverLoginMessage ? serverLoginMessage : null}</p>
      </div>

      <Form onSubmit={handleSubmit(submit)}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>TitleId</Form.Label>
          <Form.Control
            name="TitleId"
            type="text"
            {...register("TitleId")}
            className={`form-control ${errors.TitleId ? "is-invalid" : ""}`}
            placeholder="TitleId"
          />
          <div className="invalid-feedback">{errors.TitleId?.message}</div>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            name="email"
            type="email"
            {...register("email")}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="Enter your email"
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            {...register("password")}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="Enter Password"
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </Form.Group>

        <Button variant="success" type="submit" className="mr-3 float-right">
          {loader ? (
            <div className="spinner-border1" role="status">
              <span className="sr-only"></span>
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default WalletLoginpage;
