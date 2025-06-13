import axios from "axios";

export const addToCart = async (data: any, token: string) => {
    try {
        const res = await axios.post("http://localhost:8000/api/user/add-to-cart", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error: any) {
        throw error.res?.data || error;
    }
};
