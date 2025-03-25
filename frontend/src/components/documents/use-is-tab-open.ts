import { useEffect, useState } from 'react';

enum MessageTypeEnum {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

interface IMessageData {
  type: MessageTypeEnum;
  documentIdList: string[];
  tabInstanceId: string;
}

type ListenerFn = (isOpen: boolean) => void;

class TabManager {
  private readonly channel = new BroadcastChannel('pdf-channel');
  private readonly tabInstanceMap: Record<string, string[]> = {};
  private readonly listeners: Record<string, ListenerFn[]> = {};

  constructor() {
    this.channel.addEventListener('message', this.handleMessage);
    this.channel.postMessage({ type: 'PING', documentId: '*' });
  }

  public isTabOpen = (documentId: string) => {
    const tabInstances = this.tabInstanceMap[documentId];

    if (tabInstances === undefined) {
      return false;
    }

    return tabInstances.length > 0;
  };

  public addListener = (documentId: string, listener: ListenerFn) => {
    const tabListeners = this.listeners[documentId];

    if (tabListeners === undefined) {
      this.listeners[documentId] = [listener];
    } else if (!tabListeners.includes(listener)) {
      tabListeners.push(listener);
    }
  };

  public removeListener = (documentId: string, listener: ListenerFn) => {
    const tabListeners = this.listeners[documentId];

    if (tabListeners === undefined) {
      return;
    }

    this.listeners[documentId] = tabListeners.filter((l) => l !== listener);
  };

  private handleMessage = (e: MessageEvent<unknown>) => {
    const { data } = e;

    if (!isPdfTabData(data)) {
      return;
    }

    if (data.type === MessageTypeEnum.OPEN) {
      for (const documentId of data.documentIdList) {
        const instanceList = this.tabInstanceMap[documentId];

        if (instanceList === undefined) {
          this.tabInstanceMap[documentId] = [data.tabInstanceId];
          this.notifyListeners(documentId, true);
        } else if (!instanceList.includes(data.tabInstanceId)) {
          instanceList.push(data.tabInstanceId);
          this.notifyListeners(documentId, true);
        }
      }

      return;
    }

    if (data.type === MessageTypeEnum.CLOSED) {
      for (const documentId of data.documentIdList) {
        const instanceList = this.tabInstanceMap[documentId];

        if (instanceList === undefined) {
          continue;
        }

        if (instanceList.includes(data.tabInstanceId)) {
          const updatedList = instanceList.filter((id) => id !== data.tabInstanceId);
          this.tabInstanceMap[documentId] = updatedList;

          if (updatedList.length === 0) {
            this.notifyListeners(documentId, false);
          }
        }
      }
    }
  };

  private notifyListeners = (documentId: string, isOpen: boolean) => {
    const tabListeners = this.listeners[documentId];

    if (tabListeners === undefined) {
      return;
    }

    for (const listener of tabListeners) {
      listener(isOpen);
    }
  };
}

export const TAB_MANAGER = new TabManager();

export const useIsTabOpen = (documentId: string | undefined): boolean => {
  const [isOpen, setIsOpen] = useState<boolean>(documentId === undefined ? false : TAB_MANAGER.isTabOpen(documentId));

  useEffect(() => {
    if (documentId === undefined) {
      return;
    }

    TAB_MANAGER.addListener(documentId, setIsOpen);

    return () => TAB_MANAGER.removeListener(documentId, setIsOpen);
  }, [documentId]);

  return isOpen;
};

const isPdfTabData = (data: unknown): data is IMessageData => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return (
    'type' in data &&
    typeof data.type === 'string' &&
    data.type in MessageTypeEnum &&
    'documentIdList' in data &&
    Array.isArray(data.documentIdList) &&
    'tabInstanceId' in data &&
    typeof data.tabInstanceId === 'string'
  );
};
