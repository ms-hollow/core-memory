import axios from "axios";
import apiBaseUrl from "../config/apiBaseUrl";

export const getUserOrders = async (
    token: string,
    page: number,
    limit: number
) => {
    try {
        const res = await axios.get(
            `${apiBaseUrl}/api/user/track-order?page=${page}&limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error("Unexpected error: ", error);
        return false;
    }
};

export const getOrderById = async (id: number, token: string) => {
    try {
        const res = await axios.get(`${apiBaseUrl}/api/user/order/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error: any) {
        throw error.res?.data || error;
    }
};

export const createOrder = async (data: any, token: string) => {
    try {
        const res = await axios.post(
            `${apiBaseUrl}/api/user/create-order`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (error: any) {
        throw error.res?.data || error;
    }
};

export const updateOrder = async (data: any, token: string) => {
    try {
        const res = await axios.put(
            `${apiBaseUrl}/api/user/update-order`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (error: any) {
        throw error.res?.data || error;
    }
};

export const deleteOrderById = async (id: number, token: string) => {
    try {
        const res = await axios.delete(
            `${apiBaseUrl}/api/user/delete-order/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (error: any) {
        throw error.res?.data || error;
    }
};
