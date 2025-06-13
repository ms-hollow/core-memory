import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import BackgroundWrapper from "../components/UI/BackgroundWrapper";
import LandingPage from "../pages/GENERAL/LandingPage";
import LogInPage from "../pages/GENERAL/LogInPage";
import SignupPage from "../pages/GENERAL/SignupPage";
import UserChangePassword from "../pages/USERS/UserChangePassword";
import UserDashboard from "../pages/USERS/UserDashboard";
import AdminDashboard from "../pages/ADMIN/AdminDashboard";
import AccountSetupPage from "../pages/GENERAL/AccountSetupPage";
import Verification from "../pages/GENERAL/VerificationPage";
import ForgotPasswordPage from "../pages/GENERAL/ForgotPasswordPage";
import ResetPasswordPage from "../pages/GENERAL/ResetPasswordPage";
import UserTrackOrder from "../pages/USERS/UserTrackOrder";
import UserMemoryLane from "../pages/USERS/UserMemoryLane";
import UserCreateCoreMemory from "../pages/USERS/UserCreateCoreMemory";
import UserOrderPlaced from "../pages/USERS/UserOrderPlaced";
import UserOrderDetails from "../pages/USERS/UserOrderDetails";
import UserCheckout from "../pages/USERS/UserCheckout";
import UserProfile from "../pages/USERS/UserProfile";
import UserEditProfile from "../pages/USERS/userEditProfile";

import ProtectedRoute from "../utils/ProtectedRoutes";
import { AuthProvider } from "../context/AuthContext";

const AppRoutes = () => {
    const location = useLocation();
    const [showCreateModal, setShowCreateModal] = useState(true);

    const showYellowBackground = [
        "/login",
        "/signup",
        "/account-setup",
        "/forgot-password",
        "/reset-password",
        "/verify-account",
    ].includes(location.pathname);

    //* Add USER page here
    const protectedRoutes = [
        { path: "/dashboard", component: <UserDashboard /> },
        { path: "/order", component: <UserTrackOrder /> },
        {
            path: "/create",
            component: (
                <UserCreateCoreMemory
                    isOpen={showCreateModal}
                    setShowModal={setShowCreateModal}
                />
            ),
        },
        { path: "/order-placed", component: <UserOrderPlaced /> },
        { path: "/memory-lane", component: <UserMemoryLane /> },
        { path: "/order-details", component: <UserOrderDetails /> },
        { path: "/change-password", component: <UserChangePassword /> },
        { path: "/profile", component: <UserProfile /> },
        { path: "/edit-profile", component: <UserEditProfile /> },
        { path: "/checkout", component: <UserCheckout /> },
    ];

    //* Add GENERAL page here
    const publicRoutes = [
        { path: "/", component: <LandingPage /> },
        { path: "/login", component: <LogInPage /> },
        { path: "/signup", component: <SignupPage /> },
        { path: "/account-setup", component: <AccountSetupPage /> },
        { path: "/forgot-password", component: <ForgotPasswordPage /> },
        { path: "/verify-account", component: <Verification /> },
        { path: "/reset-password", component: <ResetPasswordPage /> },
    ];

    return (
        <>
            {showYellowBackground && <BackgroundWrapper />}

            <AuthProvider>
                <Routes>
                    {publicRoutes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={route.component}
                        />
                    ))}

                    {protectedRoutes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                <ProtectedRoute>
                                    {route.component}
                                </ProtectedRoute>
                            }
                        />
                    ))}

                    <Route
                        path="/admin-dashboard"
                        element={<AdminDashboard />}
                    />
                </Routes>
            </AuthProvider>
        </>
    );
};

export default AppRoutes;
