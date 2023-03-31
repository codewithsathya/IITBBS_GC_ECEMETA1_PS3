import * as api from "../api";
import { authActions } from "../store/auth";

export const googleLogin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.googleLogin(formData);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
