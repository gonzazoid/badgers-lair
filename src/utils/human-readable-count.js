export default (_count) => {
  const count = Math.abs(_count);
  const k = 1000;
  const decimals = 2;
  const sizes = ["", "K", "M", "G", "T"];
  const degree = count ? Math.floor(Math.log(count) / Math.log(k)) : 0;
  const i = degree < sizes.length ? degree : sizes.length - 1;
  return `${parseFloat((count / (k ** i)).toFixed(decimals))}${sizes[i]}`;
};
