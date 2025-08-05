import {useEffect, useState} from "react";
import {X} from "lucide-react";

const ErrorComponent = ({message}: { message: string | null }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
        }, 7000);

        return () => clearTimeout(timer);
    }, [message]);

    if (!visible || !message) return null;

    const onClose = () => {
        setVisible(false);
    }

    return (
        <div className="relative w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">            <button
                onClick={onClose}
                className="absolute top-1 right-1 p-1 text-red-500 hover:text-red-700"
            >
                <X className="w-4 h-4"/>
            </button>
            {message}
        </div>
    );
}

export default ErrorComponent;
