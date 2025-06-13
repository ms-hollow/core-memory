import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdKeyboardBackspace } from "react-icons/md";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import LoginRoleForm from "./LogInRoleForm";
import * as userApis from "../../apis/userApis";

const LogInFormUser = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showRoleForm, setShowRoleForm] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);

    const handleClose = () => {
        navigate("/");
    };

    const handleSignUp = () => {
        navigate("/signup");
    };

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await userApis.loginUser(formData);
            if (!response || response.status_code === undefined) {
                toast.error(
                    "Unexpected error occurred, Please try again later."
                );
                return;
            }

            if (response.status_code === 401) {
                setUsernameError("Invalid username, Please try again.");
                setPasswordError(null);
            } else if (response.status_code === 400) {
                setPasswordError("Invalid password, Please try again.");
                setUsernameError(null);
            } else if (response.status_code === 200) {
                toast.success("Logged in successfully!");
                setPasswordError(null);
                setUsernameError(null);
                login(response.token);
                navigate("/dashboard");
            } else {
                toast.error("Error occurred, Please try again later.");
            }
        } catch (error) {
            toast.error("An error occurred, please try again later.");
        }
    };

    return showRoleForm ? (
        <LoginRoleForm />
    ) : (
        <div className="form">
            <div className="form__form-container">
                <div className="form__icon">
                    <MdKeyboardBackspace
                        onClick={() => setShowRoleForm(true)}
                    />
                    <IoMdClose onClick={handleClose} />
                </div>
                <div className="form__title">Welcome Back, User!</div>
                <div className="form__subtitle">
                    Enter your user credentials to proceed.
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form__input-wrapper">
                        <label className="form__form-label" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="form__form-input"
                            required
                        />
                    </div>
                    {usernameError && (
                        <span className="form__username-error">
                            {usernameError}
                        </span>
                    )}
                    <div className="form__input-wrapper">
                        <label className="form__form-label" htmlFor="password">
                            Password
                        </label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form__form-input"
                            required
                        />
                        <button
                            type="button"
                            className="form__eye-icon-wrapper"
                            onClick={togglePasswordVisibility}
                            aria-label={
                                passwordVisible
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {passwordVisible ? (
                                <RiEyeLine />
                            ) : (
                                <RiEyeCloseLine />
                            )}
                        </button>
                    </div>
                    {passwordError && (
                        <span className="form__username-error">
                            {passwordError}
                        </span>
                    )}
                    <div className="form__forgot-password">
                        Forgot Password?
                    </div>
                    <button type="submit" className="button">
                        <div className="button__text">Sign In</div>
                    </button>
                </form>

                <div className="form__dont-have-account" onClick={handleSignUp}>
                    Don't have an account?{" "}
                    <a className="form__dont-have-account signup-link">
                        {" "}
                        Sign Up.
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LogInFormUser;
