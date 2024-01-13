import React from "react";

import useAppState from "store/use-app-state";
import selectByLabel from "utils/select-by-label";

import Reaction from "./reaction";

const onlyUnique = (value, index, array) => array.indexOf(value) === index;

export default ({ relatedTo }) => {
  const [messages] = useAppState(["messages"]);
  if (!messages[relatedTo]) return null;

  const reactions = selectByLabel(messages[relatedTo], label => label.startsWith("/reaction/"));
  const reactionsKinds = (
    reactions
      .map(reaction => reaction[0].label)
      .map(reaction => reaction.substring("/reaction/".length))
      .filter(onlyUnique)
      .filter(reaction => !["+1", "-1"].includes(reaction))
  );

  return (
    <span style={{ marginLeft: "0.5rem; width: 100%" }}>
      {reactionsKinds.map(reactionKind => <Reaction relatedTo={relatedTo} kind={reactionKind} key={`${relatedTo}/${reactionKind}`} />)}
    </span>
  );
};
