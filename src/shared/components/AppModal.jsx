// AppModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import {
  ModalBackdrop,
  ModalShell,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  CloseIconBtn
} from "./AppModal.styles";

export default function AppModal({
  isOpen,
  title,
  children,
  footer,
  onClose
}) {
  if (!isOpen) return null;

  const container = document.getElementById("modal-root");
  if (!container) {
    // fallback: bina portal ke render (direct DOM me)
    return (
      <ModalBackdrop onClick={onClose}>
        <ModalShell onClick={e => e.stopPropagation()}>
          <ModalHeader>
            {title && <ModalTitle>{title}</ModalTitle>}
            <CloseIconBtn onClick={onClose}>×</CloseIconBtn>
          </ModalHeader>
          <ModalBody>{children}</ModalBody>
          {footer && <ModalFooter>{footer}</ModalFooter>}
        </ModalShell>
      </ModalBackdrop>
    );
  }

  return ReactDOM.createPortal(
    <ModalBackdrop onClick={onClose}>
      <ModalShell onClick={e => e.stopPropagation()}>
        <ModalHeader>
          {title && <ModalTitle>{title}</ModalTitle>}
          <CloseIconBtn onClick={onClose}>×</CloseIconBtn>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalShell>
    </ModalBackdrop>,
    container
  );
}
