import { Loader } from '@navikt/ds-react';
import React, { useCallback } from 'react';
import { styled } from 'styled-components';

export interface Version {
  url: string;
  ready: boolean;
  id: number;
}

interface Props {
  versions: Version[];
  isLoading: boolean;
  onVersionLoaded: (versionId: number) => void;
}

export const NoFlickerReloadPdf = ({ versions, isLoading, onVersionLoaded }: Props) => {
  const onLoad = useCallback(
    (version: Version) => {
      setTimeout(() => onVersionLoaded(version.id), 2000);
    },
    [onVersionLoaded],
  );

  return (
    <StyledSwitcher data-count={versions.length} data-ready={versions.map((v) => v.ready)}>
      {isLoading ? (
        <Overlay>
          <Loader size="3xlarge" />
        </Overlay>
      ) : null}
      {versions.map((version) => (
        <StyledPDF
          key={version.id}
          data={`${version.url}?version=${version.id}${PDFparams}`}
          role="document"
          type="application/pdf"
          name="pdf-viewer"
          onLoad={() => onLoad(version)}
          style={{ zIndex: version.ready ? 0 : -1 }}
        />
      ))}
    </StyledSwitcher>
  );
};

NoFlickerReloadPdf.displayName = 'NoFlickerReloadPdf';

const PDFparams = '#toolbar=1&view=fitH&zoom=page-width';

const StyledPDF = styled.object`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  flex-grow: 1;
`;

const StyledSwitcher = styled.div`
  position: relative;
  width: 100%;
  flex-grow: 1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--a-surface-neutral-moderate);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;
