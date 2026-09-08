import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

interface NotificationsState {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  closeMenuAndModal: () => void;
}

const NotificationsContext = createContext<NotificationsState | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeMenuAndModal = useCallback(() => {
    setIsMenuOpen(false);
    setIsModalOpen(false);
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
