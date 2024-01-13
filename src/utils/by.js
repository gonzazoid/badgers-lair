const by = key => (a, b) => {
  const result = BigInt(b[key]) - BigInt(a[key]);
  return result > 0n ? 1 : (result < 0n ? -1 : 0);
};

export default by;
