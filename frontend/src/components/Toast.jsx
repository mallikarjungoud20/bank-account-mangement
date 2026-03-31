import { useContext, useEffect } from "react";
import { ToastContext } from "../context/ToastContext";

function Toast() {
  const { toasts, removeToast } = useContext(ToastContext);

  const getStyles = (type) => {
    const baseStyles = "fixed top-20 right-5 z-50 bg-white shadow-lg rounded-lg px-4 py-3 max-w-sm border-l-4";
    
    const typeStyles = {
      success: "border-l-green-500 text-green-800",
      error: "border-l-red-500 text-red-800",
      info: "border-l-blue-500 text-blue-800",
    };

    return `${baseStyles} ${typeStyles[type] || typeStyles.info}`;
  };

  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`${getStyles(toast.type)} mb-3`}
          style={{
            animation: "slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 2.7s forwards",
          }}
        >
          <div className="flex items-center justify-between">
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-400 hover:text-gray-600 font-bold"
            >
              ×
            </button>
          </div>

          <style>{`
            @keyframes slideInRight {
              from {
                transform: translateX(400px);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }

            @keyframes fadeOut {
              to {
                opacity: 0;
                transform: translateX(400px);
              }
            }
          `}</style>
        </div>
      ))}
    </>
  );
}

export default Toast;
