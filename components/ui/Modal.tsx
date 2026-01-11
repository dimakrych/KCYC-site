import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Use createPortal to render the modal outside of the parent DOM hierarchy.
  // This attaches it directly to the body, ensuring z-index works relative to the entire viewport,
  // fixing issues where sticky headers or parent overflow settings cut off the modal.
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-kmmr-blue/80 backdrop-blur-md animate-fade-in">
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl h-auto max-h-[90vh] relative animate-fade-in-up transition-colors duration-300 flex flex-col overflow-hidden border border-white/10 dark:border-gray-700 z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-200 transition-colors z-[10001] shadow-sm cursor-pointer"
        >
          <X size={20} />
        </button>
        
        {/* Scrollable content wrapper */}
        <div className="overflow-y-auto flex-1 overscroll-contain relative">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};