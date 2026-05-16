const AVATAR_ROUTE = "/api/profile/avatar";

type UserMetadata = Record<string, unknown> | null | undefined;

const getUploadedAvatarUrl = (metadata: UserMetadata) => {
  const avatarPath =
    typeof metadata?.avatar_path === "string" ? metadata.avatar_path : "";

  if (!avatarPath) {
    return null;
  }

  const version =
    typeof metadata?.avatar_version === "string" ||
    typeof metadata?.avatar_version === "number"
      ? String(metadata.avatar_version)
      : "";

  return version ? `${AVATAR_ROUTE}?v=${encodeURIComponent(version)}` : AVATAR_ROUTE;
};

export const getUserAvatarUrl = (metadata: UserMetadata) => {
  const externalAvatarUrl =
    typeof metadata?.avatar_url === "string" ? metadata.avatar_url.trim() : "";

  return externalAvatarUrl || getUploadedAvatarUrl(metadata) || null;
};

export const getUploadedAvatarPreviewUrl = (version?: string | number | null) => {
  if (version === undefined || version === null || version === "") {
    return AVATAR_ROUTE;
  }

  return `${AVATAR_ROUTE}?v=${encodeURIComponent(String(version))}`;
};
