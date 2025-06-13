import { useState, useEffect } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { CiCamera } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    editUserProfile,
    getUserProfile,
    uploadProfilePicture,
} from "../../apis/userApis";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getRegions, getCitiesByRegion } from "../../utils/LocationUtil";
import { toast } from "react-toastify";
import apiBaseUrl from "../../config/apiBaseUrl";

const UserEditProfile = () => {
    const { token } = useAuth();
    const [membershipType, setMembershipType] = useState();
    const [image, setImage] = useState<string | File>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [regions, setRegions] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

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

    const userProfile = async () => {
        if (token) {
            try {
                const res = await getUserProfile(token);
                setFormData(res.data);
                setFirstName(res.data.first_name);
                setLastName(res.data.last_name);
                setMembershipType(res.data.membership_type_id);

                //! Temporary, remove if na remove na ang timezone sa birth date
                const birthDate = "2025-04-08T00:00:00.000Z";
                const dateOnly = birthDate.split("T")[0];

                const citiesList = getCitiesByRegion(res.data.region);
                setCities(citiesList);

                const cityAlreadySelected = res.data.city;
                if (cityAlreadySelected) {
                    setFormData((prevData) => ({
                        ...prevData,
                        birth_date: dateOnly,
                        city: cityAlreadySelected,
                    }));
                }

                setImage(res.data.profile_picture);
            } catch (error) {
                toast.error("An error occurred, please try again later.");
            }
        } else {
            toast.error("Token is missing. Please log in again.");
        }
    };

    useEffect(() => {
        userProfile();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { postal_code, contact_number, first_name, last_name, address } =
            formData;

        // Check if required fields are missing
        if (
            !first_name ||
            !last_name ||
            !address ||
            !postal_code ||
            !contact_number
        ) {
            toast.warning("Please fill in all required fields.");
            return;
        }

        if (postal_code && postal_code.length !== 4) {
            toast.warning("Postal code must be exactly 4 digits.");
            return;
        }

        if (token) {
            try {
                const res = await editUserProfile(token, formData);
                console.log(res);
                if (res) {
                    toast.success("Profile Successfully Updated!");
                    userProfile();
                    navigate("/profile");
                } else {
                    toast.error(
                        "Unexpected error occurred, please try again later."
                    );
                }
            } catch (error) {
                console.error("Error while updating profile:", error);
                toast.error("Something went wrong. Please try again later.");
            }
        } else {
            toast.error("Token is missing. Please log in again.");
        }
    };

    useEffect(() => {
        setRegions(getRegions());
    }, []);

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRegion = e.target.value;

        setFormData((prevData) => ({
            ...prevData,
            region: selectedRegion,
            city: prevData.city || "",
        }));

        const citiesList = getCitiesByRegion(selectedRegion);
        setCities(citiesList);
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData((prevData) => ({
            ...prevData,
            city: e.target.value,
        }));
    };

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const allowedTypes = ["image/jpeg", "image/png"];
            if (!allowedTypes.includes(file.type)) {
                alert("Only JPG and PNG files are allowed.");
                return;
            }
            setImage(file);
            handleUpload(file);
        }
    };

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("profile_picture", file);

        if (!file) {
            alert("Please select an image to upload.");
            return;
        }

        if (token) {
            try {
                const res = await uploadProfilePicture(token, formData);
                if (res) {
                    alert("Profile picture uploaded successfully!");
                    userProfile();
                } else {
                    alert("Failed to upload profile picture.");
                }
            } catch (error) {
                console.error("Error while uploading profile picture:", error);
                alert("Something went wrong. Please try again later.");
            }
        }
    };

    const handleProfileBack = () => {
        navigate("/profile");
    };

    return (
        <div className="profile-container">
            <div className="profile-content">
                <div className="edit-profile-header">
                    <IoArrowBackCircleOutline
                        className="profile-back-icon"
                        onClick={handleProfileBack}
                    />
                    <div className="profile-header-text">Edit Profile</div>
                </div>

                <div className="edit-profile-info-container">
                    <div className="edit-profile-imageText-wrapper">
                        <div
                            onClick={() =>
                                document.getElementById("image-upload")?.click()
                            }
                            className="edit-profile-image-wrapper"
                        >
                            <img
                                src={
                                    image instanceof File
                                        ? URL.createObjectURL(image)
                                        : image
                                        ? `${apiBaseUrl}/${image}`
                                        : "/icons/default-avatar.png"
                                }
                                className="edit-profile-image"
                                alt="Profile"
                            />

                            <div className="camera-icon-wrapper">
                                <CiCamera className="camera-icon" />
                            </div>
                        </div>
                        <input
                            type="file"
                            id="image-upload"
                            accept=".jpg,.jpeg,.png"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                        <div className="edit-profile-text-wrapper">
                            <div className="edit-profile-info-name">
                                {firstName} {lastName}
                            </div>
                            <div className="edit-profile-membership-status">
                                {membershipType === 2 ? (
                                    <div className="profile-badge edit-member">
                                        Member
                                    </div>
                                ) : (
                                    <div className="profile-badge edit-regular">
                                        Regular Account
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="profile-solid-line" />

                <form onSubmit={handleSubmit}>
                    <div className="profile-form-name-part">
                        <div className="profile-form-firstName-part">
                            <div className="profile-form-label">First Name</div>
                            <input
                                type="text"
                                name="first_name"
                                id="first-name"
                                className="profile-input"
                                value={formData.first_name}
                                onChange={handleInputChange}
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
                                readOnly
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
                        />
                    </div>

                    <div className="profile-form-cityRegion-part">
                        <div className="profile-form-region-part">
                            <div className="profile-form-label">Region</div>
                            <div className="location-input">
                                <select
                                    name="region"
                                    id="region"
                                    className="location-select"
                                    value={formData.region}
                                    onChange={handleRegionChange}
                                >
                                    <option value="">Select Region</option>
                                    {regions.map((region, index) => (
                                        <option key={index} value={region}>
                                            {region}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="profile-form-city-part">
                            <div className="profile-form-label">City</div>

                            <div className="location-input">
                                <select
                                    name="city"
                                    id="city"
                                    className="location-select"
                                    value={formData.city}
                                    onChange={handleCityChange}
                                >
                                    <option value="">Select City</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                            />
                        </div>
                    </div>
                    <div className="edit-btn-wrapper">
                        <button className="edit-profile-save-changes-btn">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEditProfile;
