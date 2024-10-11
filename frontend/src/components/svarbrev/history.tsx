import { ClockDashedIcon } from '@navikt/aksel-icons';
import { Button, Modal, Skeleton, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { ChangeSet, InitialVersion, getChangeSetText, getChangeSets } from '@app/components/svarbrev/change-sets';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useGetSvarbrevSettingHistoryQuery } from '@app/redux-api/svarbrev';

interface Props {
  id: string;
  isOpen: boolean;
  close: () => void;
}

export const SvarbrevSettingHistory = ({ id, isOpen, close }: Props) => {
  const { data = [], isLoading } = useGetSvarbrevSettingHistoryQuery(isOpen ? id : skipToken, {
    refetchOnMountOrArgChange: true,
  });
  const changeSets = getChangeSets(data);

  return (
    <>
      <Tooltip content="Vis endringshistorikk" placement="top">
        <Button
          as={Link}
          size="small"
          variant="secondary-neutral"
          icon={<ClockDashedIcon aria-hidden />}
          to={{
            pathname: `${id}/historikk`,
            search: window.location.search,
            hash: window.location.hash,
          }}
        />
      </Tooltip>
      <Modal open={isOpen} onClose={close} header={{ heading: 'Historikk' }} closeOnBackdropClick width={600}>
        <Modal.Body>
          <StyledEntryList>
            {isLoading ? (
              <SkeletinListItems />
            ) : (
              changeSets.map((changeSet) => <HistoryEntry {...changeSet} key={changeSet.id} />)
            )}
          </StyledEntryList>
        </Modal.Body>
      </Modal>
    </>
  );
};

const SkeletinListItems = () => (
  <>
    <SkeletonListItem />
    <SkeletonListItem />
    <SkeletonListItem />
  </>
);

const SkeletonListItem = () => (
  <li>
    <Skeleton variant="rounded" height={105} />
  </li>
);

const StyledEntryList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-2);
`;

const HistoryEntry = (changeSet: InitialVersion | ChangeSet) => {
  const { user } = useContext(StaticDataContext);
  const isMine = user.navIdent === changeSet.modifiedBy.navIdent;
  const backgroundColor = isMine ? 'var(--a-surface-alt-3-moderate)' : 'var(--a-surface-warning-moderate)';

  return (
    <StyledEntry $backgroundColor={backgroundColor}>
      <EntryHeader>
        <EntryLabel $backgroundColor={backgroundColor}>
          {changeSet.modifiedBy.navn} ({changeSet.modifiedBy.navIdent})
        </EntryLabel>
        <EntryTime dateTime={changeSet.modified}>{isoDateTimeToPretty(changeSet.modified)}</EntryTime>
      </EntryHeader>
      <EntryContent>{getChangeSetText(changeSet)}</EntryContent>
    </StyledEntry>
  );
};

interface ColorProps {
  $backgroundColor: string;
}

const StyledEntry = styled.li<ColorProps>`
  display: flex;
  flex-direction: column;
  border-radius: var(--a-border-radius-medium);
  border-width: 1px;
  border-style: solid;
  border-color: ${({ $backgroundColor }) => $backgroundColor};
  padding-bottom: var(--a-spacing-2);
  padding-right: 0;
  padding-left: 3px;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -1px;
    top: -1px;
    bottom: -1px;
    width: var(--a-spacing-1);
    background-color: ${({ $backgroundColor }) => $backgroundColor};
    border-top-left-radius: var(--a-border-radius-medium);
    border-bottom-left-radius: var(--a-border-radius-medium);
  }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--a-spacing-2);
`;

const EntryLabel = styled.span<ColorProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--a-spacing-1);
  padding-right: var(--a-spacing-2);
  padding-top: 0;
  padding-left: 0;
  padding-bottom: 1px;
  font-weight: normal;
  font-size: var(--a-spacing-4);
  border-bottom-right-radius: var(--a-border-radius-medium);
  background-color: ${({ $backgroundColor }) => $backgroundColor};
`;

const EntryTime = styled.time`
  font-size: var(--a-font-size-small);
  font-weight: normal;
  font-style: italic;
  line-height: 1;
  padding-top: var(--a-spacing-05);
  padding-right: 3px;
`;

const EntryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-1);
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
`;
