import React from "react";
import styled from "styled-components";

import useAppState from "store/use-app-state";
import selectByLabel from "utils/select-by-label";

/* eslint-disable-next-line import/no-cycle */
import Comment from "./comment";

const NoCommentsContainer = styled.div`
  padding: 16px 16px 18px;
  color: #909090;
  font-weight: 400;
  font-size: .9375rem;
  line-height: 1.4375rem;
  letter-spacing: .01313rem;
  text-align: center;
`;

export default ({ relatedTo }) => {
  const [messages] = useAppState(["messages"]);

  const noComments = <NoCommentsContainer>No comments yet...</NoCommentsContainer>;
  const isRoot = relatedTo === window.location.href;

  if (!messages[relatedTo]) return isRoot ? noComments : null;

  const comments = selectByLabel(messages[relatedTo], label => label.startsWith("/comment/"));
  if (isRoot && !comments.length) return noComments;

  return (
    <div style={{ marginLeft: "0.5rem; width: 100%" }}>
      {comments.map(comment => <Comment data={comment} key={`${comment[0].publicKey}${comment[0].label}`} />)}
    </div>
  );
};
