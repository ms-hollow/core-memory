import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import CustomStepper from "../../components/ui/CustomStepper";
import UserUpload from "../../components/USERS/UserUpload";
import UserPurchaseDetails from "../../components/USERS/UserPurchaseDetails";

interface CreateCoreMemoryModalProps {
    isOpen: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const steps = ["Upload", "Details"];

const CreateCoreMemory: React.FC<CreateCoreMemoryModalProps> = ({
    isOpen,
    setShowModal,
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [uploadData, setUploadData] = useState({
        attach_item: "" as string | File,
        type: "file" as "file" | "link",
        title: "",
        description: "",
    });

    const [selectedVariant, setSelectedVariant] = useState<string | null>(
        "Joy"
    );
    const [quantity, setQuantity] = useState<number>(1);

    const navigate = useNavigate();
    const modalRef = useRef<HTMLDivElement | null>(null);

    const handleNext = () => {
        if (activeStep === 0) {
            console.log(uploadData);
        }
        setActiveStep((prev) => prev + 1);
    };
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleCheckout = () => {
        console.log("Upload Data: ", uploadData);
        console.log("Selected Variant: ", selectedVariant);
        console.log("Quantity: ", quantity);

        navigate("/order-details");
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <UserUpload
                        uploadData={uploadData}
                        setUploadData={setUploadData}
                    />
                );
            case 1:
                return (
                    <UserPurchaseDetails
                        selectedVariant={selectedVariant}
                        setSelectedVariant={setSelectedVariant}
                        quantity={quantity}
                        setQuantity={setQuantity}
                    />
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target as Node)
            ) {
                setShowModal(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen, setShowModal]);

    if (!isOpen) return null;

    return (
        <div className="modalOverlay">
            <div className="modalOverlay__modal" ref={modalRef}>
                <CustomStepper steps={steps} activeStep={activeStep} />

                <div>
                    {activeStep === steps.length ? null : (
                        <>
                            {getStepContent(activeStep)}
                            <div className="modalButtons">
                                {activeStep === 0 && (
                                    <button
                                        onClick={handleNext}
                                        className="modalButtons__next"
                                    >
                                        Next
                                    </button>
                                )}
                                {activeStep === 1 && (
                                    <div className="stepTwoButtons">
                                        <button
                                            onClick={handleBack}
                                            className="stepTwoButtons__back"
                                        >
                                            <FaArrowLeft />
                                        </button>
                                        <button className="stepTwoButtons__toCart">
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={handleCheckout}
                                            className="stepTwoButtons__checkout"
                                        >
                                            Checkout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateCoreMemory;
