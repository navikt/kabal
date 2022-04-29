import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetSmartEditorQuery } from '../../redux-api/smart-editor-api';
import { ShownDocumentContext } from '../documents/context';
import { PDF } from './styled-components';

interface Props {
  url: string;
  name?: string;
}

export const NoFlickerReloadPdf = ({ url, name }: Props) => {
  const [versions, setVersions] = useState<string[]>([]);
  const [readyIndex, setReadyIndex] = useState<number>(0);
  const { shownDocument } = useContext(ShownDocumentContext);
  const oppgaveId = useOppgaveId();
  const { data } = useGetSmartEditorQuery(
    typeof shownDocument?.documentId === 'string' ? { oppgaveId, dokumentId: shownDocument.documentId } : skipToken
  );

  useEffect(() => {
    if (typeof data === 'undefined' || data === null) {
      return;
    }

    const { modified } = data;
    const version = encodeURIComponent(modified);

    if (!versions.includes(version)) {
      setVersions([...versions, version]);
    }
  }, [data, versions]);

  const onLoad = useCallback(
    (index: number) => {
      if (index > readyIndex) {
        setTimeout(
          () =>
            requestAnimationFrame(() => {
              if (index > readyIndex) {
                setReadyIndex(index);
              }
            }),
          1000
        );
      }
    },
    [readyIndex]
  );

  return (
    <StyledSwitcher>
      {versions.map((version, index) => {
        const current = index === readyIndex;
        const render = current || index > readyIndex;

        if (!render) {
          return null;
        }

        return (
          <StyledPDF
            key={version}
            aria-hidden={!current}
            data={`${url}?version=${version}#toolbar=0&view=fitH&zoom=page-width`}
            role="document"
            type="application/pdf"
            name={name}
            onLoad={() => onLoad(index)}
            current={current}
          />
        );
      })}
    </StyledSwitcher>
  );
};

const StyledPDF = styled(PDF)<{ current: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: ${({ current }) => (current ? 1 : 0)};
`;

const StyledSwitcher = styled.div`
  position: relative;
  width: 100%;
  flex-grow: 1;
`;
