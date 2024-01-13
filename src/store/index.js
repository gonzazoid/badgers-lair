import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { slices, reducers } from "./keys";

const initialState = {};

const reducer = (state, action) => {
  if (typeof state === "undefined") {
    return initialState;
  }
  return action.type in reducers ? reducers[action.type](state, action) : state;
};

const getSetters = store => slices.map(getSlice => getSlice(store)).reduce((slice, key) => ({ ...slice, ...key }), {});

const store = createStore(reducer, applyMiddleware(thunk));

const setters = getSetters(store);
setters.setAll(setters);

export default store;
