import { Box, HStack, Loader } from '@navikt/ds-react';
import { useCallback, useState } from 'react';
import { styled } from 'styled-components';

interface Version {
  url: string;
  ready: boolean;
  id: number;
}

interface Props {
  versions: Version[];
  isLoading: boolean;
  onVersionLoaded: (versionId: number) => void;
}

export interface UseNoFlickerReloadPdf {
  onLoaded: (versionId: number) => void;
  versions: Version[];
  onReload: () => void;
  setVersions: (versions: Version[]) => void;
}

export const useNoFlickerReloadPdf = (
  pdfUrl: string | undefined,
  setIsLoading: (loading: boolean) => void,
): UseNoFlickerReloadPdf => {
  const [versions, setVersions] = useState<Version[]>([]);

  const onLoaded = useCallback(
    (versionId: number) => {
      setVersions((versionList) => versionList.map((v) => (v.id === versionId ? { ...v, ready: true } : v)));

      setIsLoading(false);
    },
    [setIsLoading],
  );

  const load = useCallback(
    async (url: string | undefined) => {
      if (url === undefined) {
        return;
      }

      setIsLoading(true);

      setVersions((v) => {
        const lastReady = v.findLast((e) => e.ready);
        const newData: Version = { url, ready: false, id: Date.now() };

        if (lastReady !== undefined) {
          return [lastReady, newData];
        }

        return [newData];
      });
    },
    [setIsLoading],
  );

  const onReload = useCallback(() => load(pdfUrl), [pdfUrl, load]);

  return { onLoaded, versions, onReload, setVersions };
};

export const NoFlickerReloadPdf = ({ versions, isLoading, onVersionLoaded }: Props) => {
  const onLoad = useCallback(
    (version: Version) => {
      setTimeout(() => onVersionLoaded(version.id), 250);
    },
    [onVersionLoaded],
  );

  return (
    <StyledSwitcher data-count={versions.length} data-ready={versions.map((v) => v.ready)}>
      {isLoading ? (
        <HStack asChild align="center" justify="center" position="absolute" top="0" left="0" className="z-2">
          <Box background="surface-neutral-moderate" height="100%" width="100%">
            <Loader size="3xlarge" />
          </Box>
        </HStack>
      ) : null}
      {versions.map((version) => (
        <StyledPDF
          key={version.id}
          data={`${version.url}?version=${version.id}${PDFparams}`}
          role="document"
          type="application/pdf"
          name="pdf-viewer"
          onLoad={() => onLoad(version)}
          className={version.ready ? 'z-0' : '-z-1'}
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
