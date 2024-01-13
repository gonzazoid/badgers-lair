/*
const getHashFunc = (hostname) => {
  const chunks = hostname.split(".");
  if (chunks.length > 2) return undefined;
  return chunks.length === 1 ? hostname : chunks[1];
};

const getAllMessagesByHash = (messages, hash) => {
  const filteredMessages = messages.map((message) => {
    const result = [];
    if (message.hash === hash) {
      result.push(message);
    }
    if (message.relatedMessages) {
      return [...result, ...getAllMessagesByHash(message.relatedMessages, hash)];
    }
    return result;
  });
  return filteredMessages.flat();
};

const updateMessages = (messages, newMessage) => {
  // looks if there is the same message with older nonce
  // if there is - updates the message
  // if not - just adds to the list
  messages.push(newMessage);
};

const insertRelatedToHashMessage = (url, hashFunc, messages, newMessage) => {
  const hashValue = url.pathname.split("/")[0]; // TODO
  const hash = `${hashFunc}:${hashValue}`;
  const filteredMessages = getAllMessagesByHash(messages, hash);
  if (filteredMessages.length === 0) {
    return [...messages, newMessage];
  }
  filteredMessages.forEach((message) => {
    updateMessages(message.relatedMessages, newMessage);
  });
  return [...messages];
};
*/
/* eslint-disable-next-line arrow-body-style */
const insertMessage = (newMessage, messages) => {
  const { relatedTo } = newMessage[0];
  const signedUrl = `${newMessage[0].publicKey}${newMessage[0].label}`;
  if (!messages[relatedTo]) return { ...messages, [relatedTo]: { [signedUrl]: newMessage } };
  if (!messages[relatedTo][signedUrl]) {
    return {
      ...messages,
      [relatedTo]: {
        ...messages[relatedTo],
        [signedUrl]: [...newMessage],
      },
    };
  }

  return {
    ...messages,
    [relatedTo]: {
      ...messages[relatedTo],
      [signedUrl]: [
        ...messages[relatedTo][signedUrl],
        ...newMessage,
      ],
    },
  };
};

/* REDUX */
const actionsTypes = {
  ADD_MESSAGE: "ADD_MESSAGE",
};

const actions = {
  addMessage: message => ({ type: actionsTypes.ADD_MESSAGE, value: message }),
};

const reducers = {
  [actionsTypes.ADD_MESSAGE]: (state, action) => ({ ...state, messages: insertMessage(action.value, state.messages) }),
};

const getSlice = store => ({
  messages: {},
  addMessage: message => store.dispatch(actions.addMessage(message)),
  addMessages: messages => messages.forEach(message => store.dispatch(actions.addMessage(message))),
});

export default {
  reducers,
  getSlice,
};
