import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import Grid from "@mui/material/Grid";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { googleLogin } from "../actions/auth";

const GoogleAuth = () => {
  const dispatch = useDispatch();

  const googleSuccess = async (res) => {
    const token = res?.credential;
    const result = await jwt_decode(token);

    try {
      const formData = {
        name: result.name,
        email: result.email,
        profilePic: result.picture,
      };
      dispatch(googleLogin(formData));
    } catch (err) {
      console.log(err);
    }
  };

  const googleFailure = (err) => {
    console.log(err);
    console.log("Error logging in!");
  };

  return (
    <Grid container sx={{ justifyContent: "center", marginTop: "6px" }}>
      <Grid item>
        <GoogleLogin onSuccess={googleSuccess} onError={googleFailure} />
      </Grid>
    </Grid>
  );
};

export default GoogleAuth;
