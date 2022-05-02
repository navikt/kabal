import React from 'react';
import { IShownDocument } from '../show-document/types';

interface ShownDocumentContext {
  shownDocument: IShownDocument | null;
  setShownDocument: (value: IShownDocument | null) => void;
}

export const ShownDocumentContext = React.createContext<ShownDocumentContext>({
  shownDocument: null,
  setShownDocument: () => {},
});
