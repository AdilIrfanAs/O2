import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SignUp, WalletSignUp } from "../api/Web3.api";

const SignUppage = (props: any) => {
  const [serverMessage, setServerMessage] = useState();
  const [loader, setLoader] = useState(false);
  const [walletKeys, setWalletKeys] = useState(null);
  const [serverError, setServerError] = useState({
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
  const signUpSubmit = async (data: any) => {
    const email = data.email;
    const titleId = data.TitleId;
    const network = props.network;
    const payload: any = { email, titleId, network };
    let response;
    setLoader(true);
    response = await SignUp(data);
    localStorage.setItem("authorization", response.data.data.EntityToken.EntityToken);

    if (response.status === 200) {
      setLoader(false);
      setServerError(null);
      setServerMessage(null);
      const walletResponse = await WalletSignUp(payload);
      if (walletResponse.status) {
        if (network === 1) {
          localStorage.setItem("BSCWalletKeys", JSON.stringify(walletResponse));
          setWalletKeys(walletResponse);
          toast.success("Connected");
          props.modelhandler(false, walletResponse);
        } else {
          localStorage.setItem(
            "SolanaWalletKeys",
            JSON.stringify(walletResponse)
          );
          setWalletKeys(walletResponse);
          toast.success("Connected");
          props.modelhandler(false, walletResponse);
        }
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
  return (
    <div>
      <div className="text-danger">
        <p>{serverError?.TitleId} </p>
        <p>{serverError?.Username} </p>
        <p>{serverError?.Email} </p>
        <p>{serverError?.Password} </p>
        <p>{serverMessage}</p>
      </div>
      <Form onSubmit={handleSubmit(signUpSubmit)}>
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
          <Form.Label>Username</Form.Label>
          <Form.Control
            placeholder="Username"
            name="Username"
            type="text"
            {...register("Username")}
            className={`form-control ${errors.Username ? "is-invalid" : ""}`}
            autoFocus
          />
          <div className="invalid-feedback">{errors.Username?.message}</div>
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
        <Button variant="success" type="submit">
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

export default SignUppage;
