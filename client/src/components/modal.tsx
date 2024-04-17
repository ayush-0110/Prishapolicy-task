import React, { ReactNode } from "react";

interface Props {
    isOpen: boolean; 
    onClose: () => void; 
    children: ReactNode; 
  }
  

const Modal = ({ isOpen, onClose, children }:Props) => {
  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        {/* <button className="btn1" style={{ marginTop: "1rem" }} onClick={onClose}>
          Close
        </button> */}
      </div>
    </div>
  );
};

export default Modal;
