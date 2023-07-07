import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props {
  url: string;
  version: number;
  onVersionLoaded: () => void;
}

export const NoFlickerReloadPdf = ({ url, version, onVersionLoaded }: Props) => {
  const [versionMap, setVersionMap] = useState<Map<string, { versions: number[]; readyIndex: number }>>(
    new Map([[url, { versions: [version], readyIndex: 0 }]])
  );

  useEffect(() => {
    const data = versionMap.get(url);

    if (typeof data === 'undefined') {
      setVersionMap(new Map([...versionMap, [url, { versions: [version], readyIndex: 0 }]]));
    } else if (!data.versions.includes(version)) {
      setVersionMap(new Map([...versionMap, [url, { ...data, versions: [...data.versions, version] }]]));
    }
  }, [url, version, versionMap]);

  const onLoad = useCallback(
    (index: number, loadedUrl: string) => {
      setTimeout(
        () =>
          requestAnimationFrame(() => {
            setVersionMap((map) => {
              const data = map.get(loadedUrl);

              if (typeof data === 'undefined') {
                return map;
              }

              const { readyIndex } = data;

              if (index > readyIndex) {
                return new Map([...map, [loadedUrl, { ...data, readyIndex: index }]]);
              }

              return map;
            });
            onVersionLoaded();
          }),
        3000
      );
    },
    [onVersionLoaded]
  );

  const data = versionMap.get(url);

  if (data === undefined) {
    return null;
  }

  return (
    <StyledSwitcher>
      {data.versions.map((v, index) => {
        const current = index === data.readyIndex;
        const render = current || index > data.readyIndex;

        if (!render) {
          return null;
        }

        return (
          <StyledPDF
            key={v}
            aria-hidden={!current}
            data={`${url}?version=${v}#toolbar=1&view=fitH&zoom=page-width`}
            role="document"
            type="application/pdf"
            name="pdf-viewer"
            onLoad={() => onLoad(index, url)}
            $current={current}
          />
        );
      })}
    </StyledSwitcher>
  );
};

const StyledPDF = styled.object<{ $current: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  flex-grow: 1;
  z-index: ${({ $current }) => ($current ? 0 : -1)};
`;

const StyledSwitcher = styled.div`
  position: relative;
  width: 100%;
  flex-grow: 1;
`;
