import "../../styles/main.sass";

const BackgroundWrapper = () => {
  return (
    <div className="background-container">
      <div className="yellow-gradient-background"></div>
      <div className="grainy-overlay" />
      <svg className="svg-filters">
        <filter id="grainy">
          <feTurbulence type="turbulence" baseFrequency="0.65" numOctaves="3" />
        </filter>
      </svg>
    </div>
  );
};

export default BackgroundWrapper;
