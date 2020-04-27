import _join from "lodash/join";
import {
  FORM_ACTION_EVENT_EMITTED,
  PUBLISH_SUCCESS,
  SAVE_SUCCESS,
} from "../types";

export const setFormErrorsFromResponse = (response, formik) => {
  return async (dispatch, getState, config) => {
    const errorHandler = config.apiErrorHandler;
    const extractedErrors = errorHandler.extractErrors(response);
    dispatch({
      type: "FORM_ACTION_FAILED",
    });
    formik.setSubmitting(false);
    formik.setErrors(extractedErrors);
  };
};

export const publish = (record, formik) => {
  return async (dispatch, getState, config) => {
    const controller = config.apiController;

    try {
      const response = await controller.publish(record);
      dispatch({
        type: PUBLISH_SUCCESS,
        payload: response,
      });
      formik.setSubmitting(false);
    } catch (error) {
      dispatch(setFormErrorsFromResponse(error, formik));
    }
  };
};

export const save = (record, formik) => {
  return async (dispatch, getState, config) => {
    const controller = config.apiController;
    try {
      const response = await controller.save(record);
      dispatch({
        type: SAVE_SUCCESS,
        payload: response,
      });
      formik.setSubmitting(false);
    } catch (error) {
      console.log("error");
      dispatch(setFormErrorsFromResponse(error, formik));
    }
  };
};

export const submitAction = (action, event, formik) => {
  return async (dispatch, getState, config) => {
    console.log(`onSubmit - ${action}`);
    dispatch({
      type: FORM_ACTION_EVENT_EMITTED,
      payload: action,
    });
    formik.handleSubmit(event);
  };
};

export const submitFormData = (record, formik) => {
  return async (dispatch, getState, config) => {
    const formAction = getState().deposit.formAction;
    switch (formAction) {
      case "save":
        dispatch(save(record, formik));
        break;
      case "publish":
        dispatch(publish(record, formik));
        break;
      default:
        console.log("onSubmit triggered some other way");
    }
  };
};
