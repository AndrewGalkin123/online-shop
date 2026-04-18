import React from "react";
import "./Modal.css"; // Import styles for the modal

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render anything if the modal is not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to my Project!</h2>
        <p>
          Thank you for visiting our website! This is a non-commercial project
          developed by a student as a part of academic studies. The purpose of
          this site is to establish myself as a front end programmer.
        </p>
        <p>
          Please note that all products, images, and content are used for
          educational and demonstration purposes only. We do not sell any items
          or claim ownership of any trademarks or copyrights associated with
          them.
        </p>
        <p>
          If you have any questions or concerns, please feel free to contact us.
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
