import React from "react";
import styled from "styled-components";

import useAppState from "store/use-app-state";
import getProfile from "utils/get-profile";

import FullNickname from "./full-nickname";

const BigAvatar = styled.img`
  margin: 5px;
  width: 192px;
  height: 192px;
  border-radius: 50%;
`;

const DescriptionContainer = styled.div`
`;

const ProfileBodyContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const UserDescription = ({ publicId }) => {
  const [profiles, hashes] = useAppState(["profiles", "hashes"]);

  const profile = getProfile(publicId, profiles, hashes);
  const description = profile?.description ?? "Anonymous user";
  return <DescriptionContainer>{description}</DescriptionContainer>;
};

const FullProfile = ({ publicId }) => {
  const [profiles, hashes] = useAppState(["profiles", "hashes"]);

  const profile = getProfile(publicId, profiles, hashes);
  const avatarUrl = profile && profile.avatar ?
    `hash://${profile.avatar.split(":").join("/")}` :
    "hash://sha256/0091af1a72ac253cc897f62d3b68ca18bcaa70174822851a1599174dbf83cf05";
  return (
    <>
      <FullNickname publicId={publicId} />
      <ProfileBodyContainer>
        <BigAvatar src={avatarUrl} />
        <UserDescription publicId={publicId} />
      </ProfileBodyContainer>
    </>
  );
};

export default FullProfile;
