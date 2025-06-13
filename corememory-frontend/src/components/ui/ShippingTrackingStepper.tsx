import { Stepper, Step, StepLabel, StepConnector, styled } from "@mui/material";
import { StepIconProps } from "@mui/material/StepIcon";

const CustomStepIcon = (props: StepIconProps) => {
    const { active, completed, className } = props;
    let color = "#A1A1A1";
    if (completed) {
        color = "#95B9B5";
    } else if (active) {
        color = "#1E8B7E";
    }

    return (
        <div
            className={className}
            style={{
                width: 15,
                height: 15,
                borderRadius: "50%",
                backgroundColor: color,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "3px solid transparent",
                zIndex: 1,
            }}
        ></div>
    );
};

const ShippingStepConnector = styled(StepConnector)(() => ({
    [`& .MuiStepConnector-line`]: {
        borderWidth: 3,
    },
    [`&.Mui-active .MuiStepConnector-line`]: {
        borderColor: "#1E8B7E",
    },
    [`&.Mui-completed .MuiStepConnector-line`]: {
        borderColor: "#95B9B5",
    },
    [`&.Mui-disabled .MuiStepConnector-line`]: {
        borderColor: "#A1A1A1",
    },
    [`&.MuiStepConnector-alternativeLabel`]: {
        left: "calc(-50% + 1px)",
        right: "calc(50% + 1px)",
    },
    [`& .MuiStepConnector-lineHorizontal`]: {
        display: "flex",
        justifyContent: "center",
        marginTop: -5,
    },
}));

const getShippingStepColor = (index: number, activeStep: number) => {
    if (index < activeStep) return "#95B9B5";
    if (index === activeStep) return "#1E8B7E";
    return "#A1A1A1";
};

const shippingStepLabelStyles = (index: number, activeStep: number) => ({
    "& .MuiStepIcon-root": {
        color: getShippingStepColor(index, activeStep),
        fontSize: "25px",
    },
    "& .MuiStepIcon-text": {
        display: "none",
    },
    "& .MuiStepIcon-completed": {
        display: "none",
    },
    "& .MuiStepIcon-root svg": {
        display: "none",
    },
    "& .MuiStepLabel-label": {
        fontSize: "0.75rem",
        fontWeight: index === activeStep ? 600 : 400,
        color: index === activeStep ? "#1E8B7E" : "#95B9B5",
    },
});

interface ShippingStepperProps {
    steps: string[];
    activeStep: number;
}

const ShippingStepper: React.FC<ShippingStepperProps> = ({
    steps,
    activeStep,
}) => {
    return (
        <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={<ShippingStepConnector />}
        >
            {steps.map((stepLabel, index) => (
                <Step key={index} completed={activeStep > index}>
                    <StepLabel
                        sx={shippingStepLabelStyles(index, activeStep)}
                        StepIconComponent={CustomStepIcon}
                    >
                        <div
                            style={{
                                fontSize: "0.70rem",
                                fontWeight: index === activeStep ? 600 : 400,
                                color:
                                    index === activeStep
                                        ? "#1E8B7E"
                                        : "#95B9B5",
                                textAlign: "center",
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                maxWidth: "80px",
                                lineHeight: "1.2",
                                margin: "0 auto", // to center the label under the step
                            }}
                        >
                            {stepLabel}
                        </div>
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    );
};

export default ShippingStepper;
