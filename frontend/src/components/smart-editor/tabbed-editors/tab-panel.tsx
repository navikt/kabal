import { SmartEditorContextComponent } from '@app/components/smart-editor/context';
import { Editor } from '@app/components/smart-editor/tabbed-editors/editor';
import { ScalingGroup } from '@app/hooks/settings/use-setting';
import { ScaleContextComponent } from '@app/plate/status-bar/scale-context';
import type { ISmartDocumentOrAttachment } from '@app/types/documents/documents';
import { Tabs } from '@navikt/ds-react';

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
