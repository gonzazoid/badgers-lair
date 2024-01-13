import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import selectNewest from "utils/select-newest";

import store from "./store";
import Widget from "./widget";

let fetchingRelatedInProgress;
const related = [];
const alreadyCheckedRelated = [];

let fetchingProfilesInProgress;
const profilesUrls = [];
const alreadyCheckedProfiles = [];

/* eslint-disable no-restricted-syntax, no-await-in-loop */
const getHashes = async (hashes) => {
  for (const hash of hashes) {
    const [hashFunc, hashValue] = hash.split(":");
    const response = await fetch(`hash://${hashFunc}/${hashValue}`);
    const body = await response.text();
    const { addHash } = store.getState();
    addHash(hash, body);
  }
};
/* eslint-enable no-restricted-syntax, no-await-in-loop */

const extractProfiles = (publicKeys) => {
  publicKeys.forEach((key) => {
    const url = `signed://${key.split(":").join("/")}/profile`;
    if (!profilesUrls.includes(url) && !alreadyCheckedProfiles.includes(url)) {
      profilesUrls.push(url);
    }
  });
};

const groupMessages = async messages => Object.values(messages.reduce((acc, message) => {
  const { publicKey, label } = message;
  const groupKey = `${publicKey}${label}`;
  if (!acc[groupKey]) acc[groupKey] = [];
  acc[groupKey].push(message);
  return acc;
}, {}));

const checkoutRelated = (urls) => {
  urls.forEach((url) => {
    if (!related.includes(url) && !alreadyCheckedRelated.includes(url)) {
      related.push(url);
    }
  });
  /* eslint-disable-next-line no-use-before-define */
  startFetching();
};

const fetchingRelated = () => {
  if (fetchingRelatedInProgress) return;
  if (!related.length) return;
  fetchingRelatedInProgress = true;

  const url = related.shift();
  alreadyCheckedRelated.push(url);
  fetch(url)
    .then(response => response.json())
    .then((messages) => {
      extractProfiles(messages.map(message => message.publicKey));
      return messages;
    })
    .then(groupMessages)
    .then((messages) => {
      getHashes(messages.map(message => selectNewest(message).hash));
      checkoutRelated(messages.map(message => `related://${message[0].publicKey.split(":").join("/")}${message[0].label}`));
      const { addMessages } = store.getState();
      addMessages(messages);
      fetchingRelatedInProgress = false;
      setTimeout(fetchingRelated, 10);
    })
    .catch(err => console.log(err));
};

const fetchingProfiles = () => {
  if (fetchingProfilesInProgress) return;
  if (!profilesUrls.length) return;
  fetchingProfilesInProgress = true;

  const url = profilesUrls.shift();
  alreadyCheckedProfiles.push(url);
  fetch(url)
    .then(response => response.json())
    .then(groupMessages)
    .then((profiles) => {
      getHashes(profiles.map(profile => selectNewest(profile).hash));
      const { addProfiles } = store.getState();
      addProfiles(profiles);
      fetchingProfilesInProgress = false;
      setTimeout(fetchingProfiles, 10);
    });
};

const startFetching = () => {
  if (!fetchingRelatedInProgress) {
    setTimeout(fetchingRelated, 10);
  }

  if (!fetchingProfilesInProgress) {
    setTimeout(fetchingProfiles, 10);
  }
};

const url = `related://${window.location.hostname}${window.location.pathname}`;
fetch(url)
  .then(response => response.json())
  .then((messages) => {
    extractProfiles(messages.map(message => message.publicKey));
    return messages;
  })
  .then(groupMessages)
  .then((messages) => {
    getHashes(messages.map(message => selectNewest(message).hash));
    checkoutRelated(messages.map(message => `related://${message[0].publicKey.split(":").join("/")}${message[0].label}`));
    const { addMessages } = store.getState();
    addMessages(messages);
  });

const widgetContainer = document.getElementById("comments");
const root = createRoot(widgetContainer);

root.render(
  <Provider store={store}>
    <Widget />
  </Provider>,
);
