import { useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

interface QRCodeDetails {
    isOpen: boolean;
    setQRCodeModal: React.Dispatch<React.SetStateAction<boolean>>;
    generated_qr_code: string;
}

const QRCodeModal = ({
    isOpen,
    setQRCodeModal,
    generated_qr_code,
}: QRCodeDetails) => {
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target as Node)
            ) {
                setQRCodeModal(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="qrcode-modal">
            <div className="qr-code-container" ref={modalRef}>
                <QRCodeCanvas value={generated_qr_code} size={236} />
            </div>
        </div>
    );
};

export default QRCodeModal;
