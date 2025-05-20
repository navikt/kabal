import { SmartEditorContextComponent } from '@app/components/smart-editor/context';
import { useHasWriteAccess } from '@app/components/smart-editor/hooks/use-has-write-access';
import { Editor } from '@app/components/smart-editor/tabbed-editors/editor';
import { ScalingGroup } from '@app/hooks/settings/use-setting';
import { ScaleContextComponent } from '@app/plate/status-bar/scale-context';
import type { ISmartDocumentOrAttachment } from '@app/types/documents/documents';
import { Tabs } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';

interface TabPanelProps {
  smartDocument: ISmartDocumentOrAttachment;
}

export const TabPanel = ({ smartDocument }: TabPanelProps) => {
  const { id } = smartDocument;
  const smartDocumentRef = useRef<ISmartDocumentOrAttachment>(smartDocument);
  const hasWriteAccess = useHasWriteAccess(smartDocument);
  const canEditDocumentRef = useRef(hasWriteAccess);

  // Ensure that smartDocumentRef and canEditDocumentRef are always up to date in order to avoid the unmount debounce triggering on archive/delete/fradeling
  useEffect(() => {
    const setRefs = () => {
      smartDocumentRef.current = smartDocument;
      canEditDocumentRef.current = hasWriteAccess;
    };

    setRefs();

    return setRefs;
  }, [hasWriteAccess, smartDocument]);

  return (
    <Tabs.Panel className="h-full overflow-hidden" value={smartDocument.id}>
      <SmartEditorContextComponent smartDocument={smartDocument}>
        <ScaleContextComponent scalingGroup={ScalingGroup.OPPGAVEBEHANDLING}>
          <Editor key={id} smartDocument={smartDocument} scalingGroup={ScalingGroup.OPPGAVEBEHANDLING} />
        </ScaleContextComponent>
      </SmartEditorContextComponent>
    </Tabs.Panel>
  );
};
