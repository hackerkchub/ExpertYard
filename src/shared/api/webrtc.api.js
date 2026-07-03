import api from "./axiosInstance";

/**
 * Get Temporary TURN Credentials
 */

export const getTurnCredentialsApi = async () => {
  const response = await api.get(
    "/webrtc/turn-credentials"
  );

  return response.data;
};