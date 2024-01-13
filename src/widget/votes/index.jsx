import React, { useCallback } from "react";
import styled from "styled-components";

import { postMessage } from "hashnet-client";

import useAppState from "store/use-app-state";
import selectByLabel from "utils/select-by-label";
import humanReadable from "utils/human-readable-count";

import UpVoteArrowIcon from "./up-vote";
import DownVoteArrowIcon from "./down-vote";

const VotesContainer = styled.div`
  flex-wrap: wrap;
  display: inline-flex;
  flex-direction: row;
  align-content: center;
`;

const VoteButton = styled.button`
  &:hover {
    color: #39728e;
  }
  color: #bbcdd6;
  background: none;
  border: 0;
  box-shadow: none;
  margin: 0px;
  padding: 0px;
`;

const VotesCount = styled.span`
  color: ${props => (props.votes < 0 ? "#d04e4e" : (props.votes > 0 ? "#7aa600" : "#929ca5"))};
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.375rem;
  display: flex;
  align-self: flex-end;
`;

const Votes = ({ relatedTo }) => {
  const [
    messages,
    addMessages,
  ] = useAppState([
    "messages",
    "addMessages",
  ]);

  const upVotes = messages[relatedTo] ? selectByLabel(messages[relatedTo], label => label === "/reaction/+1") : [];
  const downVotes = messages[relatedTo] ? selectByLabel(messages[relatedTo], label => label === "/reaction/-1") : [];
  const upVoted = upVotes.some(message => message[0].editable);
  const downVoted = downVotes.some(message => message[0].editable);

  const upVoteHandler = useCallback(() => {
    postMessage("+1", "/reaction/+1", "1", relatedTo)
      .then((publishedMessage) => {
        addMessages([[publishedMessage]]);
      });
  }, [relatedTo, addMessages]);

  const downVoteHandler = useCallback(() => {
    postMessage("-1", "/reaction/-1", "1", relatedTo)
      .then((publishedMessage) => {
        addMessages([[publishedMessage]]);
      });
  }, [relatedTo, addMessages]);

  const votesCount = upVotes.length - downVotes.length;
  const sign = votesCount > 0 ? "+" : (votesCount < 0 ? "-" : "");

  return (
    <VotesContainer>
      {upVoted ? <UpVoteArrowIcon style={{ fill: "#7aa600" }} /> : (
        <VoteButton type="button" onClick={upVoteHandler}>
          <UpVoteArrowIcon style={{ fill: "currentColor" }} />
        </VoteButton>
      )}
      <VotesCount votes={votesCount}>{sign}{humanReadable(votesCount)}</VotesCount>
      {downVoted ? <DownVoteArrowIcon style={{ fill: "#d04e4e" }} /> : (
        <VoteButton type="button" onClick={downVoteHandler}>
          <DownVoteArrowIcon style={{ fill: "currentColor" }} />
        </VoteButton>
      )}
    </VotesContainer>
  );
};

export default Votes;
