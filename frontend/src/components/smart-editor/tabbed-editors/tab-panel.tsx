import { SmartEditorContextComponent } from '@app/components/smart-editor/context';
import { useCanEditDocument } from '@app/components/smart-editor/hooks/use-can-edit-document';
import { Editor } from '@app/components/smart-editor/tabbed-editors/editor';
import { ScalingGroup } from '@app/hooks/settings/use-setting';
import { ScaleContextComponent } from '@app/plate/status-bar/scale-context';
import type { ISmartDocument } from '@app/types/documents/documents';
import { Tabs } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';
import { styled } from 'styled-components';

interface TabPanelProps {
  smartDocument: ISmartDocument;
}

export const TabPanel = ({ smartDocument }: TabPanelProps) => {
  const { id } = smartDocument;
  const smartDocumentRef = useRef<ISmartDocument>(smartDocument);

  const canEditDocument = useCanEditDocument(smartDocument.templateId, smartDocument.creator.employee.navIdent);
  const canEditDocumentRef = useRef(canEditDocument);

  // Ensure that smartDocumentRef and canEditDocumentRef are always up to date in order to avoid the unmount debounce triggering on archive/delete/fradeling
  useEffect(() => {
    const setRefs = () => {
      smartDocumentRef.current = smartDocument;
      canEditDocumentRef.current = canEditDocument;
    };

    setRefs();

    return setRefs;
  }, [canEditDocument, smartDocument]);

  return (
    <StyledTabsPanel value={smartDocument.id}>
      <SmartEditorContextComponent smartDocument={smartDocument}>
        <ScaleContextComponent scalingGroup={ScalingGroup.OPPGAVEBEHANDLING}>
          <Editor key={id} smartDocument={smartDocument} scalingGroup={ScalingGroup.OPPGAVEBEHANDLING} />
        </ScaleContextComponent>
      </SmartEditorContextComponent>
    </StyledTabsPanel>
  );
};

export const StyledTabsPanel = styled(Tabs.Panel)`
  height: 100%;
  overflow: hidden;
`;
