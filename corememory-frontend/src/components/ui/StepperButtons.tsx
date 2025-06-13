interface StepperButtonsProps {
    activeStep: number;
    totalSteps: number;
    onCancelBack: () => void;
    onNext: () => void;
}

const StepperButtons: React.FC<StepperButtonsProps> = ({ activeStep, totalSteps, onCancelBack, onNext }) => {
    return (
        <div className="form-buttons">
            <button onClick={onCancelBack} className="cancel-back-button">
                {activeStep === 0 ? "Cancel" : "Back"}
            </button>
            <button onClick={onNext} className="next-button">
                {activeStep === totalSteps - 1 ? "Proceed Payment" : "Next"}
            </button>
        </div>
    );
};

export default StepperButtons;
