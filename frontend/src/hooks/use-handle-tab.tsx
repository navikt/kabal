import { TabContext } from '@app/components/documents/tab-context';
import { useIsTabOpen } from '@app/components/documents/use-is-tab-open';
import { toast } from '@app/components/toast/store';
import { useContext } from 'react';

export const useHandleTab = (url: string | undefined, tabId: string | undefined) => {
  const { getTabRef, setTabRef } = useContext(TabContext);
  const isTabOpen = useIsTabOpen(tabId);

  return () => {
    if (tabId === undefined) {
      return toast.error('Kunne ikke generere dokument');
    }

    const tabRef = getTabRef(tabId);

    // There is a reference to the tab and it is open.
    if (tabRef !== undefined && !tabRef.closed) {
      return tabRef.focus();
    }

    if (isTabOpen) {
      return toast.warning('Dokumentet er allerede åpent i en annen fane');
    }

    if (url === undefined) {
      return toast.error('Kunne ikke åpne dokument i ny fane');
    }

    const newTabRef = window.open(url, tabId);

    if (newTabRef === null) {
      return toast.error('Kunne ikke åpne dokument i ny fane');
    }

    setTabRef(tabId, newTabRef);
  };
};
