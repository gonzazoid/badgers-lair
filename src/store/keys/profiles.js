const insertProfile = (newProfile, profiles) => {
  const { publicKey } = newProfile[0];
  return { ...profiles, [publicKey]: newProfile };
};

/* REDUX */
const actionsTypes = {
  ADD_PROFILE: "ADD_PROFILE",
};

const actions = {
  addProfile: profile => ({ type: actionsTypes.ADD_PROFILE, value: profile }),
};

const reducers = {
  [actionsTypes.ADD_PROFILE]: (state, action) => ({ ...state, profiles: insertProfile(action.value, state.profiles) }),
};

const getSlice = store => ({
  profiles: {},
  addProfile: profile => store.dispatch(actions.addProfile(profile)),
  addProfiles: profiles => profiles.forEach(profile => store.dispatch(actions.addProfile(profile))),
});

export default {
  reducers,
  getSlice,
};
