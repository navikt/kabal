import React, { useState } from 'react';
import { Editor } from 'slate';

export interface IRichTextContext extends Omit<Props, 'children'> {
  readonly editor: Editor | null;
  readonly setEditor: (editor: Editor | null) => void;
}

interface Props {
  readonly children: React.ReactNode;
}

export const RichTextContextComponent = ({ children }: Props) => {
  const [editor, setEditor] = useState<Editor | null>(null);

  return (
    <RichTextContext.Provider
      value={{
        editor,
        setEditor,
      }}
    >
      {children}
    </RichTextContext.Provider>
  );
};

export const RichTextContext = React.createContext<IRichTextContext>({
  editor: null,
  setEditor: () => {},
});
