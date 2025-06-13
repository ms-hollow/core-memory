interface CancelConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const CancelConfirmationModal: React.FC<CancelConfirmationModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Confirm Cancellation</h3>
                <p>Your order details will be lost if you proceed.</p>
                <div className="modal-buttons">
                    <button onClick={onCancel} className="go-back">Go Back</button>
                    <button onClick={onConfirm} className="confirm">Yes, Cancel my Order</button>
                </div>
            </div>
        </div>
    );
};

export default CancelConfirmationModal;
