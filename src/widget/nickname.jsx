import React from "react";
import styled from "styled-components";

import useAppState from "store/use-app-state";
import getProfile from "utils/get-profile";

const NicknameContainer = styled.div`
  color: #708080;
  font-weight: bold;
  font-size: .7125rem;
`;

const Nickname = ({ publicId }) => {
  const [profiles, hashes] = useAppState(["profiles", "hashes"]);

  const profile = getProfile(publicId, profiles, hashes);

  return (
    <NicknameContainer>
      #{profile ? profile.nickname : publicId}:<br />
    </NicknameContainer>
  );
};

export default Nickname;
