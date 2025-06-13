import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import LandingBackground from "../../components/ui/LandingBackground";

const LandingPage = () => {
  const navigate = useNavigate();
  const [animateSphere, setAnimateSphere] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("fromPage") === "true") {
      document.body.style.overflow = "hidden";
      setIsReturning(true);
      sessionStorage.removeItem("fromPage");

      setTimeout(() => {
        setIsReturning(false);
        document.body.style.overflow = "";
      }, 1000);
    }
  }, []);

  const handleNavigation = (path: string) => {
    document.body.style.overflow = "hidden";
    setAnimateSphere(true);
    sessionStorage.setItem("fromPage", "true");

    setTimeout(() => {
      navigate(path);
      document.body.style.overflow = "";
    }, 1000);
  };

  return (
    <>
      <header className="landing-header">
        <h1 className="landing-header__title">CORE MEMORY</h1>
        <button
          className="landing-header__button"
          onClick={() => handleNavigation("/login")}
        >
          Log In
        </button>
      </header>

      <p className="tagline">Capture & cherish your most meaningful moments.</p>
      <button
        className="get-started"
        onClick={() => handleNavigation("/signup")}
      >
        Get Started <FaArrowRight />
      </button>

      <motion.div
        className="sphere"
        animate={
          animateSphere
            ? { scale: 10, opacity: 1 }
            : isReturning
            ? { scale: [10, 1], opacity: [1, 1] }
            : {}
        }
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      <LandingBackground />
    </>
  );
};

export default LandingPage;
