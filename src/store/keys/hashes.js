/* REDUX */
const actionsTypes = {
  ADD_HASH: "ADD_HASH",
};

const actions = {
  addHash: hash => ({ type: actionsTypes.ADD_HASH, value: hash }),
};

const reducers = {
  [actionsTypes.ADD_HASH]: (state, action) => ({ ...state, hashes: { ...state.hashes, [action.value.hash]: action.value.body } }),
};

const getSlice = store => ({
  hashes: {},
  addHash: (hash, body) => store.dispatch(actions.addHash({ hash, body })),
});

export default {
  reducers,
  getSlice,
};
