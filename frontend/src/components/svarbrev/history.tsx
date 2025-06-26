import { StaticDataContext } from '@app/components/app/static-data-context';
import {
  type ChangeSet,
  getChangeSets,
  getChangeSetText,
  type InitialVersion,
} from '@app/components/svarbrev/change-sets';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useGetSvarbrevSettingHistoryQuery } from '@app/redux-api/svarbrev';
import { ClockDashedIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, Modal, Skeleton, Tooltip, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

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
          <VStack margin="0" padding="0" gap="2 0" style={{ listStyle: 'none' }}>
            {isLoading ? (
              <SkeletinListItems />
            ) : (
              changeSets.map((changeSet) => <HistoryEntry {...changeSet} key={changeSet.id} />)
            )}
          </VStack>
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

const HistoryEntry = (changeSet: InitialVersion | ChangeSet) => {
  const { user } = useContext(StaticDataContext);
  const isMine = user.navIdent === changeSet.modifiedBy.navIdent;
  const backgroundColor = isMine ? 'surface-alt-3-moderate' : 'surface-warning-moderate';

  return (
    <StyledEntry $backgroundColor={backgroundColor}>
      <HStack align="start" justify="space-between" marginBlock="0 2">
        <HStack asChild align="center" gap="1" paddingInline="0 2" paddingBlock="0 05">
          <Box
            as="span"
            background={backgroundColor}
            borderRadius="0 0 medium 0"
            style={{ fontWeight: 'normal', fontSize: 'var(--a-spacing-4)' }}
          >
            {changeSet.modifiedBy.navn} ({changeSet.modifiedBy.navIdent})
          </Box>
        </HStack>
        <EntryTime dateTime={changeSet.modified}>{isoDateTimeToPretty(changeSet.modified)}</EntryTime>
      </HStack>
      <VStack gap="1" paddingInline="2">
        {getChangeSetText(changeSet)}
      </VStack>
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

const EntryTime = styled.time`
  font-size: var(--a-font-size-small);
  font-weight: normal;
  font-style: italic;
  line-height: 1;
  padding-top: var(--a-spacing-05);
  padding-right: 3px;
`;
