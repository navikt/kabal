import { AutomaticSystem, Success } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import { Header } from '@navikt/ds-react-internal';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { VersionChecker } from './version-checker';

export const VersionCheckerStatus = () => {
  const [needsUpdate, setNeedsUpdate] = useState(false);

  useEffect(() => {
    if (process.env.VERSION === 'dev') {
      return;
    }

    const versionChecker = new VersionChecker(setNeedsUpdate);

    return () => versionChecker.close();
  }, []);

  if (!needsUpdate) {
    return <Version />;
  }

  return (
    <Header.Button
      as={UpdateButton}
      title="Det finnes en ny versjon av KABAL. Versjonen du ser på nå er ikke siste versjon. Trykk her for å laste siste versjon."
      onClick={() => window.location.reload()}
      size="small"
      data-testid="update-kabal-button"
    >
      <AutomaticSystem /> Oppdater til siste versjon
    </Header.Button>
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
    <Header.Title as="div">
      <IconText>
        <Success /> KABAL er klar til bruk!
      </IconText>
    </Header.Title>
  );
};

const iconText = css`
  & {
    display: flex;
    gap: 8px;
    align-items: center;
    white-space: nowrap;
  }
`;

const IconText = styled.span`
  ${iconText}
  color: #fff;
`;

const UpdateButton = styled(Button)`
  ${iconText}
`;
