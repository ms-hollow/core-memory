import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import LogoutModal from "../GENERAL/LogOutModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../apis/userApis";

const UserHeader = () => {
    const { token } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [membershipType, setMembershipType] = useState();
    const [image, setImage] = useState<string | File>("");
    const [userInfo, setUserInfo] = useState<{
        first_name?: string;
        last_name?: string;
    }>({});

    useEffect(() => {
        const userProfile = async () => {
            if (token) {
                try {
                    const res = await getUserProfile(token);
                    setUserInfo(res.data);
                    setMembershipType(res.data.membership_type_id);
                    setImage(res.data.profile_picture);
                } catch (error) {
                    alert("An error occurred, please try again later.");
                }
            } else {
                alert("Token is missing. Please log in again.");
            }
        };
        userProfile();
    }, [token]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleLogoutModal = () => {
        setShowLogoutModal(!showLogoutModal);
    };

    const goToProfile = () => {
        navigate("/profile");
    };

    const goToChangePassword = () => {
        navigate("/change-password");
    };

    return (
        <nav className="navbar">
            <div className="navbar__logo">
                <a href="/" className="navbar__brand">
                    <span className="bold">CORE MEMORY</span>
                </a>
            </div>

            <ul className="navbar__menu">
                <li className="navbar__item">
                    <Link
                        to="/dashboard"
                        className={
                            location.pathname === "/dashboard" ? "active" : ""
                        }
                    >
                        Dashboard
                    </Link>
                </li>
                <li className="navbar__item">
                    <Link
                        to="/memory-lane"
                        className={
                            location.pathname === "/memory-lane" ? "active" : ""
                        }
                    >
                        Memory Lane
                    </Link>
                </li>
                <li className="navbar__item">
                    <Link
                        to="/order"
                        className={
                            location.pathname === "/order" ? "active" : ""
                        }
                    >
                        Track Your Order
                    </Link>
                </li>
            </ul>

            <div className="navbar__profile">
                <FaUser onClick={toggleDropdown} />
                <CartIcon cartCount={0} />
            </div>

            {dropdownOpen && (
                <div className="dropdown-container">
                    <div className="profile-item">
                        <img
                            src={
                                image instanceof File
                                    ? URL.createObjectURL(image)
                                    : image
                                    ? `http://localhost:8000/${image}`
                                    : "/icons/default-avatar.png"
                            }
                            className="dp-avatar"
                            alt="Profile"
                        />
                        <div
                            className="name-status-holder"
                            onClick={goToProfile}
                        >
                            <div className="profile-name">
                                {userInfo.first_name} {userInfo.last_name}
                            </div>
                            <div className="membership-status-holder">
                                <div className="membership-status">
                                    {membershipType === 2 ? (
                                        <div className="profile-badge member">
                                            Member
                                        </div>
                                    ) : (
                                        <div className="profile-badge regular">
                                            Regular Account
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="profile-arrow-icon">
                            <MdKeyboardArrowRight />
                        </div>
                    </div>
                    <div className="divider" />
                    <div className="menu-item" onClick={goToChangePassword}>
                        <div className="icon">
                            <img
                                src="/icons/reset-password-icon.svg"
                                alt="Profile"
                                className="dp-change-pass"
                            />
                        </div>
                        <div className="label">Change Password</div>
                    </div>
                    <div className="divider" />
                    <div className="menu-item" onClick={toggleLogoutModal}>
                        <div className="dp-logout-icon">
                            <FiLogOut />
                        </div>
                        <div className="label">Logout</div>
                    </div>
                </div>
            )}

            {showLogoutModal && <LogoutModal onClose={toggleLogoutModal} />}
        </nav>
    );
};

export default UserHeader;

const CartIcon = ({ cartCount }: { cartCount: number }) => {
    return (
        <div className="cart-icon-wrapper">
            <BsCart3 className="cart-icon" />
            {cartCount > -1 && <span className="cart-badge">{cartCount}</span>}
        </div>
    );
};
