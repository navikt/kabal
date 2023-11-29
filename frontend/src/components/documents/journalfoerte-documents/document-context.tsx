import { createContext } from 'react';

interface DocumentContextProps {
  /** List of journalpost IDs that are expanded. */
  expandedIds: string[];
  /** List of journalpost IDs that are expanded. */
  setExpandedIds: (journalpostIds: string[]) => void;
}

export const DocumentContext = createContext<DocumentContextProps>({
  expandedIds: [],
  setExpandedIds: () => {},
});
