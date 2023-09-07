import React, { createContext, useCallback, useState } from 'react';
import { ValidationError } from '@app/components/documents/new-documents/modal/finish-document/errors';
import { IBrevmottaker, useBrevmottakere } from '@app/hooks/use-brevmottakere';
import { IMainDocument } from '@app/types/documents/documents';
import { IPart } from '@app/types/oppgave-common';

interface IModalContext {
  document: IMainDocument | null;
  setDocument: (document: IMainDocument | null) => void;
  close: () => void;

  selectedPartBrevmottakerIds: string[];
  setSelectedPartBrevmottakerIds: (ids: string[]) => void;

  customBrevmottakerList: IPart[];
  setCustomBrevmottakerList: (parts: IPart[]) => void;

  partBrevmottakere: IBrevmottaker[];

  validationErrors: ValidationError[];
  setValidationErrors: (errors: ValidationError[]) => void;
}

const noop = () => {};

export const ModalContext = createContext<IModalContext>({
  document: null,
  setDocument: noop,
  close: noop,

  selectedPartBrevmottakerIds: [],
  setSelectedPartBrevmottakerIds: noop,
  customBrevmottakerList: [],
  setCustomBrevmottakerList: noop,
  partBrevmottakere: [],
  validationErrors: [],
  setValidationErrors: noop,
});

interface Props {
  children: React.ReactNode;
}

export const ModalContextElement = ({ children }: Props) => {
  const [partBrevmottakere = EMPTY_BREVMOTTAKER_LIST] = useBrevmottakere();
  const [document, setInternalDocument] = useState<IMainDocument | null>(null);

  const [selectedPartBrevmottakerIds, setSelectedPartBrevmottakerIds] = useState<string[]>(
    getInitialSelectedPartBrevmottakerIds(partBrevmottakere),
  );

  const [customBrevmottakerList, setCustomBrevmottakerList] = useState<IPart[]>(INITIAL_CUSTOM_BREVMOTTAKER_IDS);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(INITIAL_VALIDATION_ERRORS);

  const setDocument = useCallback(
    (newDocument: IMainDocument | null) => {
      setInternalDocument(newDocument);
      // Reset state when document changes or modal is closed.
      setValidationErrors(INITIAL_VALIDATION_ERRORS);
      setCustomBrevmottakerList(INITIAL_CUSTOM_BREVMOTTAKER_IDS);
      setSelectedPartBrevmottakerIds(getInitialSelectedPartBrevmottakerIds(partBrevmottakere));
    },
    [partBrevmottakere],
  );

  const close = useCallback(() => setDocument(null), [setDocument]);

  return (
    <ModalContext.Provider
      value={{
        document,
        setDocument,
        close,

        selectedPartBrevmottakerIds,
        setSelectedPartBrevmottakerIds,

        customBrevmottakerList,
        setCustomBrevmottakerList,

        partBrevmottakere,

        validationErrors,
        setValidationErrors,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

const EMPTY_BREVMOTTAKER_LIST: IBrevmottaker[] = [];

const INITIAL_CUSTOM_BREVMOTTAKER_IDS: IPart[] = [];
const INITIAL_VALIDATION_ERRORS: ValidationError[] = [];

const getInitialSelectedPartBrevmottakerIds = (partBrevmottakere: IBrevmottaker[]) => {
  const [firstPartBrevmottaker] = partBrevmottakere;

  return partBrevmottakere.length === 1 && firstPartBrevmottaker !== undefined ? [firstPartBrevmottaker.id] : [];
};
