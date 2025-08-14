import {
    Clock,
    CheckCircle,
    AlertCircle,
    Star,
} from "lucide-react";

export const getStatusConfig = (status) => {
    const configs = {
        new: {
            bg: "bg-red-50",
            text: "text-red-700",
            icon: <Star size={14} />,
        },
        contacted: {
            bg: "bg-orange-50",
            text: "text-orange-700",
            icon: <Clock size={14} />,
        },
        qualified: {
            bg: "bg-green-50",
            text: "text-green-700",
            icon: <CheckCircle size={14} />,
        },
        hot: {
            bg: "bg-red-50",
            text: "text-red-700",
            icon: <AlertCircle size={14} />,
        },
    };
    return (
        configs[status] || {
            bg: "bg-gray-50",
            text: "text-gray-700",
            icon: <Star size={14} />,
        }
    );
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
};