import { publishHashMessage, postMessage } from "hashnet-client";

import by from "utils/by";

let imgChanged = false;
let previousVersionOfProfile;

const defaultProfile = {
  nickname: "anonymous",
  description: "anonymous user",
  avatar: "sha256:0091af1a72ac253cc897f62d3b68ca18bcaa70174822851a1599174dbf83cf05",
};

const publicKey = window.getHashNetPublicKey();
fetch(`signed://${publicKey.split(":").join("/")}/profile`)
  .then(response => response.json())
  .then((profileAllVersions) => {
    if (!profileAllVersions.length) return Promise.resolve(undefined);
    const profile = profileAllVersions.sort(by("nonce"))[0];
    document.getElementById("nonce").value = `${BigInt(profile.nonce) + 1n}`;
    return fetch(`hash://${profile.hash.split(":").join("/")}`);
  })
  .then(hashResponse => (hashResponse ? hashResponse.text() : undefined))
  .then((profileBody) => {
    try {
      const profile = profileBody ? JSON.parse(profileBody) : defaultProfile;
      previousVersionOfProfile = profile;
      document.getElementById("nickname").value = profile.nickname;
      document.getElementById("description").value = profile.description || "";
      document.getElementById("avatarImg").setAttribute("src", `hash://${profile.avatar.split(":").join("/")}`);
    } catch {}
  });

const setSuccessStatus = () => {
  const container = document.getElementById("status");
  container.textContent = "profile updated successfully!!!";
  container.classList.remove("changed");
  container.classList.add("saved");
};

const setChangedStatus = () => {
  const container = document.getElementById("status");
  container.textContent = "profile has unsaved changes!!!";
  container.classList.remove("saved");
  container.classList.add("changed");
};

const onImgChange = (event) => {
  const input = event.target;
  const file = input.files[0];
  const dataUrlReader = new FileReader();
  dataUrlReader.onload = (e) => {
    document.getElementById("avatarImg").setAttribute("src", e.target.result);
    imgChanged = true;
    setChangedStatus();
  };
  dataUrlReader.readAsDataURL(file);
};

const onTextChange = () => {
  setChangedStatus();
};

document.getElementById("avatar").addEventListener("change", onImgChange);
document.getElementById("nickname").addEventListener("input", onTextChange);
document.getElementById("description").addEventListener("input", onTextChange);

const publishProfile = () => {
  if (imgChanged) {
    const file = document.getElementById("avatar").files[0];

    const reader = new FileReader();
    reader.onload = async (e) => {
      const hash = await publishHashMessage(e.target.result);
      const nickname = document.getElementById("nickname").value;
      const description = document.getElementById("description").value;
      const nonce = document.getElementById("nonce").value;
      const profile = { nickname, avatar: hash, description };
      postMessage(JSON.stringify(profile), "/profile", nonce)
        .then(setSuccessStatus);
    };
    reader.readAsArrayBuffer(file);
  } else {
    const hash = previousVersionOfProfile.avatar;
    const nickname = document.getElementById("nickname").value;
    const description = document.getElementById("description").value;
    const nonce = document.getElementById("nonce").value;
    const profile = { nickname, avatar: hash, description };
    postMessage(JSON.stringify(profile), "/profile", nonce)
      .then(setSuccessStatus);
  }
  imgChanged = false;
};
document.getElementById("publishProfile").addEventListener("click", publishProfile);
