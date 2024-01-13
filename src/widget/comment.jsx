import React, { useState, useCallback, useRef } from "react";
import styled from "styled-components";

import useAppState from "store/use-app-state";
import getProfile from "utils/get-profile";
import by from "utils/by";

/* eslint-disable-next-line import/no-cycle */
import Comments from "./comments";
import Reactions from "./reactions";

import CommentForm from "./forms/comment-form";
import EditForm from "./forms/edit-form";
import ReactionForm from "./forms/reaction-form";

import Avatar from "./avatar";
import Nickname from "./nickname";
import FullProfileTooltip from "./full-profile-tooltip";
import FullProfile from "./full-profile";
import Votes from "./votes";

const Button = styled.button`
  align-items: center;
  background: none;
  border: 0;
  box-shadow: none;
  box-sizing: border-box;
  color: #548eaa;
  cursor: pointer;
  display: inline;
  font-size: .75rem;
  font-weight: 400;
  justify-content: center;
  line-height: 1.375rem;
  padding: 0 10px;
  text-decoration: none;
  user-select: none;
`;

const ContentContainer = styled.div`
  padding-left: 1rem;
  padding-top: .7rem;
  padding-right: 0;
  padding-bottom: 0;
  color: #333;
  font-family: -apple-system,BlinkMacSystemFont,Arial,sans-serif;
  font-size: .9375rem;
  line-height: 1.375rem;
  margin-top: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  word-break: break-word;
`;

const MessageContainer = styled.div`
  display: table;
`;

const CommentBody = styled.div`
  white-space: pre;
`;

const ProfileContainer = styled.div`
  float: left;
  margin-right: 10px;
  margin-bottom: 10px;
`;

const ShortProfile = ({ publicId, onMouseOver }) => {
  const [profiles, hashes] = useAppState(["profiles", "hashes"]);

  const profile = getProfile(publicId, profiles, hashes);
  const avatarUrl = profile && profile.avatar ?
    `hash://${profile.avatar.split(":").join("/")}` :
    "hash://sha256/0091af1a72ac253cc897f62d3b68ca18bcaa70174822851a1599174dbf83cf05";
  return (
    <ProfileContainer onMouseOver={onMouseOver}>
      <div data-tooltip-id="fullProfile">
        <Avatar src={avatarUrl} />
      </div>
    </ProfileContainer>
  );
};

const ButtonsPanel = styled.div`
  display: flex;
  align-items: center;
`;

export default ({ data }) => {
  const tooltipRef = useRef(null);
  const [hashes] = useAppState(["hashes"]);

  const [currentFormVisible, setCurrentFormVisible] = useState("");

  const openCommentForm = useCallback((e) => {
    e.preventDefault();
    setCurrentFormVisible("comment");
  }, []);

  const openEditForm = useCallback((e) => {
    e.preventDefault();
    setCurrentFormVisible("edit");
  }, []);

  const openReactionForm = useCallback((e) => {
    e.preventDefault();
    setCurrentFormVisible("reaction");
  }, []);

  const closeCurrentForm = useCallback(() => setCurrentFormVisible(""), []);

  const lastVersion = data.sort(by("nonce"))[0];
  const {
    hash,
    publicKey,
    label,
    editable,
    nonce,
  } = lastVersion;
  const relatedTo = `signed://${publicKey.split(":").join("/")}${label}`;
  const showTooltip = useCallback(() => {
    const content = <FullProfile publicId={publicKey} />;
    tooltipRef.current?.open({ content });
  }, [tooltipRef, publicKey]);

  if (!hashes[hash]) return null; // TODO let it be spinner

  return (
    <ContentContainer>
      <MessageContainer>
        <Nickname publicId={publicKey} />
        <ShortProfile publicId={publicKey} onMouseOver={showTooltip} />
        <CommentBody>{hashes[hash]}</CommentBody>
      </MessageContainer>
      {
        currentFormVisible === "comment" ? (
          <div>
            <CommentForm
              onClose={closeCurrentForm}
              publicId={publicKey}
              relatedTo={relatedTo}
              nonce="1"
              label={`/comment/${crypto.randomUUID()}`}
            />
          </div>
        ) : null
      }
      { currentFormVisible === "edit" ? (
        <div>
          <EditForm
            message={hashes[hash]}
            onClose={closeCurrentForm}
            relatedTo={lastVersion.relatedTo}
            nonce={`${BigInt(nonce) + 1n}`}
            label={label}
          />
        </div>
      ) : null }
      { currentFormVisible === "reaction" ? (
        <div>
          <ReactionForm
            onClose={closeCurrentForm}
            relatedTo={relatedTo}
          />
        </div>
      ) : null }
      { currentFormVisible === "" ? (
        <ButtonsPanel>
          <Votes relatedTo={relatedTo} />
          <Button type="button" onClick={openCommentForm}>Reply</Button>
          {editable ? <Button type="button" onClick={openEditForm}>Edit</Button> : null}
          <Button type="button" onClick={openReactionForm}>React</Button>
          <Reactions relatedTo={relatedTo} />
        </ButtonsPanel>
      ) : null }
      <Comments relatedTo={relatedTo} />
      <FullProfileTooltip tooltipRef={tooltipRef} />
    </ContentContainer>
  );
};
