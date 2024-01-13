import setAll from "./set-all";

import messages from "./messages";
import profiles from "./profiles";
import hashes from "./hashes";

const keys = [
  setAll,
  messages,
  profiles,
  hashes,
];

const reducers = (
  keys
    .map(key => key.reducers)
    .filter(keyReducers => !!keyReducers)
    .reduce((acc, keyReducers) => ({ ...acc, ...keyReducers }), {})
);

const slices = (
  keys
    .map(key => key.getSlice)
    .filter(getSlice => !!getSlice)
);

export {
  reducers,
  slices,
};
