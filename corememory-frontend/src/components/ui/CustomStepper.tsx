import { Stepper, Step, StepLabel, StepConnector, styled } from "@mui/material";

const CustomStepConnector = styled(StepConnector)(() => ({
    [`& .MuiStepConnector-line`]: {
        transition: "all 0.3s ease",
        borderColor: "#C6C6C6",
        borderWidth: 3,
    },
    [`&.Mui-active, &.Mui-completed`]: {
        [`& .MuiStepConnector-line`]: {
            borderColor: "#EABD08",
        },
    },
    [`&.MuiStepConnector-alternativeLabel`]: {
        left: "calc(-50% + 12px)",
        right: "calc(50% + 12px)",
    },
}));

const stepLabelStyles = {
    "& .MuiStepIcon-root": {
        color: "#C6C6C7",
    },
    "& .MuiStepIcon-root.Mui-active": {
        color: "#EABD08",
    },
    "& .MuiStepIcon-root.Mui-completed": {
        color: "#EABD08",
    },
};

interface CustomStepperProps {
    steps: string[];
    activeStep: number;
}

const CustomStepper: React.FC<CustomStepperProps> = ({ steps, activeStep }) => {
    return (
        <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={<CustomStepConnector />}
        >
            {steps.map((_, index) => (
                <Step key={index} completed={activeStep > index}>
                    <StepLabel sx={stepLabelStyles} />
                </Step>
            ))}
        </Stepper>
    );
};

export default CustomStepper;
