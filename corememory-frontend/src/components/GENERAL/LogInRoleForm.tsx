import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import LogInFormAdmin from "./LogInFormAdmin";
import LogInFormUser from "./LogInFormUser";

const LogInRoleForm = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState<"admin" | "user" | null>(
        null
    );

    if (selectedRole === "admin") return <LogInFormAdmin />;
    if (selectedRole === "user") return <LogInFormUser />;

    const handleClose = () => {
        console.log("Close button clicked!");
        navigate("/", { state: { fromPage: true } });
    };

    const gotToSignup = () => {
        navigate("/signup");
    };

    return (
        <div className="form">
            <div className="form__form-container">
                <div className="form__icon">
                    <IoMdClose onClick={handleClose} />
                </div>
                <div className="role-title-wrapper">
                    <div className="form__title">Sign In</div>
                    <div className="form__subtitle">
                        Choose your account type below.
                    </div>
                </div>
                <div className="form__role-holder">
                    <div
                        className="form__role-holder box"
                        onClick={() => setSelectedRole("admin")}
                    >
                        <div className="form__role-holder role-container">
                            <div className="role-wrapper">
                                <MdOutlineAdminPanelSettings className="form__role-holder role" />
                                <div className="form__role-holder role-label">
                                    Admin
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="form__role-holder box"
                        onClick={() => setSelectedRole("user")}
                    >
                        <div className="form__role-holder role-container">
                            <div className="role-wrapper">
                                <FaRegUserCircle className="form__role-holder role" />
                                <div className="form__role-holder role-label">
                                    User
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form__role-holder role-dont-have-account">
                    Don't have an account?
                    <a className="role-signup-link" onClick={gotToSignup}>
                        Sign Up.
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LogInRoleForm;
