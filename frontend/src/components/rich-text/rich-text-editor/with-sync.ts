/* eslint-disable import/no-unused-modules */
import { BaseOperation, Editor, PathRef, PointRef, RangeRef, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { v4 } from 'uuid';
import { KABAL_BEHANDLINGER_BASE_PATH } from '../../../redux-api/common';
import { ServerSentEventManager, ServerSentEventType } from '../../../redux-api/server-sent-events';

export interface ISyncOptions {
  oppgaveId: string;
  documentId: string;
  onConnectionChange: (isConnected: boolean) => void;
}

const CLIENT_ID = v4();

const QUEUE: BaseOperation[] = [];

export const withSync = (editor: Editor, { oppgaveId, documentId, onConnectionChange }: ISyncOptions): Editor => {
  const { apply } = editor;

  const url = `${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/dokumenter/smarteditor/${documentId}/editors/${documentId}`;

  const sse = getSSE(url);

  sse.addConnectionListener((connected) => {
    onConnectionChange(connected);
    // console.log('EMPTYING QUEUE');
    QUEUE.forEach((op) => sendOperation(url, op));
    QUEUE.length = 0;
  });

  sse.addJsonEventListener<ISyncEvent>(ServerSentEventType.OPERATION, (data) => {
    if (data === null || data.clientId === CLIENT_ID || editor.children.length === 0) {
      return;
    }

    // console.log('RECEIVE SSE OPERATION', data);

    HistoryEditor.withoutSaving(editor, () => {
      applyWithoutNormalization(editor, data.operation);
    });

    // console.log(editor.children);
  });

  editor.apply = (operation) => {
    if (operation.type !== 'set_selection') {
      // console.log('BEFORE OPERATION', operation, editor.children);
    }

    apply(operation);

    if (operation.type !== 'set_selection') {
      // console.log('AFTER OPERATION', operation, editor.children);
    }

    if (operation.type !== 'set_selection') {
      if (!sse.isConnected) {
        QUEUE.push(operation);

        return;
      }

      sendOperation(url, operation);
    }
  };

  return editor;
};

const sendOperation = (url: string, operation: BaseOperation) => {
  const op: ISyncEvent = {
    clientId: CLIENT_ID,
    operation,
  };

  // console.log('SEND OPERATION', op);

  return fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    body: JSON.stringify(op),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};

export interface ISyncEvent {
  clientId: string;
  operation: BaseOperation;
}

const sseManagers: Record<string, ServerSentEventManager> = {};

const getSSE = (url: string): ServerSentEventManager => {
  const sseManager = sseManagers[url];

  if (sseManager !== undefined) {
    return sseManager;
  }

  const sse = new ServerSentEventManager(url);
  sseManagers[url] = sse;

  return sse;
};

const applyWithoutNormalization = (editor: Editor, op: BaseOperation) => {
  for (const ref of Editor.pathRefs(editor)) {
    PathRef.transform(ref, op);
  }

  for (const ref of Editor.pointRefs(editor)) {
    PointRef.transform(ref, op);
  }

  for (const ref of Editor.rangeRefs(editor)) {
    RangeRef.transform(ref, op);
  }

  Transforms.transform(editor, op);

  editor.onChange();
};
