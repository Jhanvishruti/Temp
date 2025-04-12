import { Button } from "../../components/Button";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-xl">
                <h3 className="text-lg font-medium text-white">{title}</h3>
                <p className="mt-2 text-gray-400">{message}</p>
                <div className="mt-4 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm}>
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;