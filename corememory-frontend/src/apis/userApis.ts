import axios from "axios";
import apiBaseUrl from "../config/apiBaseUrl";

export const registerUser = async (data: any) => {
    try {
        const userData = {
            ...data,
            user_type_id: 1,
            membership_type_id: 1,
        };

        const response = await axios.post(
            `${apiBaseUrl}/api/user/signup`,
            userData,
            { withCredentials: true } // Enable sending and receiving cookies
        );

        return response.data;
    } catch (error) {
        console.error("Error during user registration:", error);
    }
};

export const loginUser = async (data: any) => {
    try {
        const response = await axios.post(
            `${apiBaseUrl}/api/user/login`,
            data,
            { withCredentials: true }
        );

        return response.data;
    } catch (error: any) {
        console.error("Login failed:", error.response?.data || error.message);
    }
};

export const logoutUser = async (token: string) => {
    try {
        const response = await axios.post(
            `${apiBaseUrl}/api/user/logout`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error("Logout failed:", error.response?.data || error.message);
    }
};

export const isUsernameAndEmailAvailable = async (
    username: string,
    email: string
) => {
    try {
        const response = await axios.get(
            `${apiBaseUrl}/api/user/check-availability?email=${email}&username=${username}`
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error(
                "Axios error:",
                error.response?.data || error.message
            );
        } else {
            console.error("Unexpected error:", error);
        }
        return false;
    }
};

export const changePassword = async (token: string, data: any) => {
    try {
        const res = await axios.put(
            `${apiBaseUrl}/api/user/update-password`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return res.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        }
        throw error;
    }
};

export const getUserProfile = async (token: string) => {
    try {
        const response = await fetch(`${apiBaseUrl}/api/user/profile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Fetch error:", errorData);
            return false;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Unexpected error:", error);
        return false;
    }
};

export const editUserProfile = async (token: string, updatedData: any) => {
    try {
        const response = await fetch(`${apiBaseUrl}/api/user/edit-profile`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Fetch error:", errorData);
            return false;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Unexpected error:", error);
        return false;
    }
};

export const uploadProfilePicture = async (
    token: string,
    formData: FormData
) => {
    try {
        const res = await axios.post(
            `${apiBaseUrl}/api/user/upload-profile`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (error: any) {
        if (error.response) {
            console.error(
                "Error uploading profile picture:",
                error.response.data
            );
            return error.response.data;
        } else {
            console.error("Error uploading profile picture:", error.message);
            return false;
        }
    }
};
