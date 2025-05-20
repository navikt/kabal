import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { ToolbarButtonWithConfirm } from '@app/plate/components/common/toolbar-button-with-confirm';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { FULLMEKTIG_LABEL_PLACEHOLDER, FULLMEKTIG_VALUE_PLACEHOLDER } from '@app/plate/plugins/fullmektig';
import { type FullmektigElement, type PlaceholderElement, useMyPlateEditorRef } from '@app/plate/types';
import { isOfElementType } from '@app/plate/utils/queries';
import { ArrowUndoIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Loader } from '@navikt/ds-react';
import { PlateElement, type PlateElementProps } from 'platejs/react';
import { useContext, useEffect } from 'react';
import { styled } from 'styled-components';

export const Fullmektig = (props: PlateElementProps<FullmektigElement>) => {
  const { data: oppgave, isLoading, isSuccess } = useOppgave();
  const { element, children } = props;
  const { id, show } = element;
  const editor = useMyPlateEditorRef();
  const { hasWriteAccess } = useContext(SmartEditorContext);

  const at = editor.api.findPath(element);

  const valueEntry = editor.api.descendant<PlaceholderElement>({
    at,
    match: (n) =>
      isOfElementType<PlaceholderElement>(n, ELEMENT_PLACEHOLDER) && n.placeholder === FULLMEKTIG_VALUE_PLACEHOLDER,
  });

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    const { prosessfullmektig } = oppgave;

    const noFullmektigOk = prosessfullmektig === null && id === undefined && !show;
    const fullmektigOk = prosessfullmektig !== null && id === prosessfullmektig.id && show;

    if (noFullmektigOk || fullmektigOk) {
      return;
    }

    if (valueEntry === undefined) {
      return;
    }

    const [, valueAt] = valueEntry;

    if (prosessfullmektig === null) {
      return editor.tf.withoutSaving(() => {
        editor.tf.withoutNormalizing(() => {
          editor.tf.setNodes<FullmektigElement>({ id: undefined, show: false }, { at });
          editor.tf.replaceNodes([{ text: '' }], { at: valueAt, children: true });
        });
      });
    }

    editor.tf.withoutSaving(() => {
      editor.tf.withoutNormalizing(() => {
        editor.tf.setNodes<FullmektigElement>({ id: prosessfullmektig.id, show: true }, { at });
        editor.tf.replaceNodes([{ text: prosessfullmektig.name ?? '' }], { at: valueAt, children: true });
      });
    });
  }, [editor, isSuccess, oppgave, id, valueEntry, at, show]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isSuccess) {
    return null;
  }

  const { prosessfullmektig } = oppgave;

  if (prosessfullmektig === null) {
    return null;
  }

  return (
    <PlateElement<FullmektigElement> as="div" {...props}>
      <SectionContainer data-element={props.element.type} $sectionType={SectionTypeEnum.LABEL}>
        <PlaceholderContainer>
          <StyledButton
            contentEditable
            suppressContentEditableWarning
            $align="left"
            variant="tertiary"
            size="small"
            title='Tilbakestill tittel til "Fullmektig"'
            onClick={() => {
              const labelEntry = editor.api.descendant<PlaceholderElement>({
                at,
                match: (n) =>
                  isOfElementType<PlaceholderElement>(n, ELEMENT_PLACEHOLDER) &&
                  n.placeholder === FULLMEKTIG_LABEL_PLACEHOLDER,
              });

              if (labelEntry === undefined) {
                return;
              }

              editor.tf.replaceNodes([{ text: 'Fullmektig', bold: true }], { at: labelEntry[1], children: true });
            }}
            icon={<ArrowUndoIcon aria-hidden />}
          />
          {/* Don't render unnecessary text nodes that Slate automatically pads PlaceholderElement with */}
          <Editable>{children[0][1]}</Editable>
        </PlaceholderContainer>
        <NonEditable>: </NonEditable>
        {/* Don't render unnecessary text nodes that Slate automatically pads PlaceholderElement with */}
        <Editable>{children[0][3]}</Editable>

        {hasWriteAccess ? (
          <SectionToolbar>
            <ToolbarButtonWithConfirm
              onClick={() => editor.tf.removeNodes({ match: (n) => n === props.element, at: [] })}
              icon={<TrashIcon aria-hidden />}
              tooltip="Slett fullmektig"
            />

            {prosessfullmektig.name === null ? null : (
              <ToolbarButtonWithConfirm
                onClick={() => {
                  if (valueEntry === undefined) {
                    return;
                  }

                  editor.tf.replaceNodes([{ text: prosessfullmektig.name ?? '' }], {
                    at: valueEntry[1],
                    children: true,
                  });
                }}
                icon={<ArrowUndoIcon aria-hidden />}
                tooltip={`Tilbakestill til navn fra behandlingen (${prosessfullmektig.name})`}
              />
            )}
          </SectionToolbar>
        ) : null}
      </SectionContainer>
    </PlateElement>
  );
};

const Editable = ({ children }: { children: React.ReactNode }) => (
  <span className="outline-none" contentEditable suppressContentEditableWarning>
    {children}
  </span>
);

const NonEditable = ({ children }: { children: React.ReactNode }) => <span contentEditable={false}>{children}</span>;

const StyledButton = styled(Button)<{ $align: 'left' | 'right' }>`
  display: none;
  position: absolute;
  left: ${({ $align }) => ($align === 'right' ? '100%' : 'auto')};
  right: ${({ $align }) => ($align === 'left' ? '100%' : 'auto')};
  top: 50%;
  transform: translateY(-50%);
`;

const PlaceholderContainer = styled.span`
  position: relative;

  &:hover ${StyledButton} {
    display: block;
  }
`;
