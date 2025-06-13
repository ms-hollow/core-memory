import { motion } from "framer-motion";
import "../../styles/main.sass";

const LandingBackground = () => {
    return (
        <div className="background-container">
            <motion.div
                className="animated-background"
                initial={{
                    backgroundPosition: "0% 0%",
                }}
                animate={{
                    backgroundSize: [
                        "115% 115%",
                        "110% 110%",
                        "120% 120%",
                        "140% 140%",
                        "180% 180%",
                        "160% 160%",
                        "130% 130%",
                        "200% 200%",
                        "150% 150%",
                        "115% 115%",
                    ],
                    backgroundPosition: [
                        "30% 30%",
                        "50% 50%",
                        "70% 70%",
                        "40% 80%",
                        "50% 50%",
                        "10% 10%",
                    ],
                    // backgroundPosition: [ "10% 20%", "55% 35%", "80% 65%", "30% 80%", "50% 30%", "70% 10%", "15% 25%", "45% 55%", "10% 10%",],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
            />

            <div className="grainy-overlay" />
            <svg className="svg-filters">
                <filter id="grainy">
                    <feTurbulence
                        type="turbulence"
                        baseFrequency="0.65"
                        numOctaves="3"
                    />
                </filter>
            </svg>
        </div>
    );
};

export default LandingBackground;
