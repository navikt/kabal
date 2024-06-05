import { CheckmarkCircleIcon, CogRotationIcon } from '@navikt/aksel-icons';
import { Button, InternalHeader } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { css, styled } from 'styled-components';
import { ENVIRONMENT } from '@app/environment';
import { VERSION_CHECKER } from './version-checker';

export const VersionCheckerStatus = () => {
  const [isUpToDate, setIsUpToDate] = useState(true);

  useEffect(() => {
    if (ENVIRONMENT.isLocal) {
      return;
    }

    VERSION_CHECKER.addListener(setIsUpToDate);

    return () => {
      VERSION_CHECKER.removeListener(setIsUpToDate);
    };
  }, []);

  if (isUpToDate) {
    return <Version />;
  }

  return (
    <InternalHeader.Button
      as={UpdateButton}
      title="Det finnes en ny versjon av Kabal. Versjonen du ser på nå er ikke siste versjon. Trykk her for å laste siste versjon."
      onClick={() => window.location.reload()}
      size="small"
      data-testid="update-kabal-button"
    >
      <CogRotationIcon /> Oppdater til siste versjon
    </InternalHeader.Button>
  );
};

const Version = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => setShow(false), 20 * 1000);
  }, [setShow]);

  if (!show) {
    return null;
  }

  return (
    <InternalHeader.Title as="div">
      <IconText>
        <CheckmarkCircleIcon /> Kabal er klar til bruk!
      </IconText>
    </InternalHeader.Title>
  );
};

const iconText = css`
  display: flex;
  gap: 8px;
  align-items: center;
  white-space: nowrap;
`;

const IconText = styled.span`
  ${iconText}
  color: #fff;
`;

const UpdateButton = styled(Button)`
  ${iconText}
`;
