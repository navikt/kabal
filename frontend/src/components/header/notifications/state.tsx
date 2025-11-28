import type React from 'react';
import { createContext, type RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

interface NotificationsState {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  closeMenuAndModal: () => void;
  modalRef: RefObject<HTMLDialogElement | null>;
}

const NotificationsContext = createContext<NotificationsState | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const closeMenuAndModal = useCallback(() => {
    setIsMenuOpen(false);
    setIsModalOpen(false);
    modalRef.current?.close();
  }, []);

  const { pathname } = useLocation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: On pathname change, close the notifications
  useEffect(() => {
    closeMenuAndModal();
  }, [pathname, closeMenuAndModal]);

  return (
    <NotificationsContext.Provider
      value={{
        isMenuOpen,
        setIsMenuOpen,
        isModalOpen,
        setIsModalOpen,
        closeMenuAndModal,
        modalRef,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = (): NotificationsState => {
  const context = useContext(NotificationsContext);

  if (context === undefined) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider');
  }

  return context;
};
