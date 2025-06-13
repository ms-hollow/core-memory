import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import CustomStepper from "./CustomStepper.tsx";
import UserUpload from "../USERS/UserUpload.tsx";
import UserPurchaseDetails from "../USERS/UserPurchaseDetails.tsx";

import { useAuth } from "../../context/AuthContext.tsx";
import { uploadAttachLink, uploadAttachFile } from "../../apis/core-memoryApis.ts";
import { createOrderDetail } from "../../apis/order-detailApis.ts";
import { addToCart } from "../../apis/cart-itemApis.ts.ts";

interface CreateCoreMemoryModalProps {
  isOpen: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const steps = ["Upload", "Details"];

const CreateCoreMemory: React.FC<CreateCoreMemoryModalProps> = ({ isOpen, setShowModal }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [activeStep, setActiveStep] = useState(0);

  const [uploadData, setUploadData] = useState<{
    attach_item: string | File;
    type: "link" | "file";
    title: string;
    description: string;
  }>({
    attach_item: "",
    type: "link",
    title: "",
    description: "",
  });

  const [selectedVariant, setSelectedVariant] = useState<string | null>("Joy");
  const [quantity, setQuantity] = useState<number>(1);

  const handleNext = () => {
    if (uploadData.type === "file" && !(uploadData.attach_item instanceof File)) {
      alert("Please upload a file.");
      return;
    }

    if (uploadData.type === "link" && typeof uploadData.attach_item === "string" && uploadData.attach_item.trim() === "") {
      alert("Please provide a link.");
      return;
    }

    if (!uploadData.title.trim() || !uploadData.description.trim()) {
      alert("Title and description are required.");
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleCheckout = async () => {
    console.log("Upload Data:", uploadData);
    console.log("Selected Variant:", selectedVariant);
    console.log("Quantity:", quantity);

    const orderDetailsIDs = await uploadLinkFile();
    await addItemToCart(orderDetailsIDs);

    if (orderDetailsIDs) {
      navigate("/order-details", { state: { orderDetailsIDs: [orderDetailsIDs] } });
    } else {
      window.alert("Navigation skipped: orderDetailsID is missing.");
    }
  };

  const handleAddToCart = async () => {
    const orderDetailsID = await uploadLinkFile();
    await addItemToCart(orderDetailsID);

    // Reset all fields
    setUploadData({
      attach_item: "",
      type: "link",
      title: "",
      description: "",
    });
    setSelectedVariant("Joy");
    setQuantity(1);
    setActiveStep(0);
    setShowModal(false);
  };

  const addItemToCart = async (order_detail_id: number) => {
    if (!token) {
      alert("Token is missing. Please log in again.");
      return;
    }

    try {
      const requestData = {
        order_detail_id,
        create_at: new Date(),
      };

      const res = await addToCart(requestData, token);
      console.log(res);
    } catch (error) {
      alert("An error occurred, please try again later.");
    }
  };

  const uploadLinkFile = async () => {
    if (!token) {
      alert("Token is missing. Please log in again.");
      return null;
    }

    try {
      let coreMemoryId: number | null = null;

      if (uploadData.type === "file") {
        if (!(uploadData.attach_item instanceof File)) {
          alert("No file selected. Please choose a file.");
          return null;
        }

        const multipartData = new FormData();
        multipartData.append("title", uploadData.title);
        multipartData.append("description", uploadData.description);
        multipartData.append("type", uploadData.type);
        multipartData.append("attach_item", uploadData.attach_item);

        const res = await uploadAttachFile(multipartData, token);
        coreMemoryId = res.data.core_memory_id;
      } else if (uploadData.type === "link") {
        const res = await uploadAttachLink(uploadData, token);
        coreMemoryId = res.data.core_memory_id;
      }

      if (coreMemoryId) {
        const orderData = {
          product_id: 1,
          core_memory_id: coreMemoryId,
          variant: selectedVariant,
          quantity: quantity,
        };

        const orderRes = await createOrderDetail(orderData, token);
        return orderRes.data.order_detail_id;
      }

      return null;
    } catch (error) {
      alert("An error occurred, please try again later.");
      return null;
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <UserUpload uploadData={uploadData} setUploadData={setUploadData} />;
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
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setUploadData({
          attach_item: "",
          type: "link",
          title: "",
          description: "",
        });
        setSelectedVariant("Joy");
        setQuantity(1);
        setActiveStep(0);
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
                  <button onClick={handleNext} className="modalButtons__next">
                    Next
                  </button>
                )}

                {activeStep === 1 && (
                  <div className="stepTwoButtons">
                    <button onClick={handleBack} className="stepTwoButtons__back">
                      <FaArrowLeft />
                    </button>
                    <button onClick={handleAddToCart} className="stepTwoButtons__toCart">
                      Add to Cart
                    </button>
                    <button onClick={handleCheckout} className="stepTwoButtons__checkout">
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