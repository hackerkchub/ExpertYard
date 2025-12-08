import React from "react";
import { ModalOverlay, ModalBody } from "./Modal.styles";

const Modal = ({ open, children }) => {
  if (!open) return null;
  return (
    <ModalOverlay>
      <ModalBody>{children}</ModalBody>
    </ModalOverlay>
  );
};

export default Modal;
