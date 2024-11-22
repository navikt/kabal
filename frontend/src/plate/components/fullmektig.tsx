import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { FULLMEKTIG_LABEL_PLACEHOLDER, FULLMEKTIG_VALUE_PLACEHOLDER } from '@app/plate/plugins/fullmektig';
import { type FullmektigElement, type PlaceholderElement, useMyPlateEditorRef } from '@app/plate/types';
import { isOfElementType } from '@app/plate/utils/queries';
import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button, Loader } from '@navikt/ds-react';
import { findDescendant, replaceNodeChildren, withoutSavingHistory } from '@udecode/plate-common';
import { PlateElement, type PlateElementProps, findNodePath } from '@udecode/plate-common/react';
import { useEffect } from 'react';
import { setNodes, withoutNormalizing } from 'slate';
import { styled } from 'styled-components';

export const Fullmektig = (props: PlateElementProps<FullmektigElement>) => {
  const { data: oppgave, isLoading, isSuccess } = useOppgave();
  const { element, children } = props;
  const { id, show } = element;
  const editor = useMyPlateEditorRef();

  const at = findNodePath(editor, element);

  const valueEntry = findDescendant<PlaceholderElement>(editor, {
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
      return withoutSavingHistory(editor, () => {
        withoutNormalizing(editor, () => {
          setNodes<FullmektigElement>(editor, { id: undefined, show: false }, { at });
          replaceNodeChildren(editor, { at: valueAt, nodes: [{ text: '' }] });
        });
      });
    }

    withoutSavingHistory(editor, () => {
      withoutNormalizing(editor, () => {
        setNodes<FullmektigElement>(editor, { id: prosessfullmektig.id, show: true }, { at });
        replaceNodeChildren(editor, { at: valueAt, nodes: [{ text: prosessfullmektig.name ?? '' }] });
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
    <PlateElement<FullmektigElement> asChild {...props}>
      <span>
        <NonEditable>{children[0]}</NonEditable>
        <PlaceholderContainer>
          <StyledButton
            contentEditable
            suppressContentEditableWarning
            $align="left"
            variant="tertiary"
            size="small"
            title='Tilbakestill til navn "Fullmektig"'
            onClick={() => {
              const labelEntry = findDescendant<PlaceholderElement>(editor, {
                at,
                match: (n) =>
                  isOfElementType<PlaceholderElement>(n, ELEMENT_PLACEHOLDER) &&
                  n.placeholder === FULLMEKTIG_LABEL_PLACEHOLDER,
              });

              if (labelEntry === undefined) {
                return;
              }

              replaceNodeChildren(editor, { at: labelEntry[1], nodes: [{ text: 'Fullmektig', bold: true }] });
            }}
            icon={<ArrowUndoIcon aria-hidden />}
          />
          <Editable>{children[1]}</Editable>
        </PlaceholderContainer>
        <NonEditable>: </NonEditable>
        <NonEditable>{children[2]}</NonEditable>
        <PlaceholderContainer>
          <StyledButton
            $align="right"
            variant="tertiary"
            size="small"
            title="Tilbakestill til navn fra behandlingen"
            onClick={() => {
              if (valueEntry === undefined) {
                return;
              }

              replaceNodeChildren(editor, { at: valueEntry[1], nodes: [{ text: prosessfullmektig.name ?? '' }] });
            }}
            icon={<ArrowUndoIcon aria-hidden />}
          />
          <Editable>{children[3]}</Editable>
        </PlaceholderContainer>
        <NonEditable>{children[4]}</NonEditable>
        <br />
      </span>
    </PlateElement>
  );
};

const Editable = ({ children }: { children: React.ReactNode }) => (
  <span style={{ outline: 'none' }} contentEditable suppressContentEditableWarning>
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
