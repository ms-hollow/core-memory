import { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { RiEyeLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { changePassword } from "../../apis/userApis";
import { toast } from "react-toastify";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

const ChangePassword = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [passwordVisible, setPasswordVisible] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const togglePasswordVisibility = (field: PasswordField) => {
        setPasswordVisible((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (
            !formData.current_password ||
            !formData.new_password ||
            !formData.confirm_password
        ) {
            toast.warning("Please fill in all required fields.");
            return;
        }

        if (!token) {
            toast.error("Token is missing. Please log in again.");
            return;
        }

        try {
            const res = await changePassword(token, formData);

            if (res.message.includes("Current password is incorrect")) {
                toast.error("Current password is incorrect");
            }

            if (
                res.message.includes(
                    "New password cannot be the same as current password"
                )
            ) {
                toast.error(
                    "New password cannot be the same as current password"
                );
            }

            if (
                res.message.includes(
                    "New password and confirm password do not match"
                )
            ) {
                toast.error("New password and confirm password do not match");
            }

            if (res.status_code === 200) {
                toast.success(res.message);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1300);
            }
        } catch (error: any) {
            console.error("Error changing password:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const goToHome = () => {
        navigate("/dashboard");
    };

    return (
        <div className="default-bg">
            <div className="change-password-container">
                <div className="change-password-content">
                    <div className="change-pass-header">
                        <MdArrowBack
                            className="change-pass-icon"
                            onClick={goToHome}
                        />
                        <div className="change-pass-text">Change Password</div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="change-pass-label">
                            Current Password
                        </div>
                        <div className="password-input-container">
                            <input
                                type={
                                    passwordVisible.currentPassword
                                        ? "text"
                                        : "password"
                                }
                                name="current_password"
                                id="current-password"
                                onChange={handleChange}
                                className="change-password-input"
                            />
                            <button
                                type="button"
                                className="toggle-password-visibility"
                                onClick={() =>
                                    togglePasswordVisibility("currentPassword")
                                }
                            >
                                {passwordVisible.currentPassword ? (
                                    <RiEyeLine />
                                ) : (
                                    <RiEyeCloseLine />
                                )}
                            </button>
                        </div>

                        <div className="change-pass-label">New Password</div>
                        <div className="password-input-container">
                            <input
                                type={
                                    passwordVisible.newPassword
                                        ? "text"
                                        : "password"
                                }
                                name="new_password"
                                id="new-password"
                                onChange={handleChange}
                                className="change-password-input"
                            />
                            <button
                                type="button"
                                className="toggle-password-visibility"
                                onClick={() =>
                                    togglePasswordVisibility("newPassword")
                                }
                            >
                                {passwordVisible.newPassword ? (
                                    <RiEyeLine />
                                ) : (
                                    <RiEyeCloseLine />
                                )}
                            </button>
                        </div>

                        <div className="change-pass-label">
                            Confirm New Password
                        </div>
                        <div className="password-input-container">
                            <input
                                type={
                                    passwordVisible.confirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirm_password"
                                id="confirm-new-password"
                                onChange={handleChange}
                                className="change-password-input"
                            />
                            <button
                                type="button"
                                className="toggle-password-visibility"
                                onClick={() =>
                                    togglePasswordVisibility("confirmPassword")
                                }
                            >
                                {passwordVisible.confirmPassword ? (
                                    <RiEyeLine />
                                ) : (
                                    <RiEyeCloseLine />
                                )}
                            </button>
                        </div>
                        <div className="change-password-buttons">
                            <button
                                className="change-password-cancel"
                                onClick={goToHome}
                            >
                                Cancel
                            </button>
                            <button className="change-password-save">
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
