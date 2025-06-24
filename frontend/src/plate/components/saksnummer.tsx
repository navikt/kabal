import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { ToolbarButtonWithConfirm } from '@app/plate/components/common/toolbar-button-with-confirm';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import type { PlaceholderElement, SaksnummerElement } from '@app/plate/types';
import { ArrowUndoIcon, TrashIcon } from '@navikt/aksel-icons';
import { PlateElement, type PlateElementProps } from 'platejs/react';
import { useContext, useEffect, useMemo } from 'react';

export const Saksnummer = (props: PlateElementProps<SaksnummerElement>) => {
  const { data: oppgave } = useOppgave();
  const { editor, children, element } = props;
  const { canManage } = useContext(SmartEditorContext);

  const at = useMemo(() => editor.api.findPath(element), [editor, element]);
  const placeholder = useMemo(
    () => editor.api.node<PlaceholderElement>({ match: (n) => n.type === ELEMENT_PLACEHOLDER, at }),
    [editor, at],
  );

  useEffect(() => {
    if (element.isInitialized || oppgave === undefined || placeholder === undefined) {
      return;
    }

    const [, path] = placeholder;

    editor.tf.withoutSaving(() => {
      editor.tf.insertText(oppgave.saksnummer, { at: path });
      editor.tf.setNodes<SaksnummerElement>({ isInitialized: true }, { at });
    });
  }, [oppgave, editor, placeholder, element.isInitialized, at]);

  if (oppgave === undefined || placeholder === undefined) {
    return null;
  }

  return (
    <PlateElement<SaksnummerElement> {...props} as="div">
      <SectionContainer data-element={element.type} $sectionType={SectionTypeEnum.LABEL}>
        <span className="font-bold text-gray-700" contentEditable={false}>
          Saksnummer:{' '}
        </span>
        {/* Don't render unnecessary text nodes that Slate automatically pads PlaceholderElement with */}
        {children[0][1]}

        {canManage ? (
          <SectionToolbar>
            <ToolbarButtonWithConfirm
              onClick={() => editor.tf.removeNodes({ match: (n) => n === element, at: [] })}
              icon={<TrashIcon aria-hidden />}
              tooltip="Slett saksnummer"
            />
            <ToolbarButtonWithConfirm
              onClick={() =>
                editor.tf.replaceNodes([{ text: oppgave.saksnummer }], { at: placeholder[1], children: true })
              }
              icon={<ArrowUndoIcon aria-hidden />}
              tooltip={`Tilbakestill til saksnummer fra behandlingen (${oppgave.saksnummer})`}
            />
          </SectionToolbar>
        ) : null}
      </SectionContainer>
    </PlateElement>
  );
};
