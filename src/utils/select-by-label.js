export default (messages, cb) => Object.values(messages).filter(message => cb(message[0].label));
