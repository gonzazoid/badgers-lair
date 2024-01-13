import React, { useCallback } from "react";
import styled from "styled-components";

import { postMessage } from "hashnet-client";

import useAppState from "store/use-app-state";
import selectByLabel from "utils/select-by-label";
import humanReadable from "utils/human-readable-count";

const ReactionContainer = styled.span`
  border: 1px solid grey;
  border-radius: 5px;
  font-size: 0.8125rem;
  font-family: monospace;
  color: grey;
  margin: 3px;
  padding: 2px;
  cursor: ${props => (props["data-already-reacted"] ? "default" : "pointer")};
`;

const Reaction = ({ relatedTo, kind }) => {
  const [messages, addMessages] = useAppState(["messages", "addMessages"]);
  const postReaction = useCallback(() => {
    postMessage(`${kind}`, `/reaction/${kind}`, "1", relatedTo)
      .then((publishedMessage) => {
        addMessages([[publishedMessage]]);
      });
  }, [kind, addMessages, relatedTo]);
  const nullReaction = useCallback(() => {}, []);

  if (!messages[relatedTo]) return null;
  const alreadyReacted = Object.values(messages[relatedTo]).some(message => message[0].label === `/reaction/${kind}` && message[0].editable);
  const count = selectByLabel(messages[relatedTo], label => label === `/reaction/${kind}`).length;

  return (
    <ReactionContainer
      onClick={alreadyReacted ? nullReaction : postReaction}
      data-already-reacted={alreadyReacted}
    >
      {kind} {humanReadable(count)}
    </ReactionContainer>
  );
};

export default Reaction;
