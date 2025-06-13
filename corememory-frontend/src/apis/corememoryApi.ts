import axios from "axios";
import apiBaseUrl from "../config/apiBaseUrl";

export const getCoreMemory = async (token: string) => {
    try {
        const res = await axios.get(`${apiBaseUrl}/api/user/core-memory`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data;
    } catch (error) {
        console.error("Failed to fetch core memory:", error);
        return false;
    }
};
