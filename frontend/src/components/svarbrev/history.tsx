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
import { Box, type BoxProps, Button, HStack, Modal, Skeleton, Tooltip, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

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
          data-color="neutral"
          as={Link}
          size="small"
          variant="secondary"
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
          <VStack margin="space-0" padding="space-0" gap="space-8 space-0" style={{ listStyle: 'none' }}>
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
  const backgroundColor: BoxProps['background'] = isMine ? 'meta-purple-moderate' : 'warning-moderate';
  const borderColor: BoxProps['borderColor'] = isMine ? 'meta-purple-subtle' : 'warning-subtle';

  return (
    <VStack
      asChild
      position="relative"
      overflow="hidden"
      style={{ ['--after-background-color' as string]: `var(--ax-bg-${backgroundColor})` }}
      className="before:absolute before:top-[-1px] before:bottom-[-1px] before:left-[-1px] before:w-1 before:rounded-l-sm before:bg-(--after-background-color)"
    >
      <Box
        as="li"
        borderColor={borderColor}
        borderRadius="4"
        borderWidth="1"
        paddingBlock="space-0 space-8"
        className="pl-[3px]"
      >
        <HStack align="start" justify="space-between" marginBlock="space-0 space-8">
          <HStack asChild align="center" gap="space-4" paddingInline="space-0 space-8" paddingBlock="space-0 space-2">
            <Box
              as="span"
              background={backgroundColor}
              borderRadius="0 0 8 0"
              style={{ fontWeight: 'normal', fontSize: 'var(--ax-space-16)' }}
            >
              {changeSet.modifiedBy.navn} ({changeSet.modifiedBy.navIdent})
            </Box>
          </HStack>

          <Box
            as="time"
            dateTime={changeSet.modified}
            paddingBlock="space-2 space-0"
            className="pr-[3px] font-normal text-ax-small italic leading-none"
          >
            {isoDateTimeToPretty(changeSet.modified)}
          </Box>
        </HStack>

        <VStack gap="space-4" paddingInline="space-8">
          {getChangeSetText(changeSet)}
        </VStack>
      </Box>
    </VStack>
  );
};
