import parseTorrent from "utils/parse-torrent";

const start = async () => {
  const video = document.querySelector("video");
  const torrentSrc = video.getAttribute("torrent-src");
  const torrentBin = await (await fetch(torrentSrc)).arrayBuffer();
  const info = await parseTorrent(new Uint8Array(torrentBin));
  console.log(info);
  const ms = new MediaSource();
  video.src = window.URL.createObjectURL(ms);
  const ctx = {
    currentChunk: 0,
  };

  // supported types:
  // 'video/webm; codecs="opus, vp9"'
  // video/mp4; codecs="avc1.42E01E, mp4a.40.2
  // 'video/mp4; codecs="hvc1.016000"' - not supported
  ms.addEventListener("sourceopen", () => {
    const sourceBuffer = ms.addSourceBuffer("video/webm; codecs=\"opus, vp9\"");
    sourceBuffer.mode = "sequence";
    const addChunk = async () => {
      const oneVideoWebMChunk = await (await fetch(`hash://sha1/${info.pieces[ctx.currentChunk]}`)).arrayBuffer();
      console.log("CHUNK!!!", oneVideoWebMChunk);
      sourceBuffer.appendBuffer(oneVideoWebMChunk);
      ctx.currentChunk++;
    };
    sourceBuffer.onupdateend = () => {
      console.log("SOURCE!!!", ms, sourceBuffer);
      if (ctx.currentChunk === info.pieces.length) {
        ms.endOfStream();
      } else {
        addChunk();
      }
      // video.play();
    };
    addChunk();
  }, false);
};
console.log("Let's roll!!!");
start();
