/* REDUX */
const actionsTypes = {
  SET_ALL: "SET_ALL",
};

const actions = {
  setAll: all => ({ type: actionsTypes.SET_ALL, value: all }),
};

const reducers = {
  [actionsTypes.SET_ALL]: (state, action) => ({ ...state, ...action.value }),
};

const getSlice = store => ({
  setAll: setters => store.dispatch(actions.setAll(setters)),
});

export default {
  reducers,
  getSlice,
};
