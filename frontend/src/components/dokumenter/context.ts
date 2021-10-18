import React from 'react';
import { IShownDokument } from '../show-document/types';

interface ShownDocumentType {
  shownDocument: IShownDokument | null;
  setShownDocument: (value: IShownDokument | null) => void;
}

export const ShownDocumentContext = React.createContext<ShownDocumentType>({
  shownDocument: null,
  setShownDocument: () => {},
});
