// AppModal.jsx
import React, { useEffect } from "react";
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
import { setNativeKeyboardMode, isAndroid10 } from "../utils/nativeKeyboardBridge";

export default function AppModal({
  isOpen,
  title,
  children,
  footer,
  onClose
}) {
  useEffect(() => {
    if (!isOpen) return;

    const restoreKeyboardMode = () => {
      const isChat = window.location.pathname.toLowerCase().includes("/chat");
      if (isAndroid10()) {
        setNativeKeyboardMode(isChat ? "nothing" : "pan");
      } else {
        setNativeKeyboardMode(isChat ? "resize" : "pan");
      }
    };

    const handleFocusIn = (e) => {
      const modalEl = document.querySelector(".app-modal-backdrop") || document.getElementById("modal-root");
      if (!modalEl || !modalEl.contains(e.target)) return;

      const tag = e.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || e.target?.isContentEditable) {
        if (isAndroid10()) {
          setNativeKeyboardMode("nothing");
        } else {
          setNativeKeyboardMode("resize");
        }
      }
    };

    const handleFocusOut = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || e.target?.isContentEditable) {
        restoreKeyboardMode();
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      restoreKeyboardMode();
    };
  }, [isOpen]);

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
