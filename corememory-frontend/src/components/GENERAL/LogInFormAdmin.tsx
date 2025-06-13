import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import LoginRoleForm from "./LogInRoleForm";

const LogInFormAdmin = () => {
  const navigate = useNavigate();
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleClose = () => {
    navigate("/");
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
  };

  return showRoleForm ? (
    <LoginRoleForm />
  ) : (
    <div className="form">
      <div className="form__form-container">
        <div className="form__icon">
          <MdKeyboardBackspace onClick={() => setShowRoleForm(true)} />
          <IoMdClose onClick={handleClose} />
        </div>
        <div className="form__title">Welcome Back, Admin!</div>
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
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="form__form-input"
              required
            />
            <label className="form__form-label" htmlFor="password">
              Password
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="form__form-input"
              required
            />
            {passwordVisible ? (
              <RiEyeLine
                className="form__eye-icon-wrapper"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <RiEyeCloseLine
                className="form__eye-icon-wrapper"
                onClick={togglePasswordVisibility}
              />
            )}
          </div>
          <div className="form__forgot-password">Forgot Password?</div>
          <button type="submit" className="button">
            <div className="button__text">Sign In</div>
          </button>
        </form>
        <div className="form__dont-have-account">
          Don't have an account?{" "}
          <a className="form__dont-have-account signup-link"> Sign Up.</a>
        </div>
      </div>
    </div>
  );
};

export default LogInFormAdmin;
