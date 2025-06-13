import { useState, useRef, useEffect } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../apis/userApis";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";

const UserProfile = () => {
    const { token } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [membershipType, setMembershipType] = useState();
    const [image, setImage] = useState<string | File>("");

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        birth_date: "",
        contact_number: "",
        address: "",
        city: "",
        region: "",
        postal_code: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleContactNumChange = (value: string, data: {} | CountryData) => {
        setFormData((prev) => ({
            ...prev,
            contact_number: value,
        }));
    };

    useEffect(() => {
        const userProfile = async () => {
            if (token) {
                try {
                    const res = await getUserProfile(token);
                    setFormData(res.data);
                    setMembershipType(res.data.membership_type_id);

                    //! Temporary, remove if na remove na ang timezone sa birth date
                    const birthDate = "2025-04-08T00:00:00.000Z";
                    const dateOnly = birthDate.split("T")[0];

                    setFormData({
                        ...res.data,
                        birth_date: dateOnly,
                    });

                    setImage(res.data.profile_picture);
                } catch (error) {
                    toast.error("An error occurred, please try again later.");
                }
            } else {
                toast.error("Token is missing. Please log in again.");
            }
        };
        userProfile();
    }, [token]);

    const handleGoBack = () => {
        navigate("/dashboard");
    };

    const handleEditProfile = () => {
        navigate("/edit-profile");
    };

    return (
        <div className="profile-container">
            <div className="profile-content">
                <div className="profile-header">
                    <IoArrowBackCircleOutline
                        className="profile-back-icon"
                        onClick={handleGoBack}
                    />
                    <div className="profile-header-text">Profile Page</div>
                </div>

                {membershipType === 1 && (
                    <div className="profile-banner-container">
                        <div className="profile-banner-contents">
                            <div className="profile-banner-text">
                                Become a member & enjoy exclusive <br />
                                discounts, perks, and rewards!
                            </div>
                            <div className="profile-membership-price">
                                ONLY ₱500.00 ANNUALLY
                            </div>
                            <IoIosArrowForward
                                className="profile-membership-button"
                                onClick={() => setIsModalOpen(true)}
                            />
                        </div>
                    </div>
                )}

                {isModalOpen && (
                    <MembershipModal
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                    />
                )}

                <div className="profile-info-container">
                    <div className="profile-imageText-wrapper">
                        <img
                            src={
                                image instanceof File
                                    ? URL.createObjectURL(image)
                                    : image
                                    ? `http://localhost:8000/${image}`
                                    : "/icons/default-avatar.png"
                            }
                            className="profile-image"
                            alt="Profile"
                        />

                        <div className="profile-text-wrapper">
                            <div className="profile-info-name">
                                {formData.first_name} {formData.last_name}
                            </div>
                            <div className="profile-membership-status">
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
                    <button
                        className="profile-edit-btn"
                        onClick={handleEditProfile}
                    >
                        Edit Button
                    </button>
                </div>

                <hr className="profile-solid-line" />

                <form>
                    <div className="profile-form-name-part">
                        <div className="profile-form-firstName-part">
                            <div className="profile-form-label">First Name</div>
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                className="profile-input"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                disabled
                            />
                        </div>
                        <div className="profile-form-lastName-part">
                            <div className="profile-form-label">Last Name</div>
                            <input
                                type="text"
                                name="last_name"
                                id="last-name"
                                className="profile-input"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                disabled
                            />
                        </div>
                        <div className="profile-form-username-part">
                            <div className="profile-form-label">Username</div>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className="profile-input"
                                value={formData.username}
                                onChange={handleInputChange}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="profile-form-birthdateContact-part">
                        <div className="profile-form-birthdate-part">
                            <div className="profile-form-label">Birthdate</div>
                            <input
                                type="date"
                                name="birth_date"
                                id="birthdate"
                                className="profile-input"
                                value={formData.birth_date}
                                onChange={handleInputChange}
                                disabled
                            />
                        </div>

                        <div className="profile-form-contactNumber-part">
                            <div className="profile-form-label">
                                Contact Number
                            </div>
                            <PhoneInput
                                placeholder="Phone number"
                                country="ph"
                                value={formData.contact_number}
                                onChange={handleContactNumChange}
                                inputProps={{
                                    required: true,
                                }}
                                inputClass="contact-inputField"
                                buttonClass="contact-inputButton"
                                disabled={true}
                            />
                        </div>
                    </div>

                    <div className="profile-form-address-part">
                        <div className="profile-form-label">Address</div>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            className="profile-input"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>

                    <div className="profile-form-cityRegion-part">
                        <div className="profile-form-region-part">
                            <div className="profile-form-label">Region</div>
                            <input
                                type="text"
                                name="region"
                                id="region"
                                className="profile-input"
                                value={formData.region}
                                onChange={handleInputChange}
                                disabled
                            />
                        </div>
                        <div className="profile-form-city-part">
                            <div className="profile-form-label">City</div>
                            <input
                                type="text"
                                name="city"
                                id="city"
                                className="profile-input"
                                value={formData.city}
                                onChange={handleInputChange}
                                disabled
                            />
                        </div>
                        <div className="profile-form-postalCode-part">
                            <div className="profile-form-label">
                                Postal Code
                            </div>
                            <input
                                type="text"
                                name="postal_code"
                                id="postal-code"
                                className="profile-input"
                                value={formData.postal_code}
                                onChange={handleInputChange}
                                disabled
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;

interface MembershipModal {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MembershipModal = ({ isModalOpen, setIsModalOpen }: MembershipModal) => {
    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target as Node)
            ) {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isModalOpen, setIsModalOpen]);

    if (!isModalOpen) return null;

    return (
        <div className="membership-modal-container">
            <div className="membership-modal-wrapper" ref={modalRef}>
                <img
                    src="/images/delivery-truck.svg"
                    alt="delivery"
                    className="membership-delivery-svg"
                />
                <div className="membership-modal-info-wrapper">
                    <div className="membership-modal-text">
                        Enjoy free shipping & faster <br />
                        delivery for just ₱500.00 <br />
                        a year. It’s the membership <br /> perk you don’t want
                        to <br /> miss!
                    </div>
                    <button className="membership-modal-button">
                        Sign up for a membership!
                    </button>
                </div>
            </div>
        </div>
    );
};
