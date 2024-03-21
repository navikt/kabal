import { CheckmarkCircleIcon, CogRotationIcon } from '@navikt/aksel-icons';
import { Button, InternalHeader } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { css, styled } from 'styled-components';
import { VERSION_CHECKER } from './version-checker';

export const VersionCheckerStatus = () => {
  const [isUpToDate, setIsUpToDate] = useState(true);

  useEffect(() => {
    if (process.env.VERSION === 'dev') {
      return;
    }

    VERSION_CHECKER.onOutdatedVersion(setIsUpToDate);
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
