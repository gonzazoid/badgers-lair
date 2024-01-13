import React, { useState, useCallback } from "react";
import styled from "styled-components";

import Comments from "./comments";
import CommentForm from "./forms/comment-form";

const CommentsHeader = styled.h4`
  color: 708080;
  margin: .5rem;
`;

const Terminator = styled.hr`
  width: 40%;
  padding: 0;
  height: 1px;
  border: none;
  border-top: 1px solid #c0d0d0;
`;

const Widget = () => {
  const [uuid, setUuid] = useState(crypto.randomUUID());
  const onClose = useCallback(() => {
    setUuid(crypto.randomUUID());
  }, [setUuid]);

  const relatedTo = window.location.href;

  return (
    <div>
      <Terminator />
      <CommentsHeader>Comments</CommentsHeader>
      <Comments relatedTo={relatedTo} />
      <Terminator />
      <CommentForm relatedTo={relatedTo} nonce="1" label={`/comment/${uuid}`} onClose={onClose} />
    </div>
  );
};

export default Widget;
