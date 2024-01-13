import { publishHashMessage } from "hashnet-client";

const onFileChange = () => {
  const hashElement = document.getElementById("hash");
  hashElement.innerHTML = "";
};

document.getElementById("file").addEventListener("change", onFileChange);

const uploadFile = () => {
  const file = document.getElementById("file").files[0];

  const reader = new FileReader();
  reader.onload = async (e) => {
    const hash = await publishHashMessage(e.target.result);
    const hashElement = document.getElementById("hash");
    hashElement.innerHTML = `hash://${hash.split(":").join("/")}`;
  };
  reader.readAsArrayBuffer(file);
};

document.getElementById("upload").addEventListener("click", uploadFile);
