import { useSelector } from "react-redux";

export default keys => useSelector(state => keys.map(key => state[key]));
