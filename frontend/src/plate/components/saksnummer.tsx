import { ArrowUndoIcon, TrashIcon } from '@navikt/aksel-icons';
import { PlateElement, type PlateElementProps, useEditorReadOnly } from 'platejs/react';
import { useEffect, useMemo } from 'react';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { ToolbarButtonWithConfirm } from '@/plate/components/common/toolbar-button-with-confirm';
import { ptToEm } from '@/plate/components/get-scaled-em';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@/plate/components/styled-components';
import { ELEMENT_PLACEHOLDER } from '@/plate/plugins/element-types';
import type { ArenaSaksnummerElement, PlaceholderElement, SaksnummerElement } from '@/plate/types';

export const Saksnummer = (props: PlateElementProps<SaksnummerElement>) => {
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    return null;
  }

  return <SaksnummerBase {...props} label="Saksnummer" saksnummer={oppgave.saksnummer} />;
};

// Shown whenever it is part of the template, regardless of whether the oppgave has loaded or has a value yet.
// Renders empty (no auto-filled text) until/unless `oppgave.arenaSaksnummer` has a value.
export const ArenaSaksnummer = (props: PlateElementProps<ArenaSaksnummerElement>) => {
  const { data: oppgave } = useOppgave();

  const arenaSaksnummer = oppgave === undefined ? null : oppgave.arenaSaksnummer;

  return <SaksnummerBase {...props} label="Saksnummer fra Arena" saksnummer={arenaSaksnummer} />;
};

interface SaksnummerBaseProps extends PlateElementProps<SaksnummerElement | ArenaSaksnummerElement> {
  label: string;
  saksnummer: string | null;
}

const SaksnummerBase = ({ label, saksnummer, ...props }: SaksnummerBaseProps) => {
  const { editor, children, element } = props;
  const readOnly = useEditorReadOnly();

  const at = useMemo(() => editor.api.findPath(element), [editor, element]);
  const placeholder = useMemo(
    () => editor.api.node<PlaceholderElement>({ match: (n) => n.type === ELEMENT_PLACEHOLDER, at }),
    [editor, at],
  );

  useEffect(() => {
    if (element.isInitialized || saksnummer === null || placeholder === undefined) {
      return;
    }

    const [, path] = placeholder;

    editor.tf.withoutSaving(() => {
      editor.tf.insertText(saksnummer, { at: path });
      editor.tf.setNodes<SaksnummerElement | ArenaSaksnummerElement>({ isInitialized: true }, { at });
    });
  }, [saksnummer, editor, placeholder, element.isInitialized, at]);

  const labelPart = useMemo(() => {
    const [first = '', ...rest] = label;
    return `${first.toLowerCase()}${rest.join('')}`;
  }, [label]);

  if (placeholder === undefined) {
    return null;
  }

  return (
    <PlateElement<SaksnummerElement | ArenaSaksnummerElement> {...props} as="div">
      <SectionContainer data-element={element.type} sectionType={SectionTypeEnum.LABEL}>
        <span className="inline-block text-ax-neutral-800" style={{ width: ptToEm(150) }} contentEditable={false}>
          {label}:{' '}
        </span>
        {/* Don't render unnecessary text nodes that Slate automatically pads PlaceholderElement with */}
        {children[0][1]}

        {readOnly ? null : (
          <SectionToolbar>
            <ToolbarButtonWithConfirm
              onClick={() => editor.tf.removeNodes({ match: (n) => n === element, at: [] })}
              icon={<TrashIcon aria-hidden />}
              tooltip={`Slett ${labelPart}`}
            />
            {saksnummer === null ? null : (
              <ToolbarButtonWithConfirm
                onClick={() => editor.tf.replaceNodes([{ text: saksnummer }], { at: placeholder[1], children: true })}
                icon={<ArrowUndoIcon aria-hidden />}
                tooltip={`Tilbakestill til ${labelPart} fra behandlingen (${saksnummer})`}
              />
            )}
          </SectionToolbar>
        )}
      </SectionContainer>
    </PlateElement>
  );
};
