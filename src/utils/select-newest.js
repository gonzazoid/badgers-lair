export default messages => messages.reduce((prev, current) => (BigInt(prev.nonce) > BigInt(current.nonce) ? prev : current));
