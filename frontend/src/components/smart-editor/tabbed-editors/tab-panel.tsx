import { Tabs } from '@navikt/ds-react';
import { SmartEditorContextComponent } from '@/components/smart-editor/context';
import { Editor } from '@/components/smart-editor/tabbed-editors/editor';
import { ScalingGroup } from '@/hooks/settings/use-setting';
import { ScaleContextComponent } from '@/plate/status-bar/scale-context';
import type { ISmartDocumentOrAttachment } from '@/types/documents/documents';

interface TabPanelProps {
  smartDocument: ISmartDocumentOrAttachment;
}

export const TabPanel = ({ smartDocument }: TabPanelProps) => {
  const { id } = smartDocument;

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
