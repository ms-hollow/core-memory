import { useAuth } from "../../context/AuthContext";

const LogoutModal = ({ onClose }: { onClose: () => void }) => {
    const { logout } = useAuth();

    const handleLogOut = () => {
        logout();
    };

    return (
        <>
            <div className="logout-modal">
                <div className="logout-container">
                    <div className="logout-icon-holder">
                        <img
                            src="/icons/logout-icon.png"
                            alt="Log Out"
                            className="logout-icon-img"
                        />
                    </div>
                    <div className="logout-text-holder">
                        <div className="logout-text-1">Already Leaving?</div>
                        <div className="logout-text-2">
                            Are you sure you want to logout?
                        </div>
                    </div>
                    <button className="logout-button" onClick={handleLogOut}>
                        Yes, Logout
                    </button>
                    <div className="logout-cancel" onClick={onClose}>
                        No, I’m Staying
                    </div>
                </div>
            </div>
        </>
    );
};

export default LogoutModal;
