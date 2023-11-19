import { client } from "./client.js";

export const requestRefresh = async function (refreshToken) {
    const { response, data } = await client.post(`/auth/refresh-token`, {
        refreshToken: refreshToken,
    });
    if (response.ok) {
        return data;
    }
};
