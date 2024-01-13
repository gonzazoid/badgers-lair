import React, { useState, useCallback } from "react";
import styled from "styled-components";

import { postMessage } from "hashnet-client";

import useAppState from "store/use-app-state";

import Nickname from "../nickname";

import TopContainer from "./top-container";
import Header from "./header";
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

const SendButton = styled.button`
  background-color: transparent;
  color: #6f7577;
  border: 1px solid rgba(146,156,165,.4);
  border-radius: 3px;
  cursor: pointer;
  font-size: .75rem;
  height: 32px;
  padding: 0 12px;
  line-height: 1.15;
  margin-top: 4px;
`;

export default ({
  label,
  nonce,
  relatedTo,
  onClose,
  publicId,
}) => {
  const [
    addHash,
    addMessages,
  ] = useAppState([
    "addHash",
    "addMessages",
  ]);
  const [comment, setComment] = useState("");
  const onChangeComment = useCallback(e => setComment(e.target.value), []);
  const submitComment = useCallback(() => {
    postMessage(comment, label, nonce, relatedTo)
      .then((message) => {
        setComment("");
        addHash(message.hash, comment);
        addMessages([[message]]);
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

  const root = relatedTo === window.location.href;

  return (
    <TopContainer root={`${root}`}>
      <Header>
        {root ? "Comment" : <>Reply to <Nickname publicId={publicId} /></> }
        { root ? null : <CloseButton onClick={onClose} /> }
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
