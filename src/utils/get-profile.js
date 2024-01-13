import by from "utils/by";

const getProfile = (publicId, profiles, hashes) => {
  if (!profiles[publicId]) return undefined;
  const profileDesc = profiles[publicId].sort(by("nonce"))[0];
  if (!hashes[profileDesc.hash]) return undefined;
  const profileBody = hashes[profileDesc.hash];
  try {
    return JSON.parse(profileBody);
  } catch {}
  return undefined;
};

export default getProfile;
