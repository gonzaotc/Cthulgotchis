import React from "react";

const Modal = ({ onClose, children }) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-10"
      onClick={onClose}
    >
      <div
        className="w-[90vw] max-w-[340px] rounded-lg z-20 py-6 px-6 flex flex-col justify-between
                bg-gradient-to-tr from-primary/50 to-cyan-900/40 bg-black/60 drop-shadow-[0_0_20px_rgba(0,0,0,0.55)]"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
