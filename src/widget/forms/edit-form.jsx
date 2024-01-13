import React, { useState, useCallback } from "react";
import styled from "styled-components";

import { postMessage } from "hashnet-client";

import useAppState from "store/use-app-state";

import TopContainer from "./top-container";
import Header from "./header";
import SendButton from "./send";
import CloseButton from "./close-button";

const InputForm = styled.textarea`
  &:focus {
    outline: none;
  }
  border: 1px solid rgba(146,156,165,.3);
  margin: .3rem;
  display: block;
  width: 100%;
`;

const ControlPanel = styled.div``;

export default ({
  label,
  nonce,
  relatedTo,
  onClose,
  message,
}) => {
  const [
    addHash,
    addMessages,
  ] = useAppState([
    "addHash",
    "addMessages",
  ]);
  const [comment, setComment] = useState(message);
  const onChangeComment = useCallback(e => setComment(e.target.value), []);
  const submitComment = useCallback(() => {
    postMessage(comment, label, nonce, relatedTo)
      .then((publishedMessage) => {
        setComment("");
        addHash(publishedMessage.hash, comment);
        addMessages([[publishedMessage]]);
        if (onClose) onClose();
      });
  }, [
    comment,
    label,
    nonce,
    relatedTo,
    onClose,
    addHash,
    addMessages,
  ]);

  return (
    <TopContainer>
      <Header>
        Edit:
        <CloseButton onClick={onClose} />
      </Header>
      <InputForm
        rows="8"
        value={comment}
        onChange={onChangeComment}
      />
      <ControlPanel>
        <SendButton type="button" onClick={submitComment}>
          Send
        </SendButton>
      </ControlPanel>
    </TopContainer>
  );
};
