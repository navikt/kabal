import { Checkbox } from '@navikt/ds-react';
import React, { memo, useEffect, useMemo } from 'react';
import { Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery, useGetTilknyttedeDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import { RenderElementProps } from '../slate-elements/render-props';
import { BulletListStyle, ListItemStyle } from '../styled-elements/lists';
import { DocumentListElementType } from '../types/editor-void-types';
import { voidStyle } from './style';

type Documents = DocumentListElementType['documents'];

export const DocumentListElement = memo(
  ({ element, attributes, children }: RenderElementProps<DocumentListElementType>) => {
    const editor = useSlateStatic();
    const oppgaveId = useOppgaveId();
    const { data: newDocuments, isLoading: newIsLoading } = useGetDocumentsQuery(oppgaveId);
    const { data: attachedDocuments, isLoading: attachedIsLoading } = useGetTilknyttedeDokumenterQuery(oppgaveId);

    const isLoading =
      newIsLoading ||
      attachedIsLoading ||
      typeof newDocuments === 'undefined' ||
      typeof attachedDocuments === 'undefined';

    const sourceDocuments = useMemo<Documents>(
      () =>
        isLoading
          ? []
          : [
              ...newDocuments
                .filter(({ parentId }) => parentId === null)
                .map(({ id, tittel }) => ({ id, title: tittel })),
              ...attachedDocuments.dokumenter.filter(hasTitle).map(({ dokumentInfoId, journalpostId, tittel }) => ({
                id: `${journalpostId}-${dokumentInfoId}`,
                title: tittel,
              })),
            ],
      [newDocuments, attachedDocuments, isLoading]
    );

    useEffect(() => {
      const documents = element.documents.filter(({ id }) =>
        sourceDocuments.some(({ id: sourceId }) => sourceId === id)
      );

      if (documents.length !== element.documents.length) {
        Transforms.setNodes(editor, { documents }, { match: (n) => n === element });
      }
    }, [editor, element, sourceDocuments]);

    if (isLoading) {
      return null;
    }

    return (
      <StyledBulletList {...attributes} contentEditable={false}>
        {sourceDocuments.map((d) => (
          <ListItemStyle key={d.id}>
            <Checkbox
              value={d.id}
              checked={element.documents.some(({ id }) => d.id === id)}
              onChange={(e) => {
                const value = e.target.checked
                  ? element.documents.concat(d)
                  : element.documents.filter(({ id }) => id !== d.id);

                Transforms.setNodes(editor, { documents: value }, { at: [], voids: true, match: (n) => n === element });
              }}
            >
              {d.title}
            </Checkbox>
          </ListItemStyle>
        ))}
        {children}
      </StyledBulletList>
    );
  },
  (prevProps, nextProps) =>
    prevProps.element.type === nextProps.element.type && prevProps.element.documents === nextProps.element.documents
);

DocumentListElement.displayName = 'DocumentListElement';

const StyledBulletList = styled(BulletListStyle)`
  padding-left: 16px;
  ${voidStyle}
`;

const hasTitle = <T, R extends T & { tittel: string }>(d: T & { tittel: string | null }): d is R => isNotNull(d.tittel);
