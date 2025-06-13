import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { isUsernameAndEmailAvailable } from "../../apis/userApis";

const SignupFormUser = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
    });

    const [emailError, setEmailError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [isUsernameValid, setIsUsernameValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const checkIfEmailAvailable = async () => {
            if (!formData.email.includes("@")) {
                setEmailError("Invalid email address");
                setIsEmailValid(false);
                return;
            }

            const response = await isUsernameAndEmailAvailable(
                formData.username,
                formData.email
            );

            if (response && response.status_code !== 201) {
                if (response.emailAvailable === false) {
                    setEmailError(response.message || "Email already exists");
                    setIsEmailValid(false);
                } else {
                    setEmailError(null);
                    setIsEmailValid(true);
                }
            } else {
                setEmailError(null);
                setIsEmailValid(true);
            }
        };

        const checkIfUsernameAvailable = async () => {
            if (formData.username.length < 6) {
                setUsernameError("Username must be at least 6 characters");
                setIsUsernameValid(false);
                return;
            }

            const response = await isUsernameAndEmailAvailable(
                formData.username,
                formData.email
            );

            if (response && response.status_code !== 201) {
                if (response.usernameAvailable === false) {
                    setUsernameError(
                        response.message || "Username is already taken"
                    );
                    setIsUsernameValid(false);
                } else {
                    setUsernameError(null);
                    setIsUsernameValid(true);
                }
            } else {
                setUsernameError(null);
                setIsUsernameValid(true);
            }
        };

        if (formData.username || formData.email) {
            if (formData.username) {
                checkIfUsernameAvailable();
            }

            if (formData.email) {
                checkIfEmailAvailable();
            }
        }
    }, [formData.username, formData.email]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
        if (!passwordRegex.test(formData.password)) {
            alert(
                "Password must be between 8 and 20 characters, with at least one uppercase letter, one lowercase letter, and one number."
            );
            return;
        }
        navigate("/account-setup", { state: { formData } });
    };

    const goToLogin = () => {
        navigate("/login");
    };

    const goToLandingPage = () => {
        navigate("/");
    };

    return (
        <div className="signup-form">
            <div className="signup-form-container">
                <div className="form__icon">
                    <IoMdClose onClick={goToLandingPage} />
                </div>
                <div className="signup-title">Create an Account.</div>
                <div className="signup-subtitle">
                    Please enter your details below.
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="signup-input-wrapper">
                        <label className="signup-form-label" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="someone@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="signup-form-input"
                            required
                        />
                    </div>
                    {emailError && (
                        <span className="form__email-error">{emailError}</span>
                    )}
                    <div className="signup-input-wrapper">
                        <label className="form__form-label" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="signup-form-input"
                            required
                        />
                    </div>
                    {usernameError && (
                        <span className="form__username-error">
                            {usernameError}
                        </span>
                    )}
                    <div className="signup-input-wrapper">
                        <label className="signup-form-label" htmlFor="password">
                            Password
                        </label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="signup-form-input"
                            required
                        />
                        <button
                            type="button"
                            className="eye-icon-wrapper-signup"
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
                    <div className="form__forgot-password"></div>
                    <button
                        type="submit"
                        className="button"
                        disabled={!isUsernameValid && !isEmailValid}
                    >
                        <div className="button__text">Sign In</div>
                    </button>
                </form>
                <div className="form__dont-have-account">
                    Already have an account?{" "}
                    <a
                        className="form__dont-have-account signup-link"
                        onClick={goToLogin}
                    >
                        Log In.
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SignupFormUser;
