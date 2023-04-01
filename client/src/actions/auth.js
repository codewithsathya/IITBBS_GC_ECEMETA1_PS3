import * as api from "../api";
import { authActions } from "../store/auth";

export const googleLogin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.googleLogin(formData);
    console.log(data);
    dispatch(authActions.authenticate({ data: data.result }));
    localStorage.setItem("profile", JSON.stringify({ data: data.result }));
  } catch (err) {
    console.log(err);
  }
};

export const logout = () => async (dispatch) => {
  try {
    await api.logout();
    dispatch(authActions.logout());
  } catch (err) {
    console.log(err);
  }
};

export const checkStatus = () => async (dispatch) => {
  try {
    const { data } = await api.checkStatus();
    console.log(data);
  } catch (err) {
    console.log(err);
    dispatch(authActions.logout());
  }
};
