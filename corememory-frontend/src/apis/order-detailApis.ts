import axios from "axios";

export const getOrderDetailById = async (id: number, token: string) => {
    const res = await axios.get(`http://localhost:8000/api/user/order-detail/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};

export const createOrderDetail = async (data: any, token: string) => {
    try {
        const res = await axios.post("http://localhost:8000/api/user/create-order-detail", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error: any) {
        throw error.res?.data || error;
    }
};
