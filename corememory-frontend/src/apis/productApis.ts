import axios from "axios";
import apiBaseUrl from "../config/apiBaseUrl";

export const getProduct = async (token: string) => {
    try {
        const res = await axios.get(`${apiBaseUrl}/api/user/all-product`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Unexpected error: ", error);
        return false;
    }
};
