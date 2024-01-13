import React, { useCallback } from "react";
// import styled from "styled-components";
import EmojiPicker from "emoji-picker-react";

import { postMessage } from "hashnet-client";

import useAppState from "store/use-app-state";

import TopContainer from "widget/forms/top-container";
import Header from "widget/forms/header";
import CloseButton from "./close-button";

export default ({
  relatedTo,
  onClose,
}) => {
  const [
    addMessages,
  ] = useAppState([
    "addMessages",
  ]);

  const reactionHandler = useCallback((emojiData) => {
    postMessage(`${emojiData.emoji}`, `/reaction/${emojiData.emoji}`, "1", relatedTo)
      .then((publishedMessage) => {
        addMessages([[publishedMessage]]);
        onClose();
      });
  }, [relatedTo, addMessages, onClose]);

  return (
    <TopContainer>
      <Header>
        React:
        <CloseButton onClick={onClose} />
      </Header>
      <EmojiPicker onEmojiClick={reactionHandler} />
    </TopContainer>
  );
};
