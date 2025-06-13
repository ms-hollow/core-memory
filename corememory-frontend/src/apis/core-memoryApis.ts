import axios from "axios";

export const uploadAttachFile = async (data: any, token: string) => {
    try {
        const res = await axios.post("http://localhost:8000/api/user/upload-attachment/file", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error: any) {
        throw error.res?.data || error;
    }
};


export const uploadAttachLink = async (data: any, token: string) => {
    try {
        const res = await axios.post("http://localhost:8000/api/user/upload-attachment/link", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error: any) {
        throw error.res?.data || error;
    }
};


