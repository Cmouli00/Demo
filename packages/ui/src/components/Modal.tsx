"use client";

import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({
  open,
  title,
  children,
  onClose,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="shared-modal-backdrop">

      <div className="shared-modal">

        <div className="shared-modal-header">
          <h2 className="text-lg font-semibold">{title}</h2>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="shared-modal-close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}