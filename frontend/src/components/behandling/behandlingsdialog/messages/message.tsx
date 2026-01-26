import { StaticDataContext } from '@app/components/app/static-data-context';
import { PRETTY_FORMAT, PRETTY_TIME } from '@app/components/date-picker/constants';
import { toast } from '@app/components/toast/store';
import { isoDateTimeToPretty } from '@app/domain/date';
import { formatEmployeeName } from '@app/domain/employee-name';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { KABAL_API_BASE_PATH } from '@app/redux-api/common';
import type { IMessage } from '@app/redux-api/messages';
import { BellFillIcon, BellIcon } from '@navikt/aksel-icons';
import { BodyLong, Box, type BoxProps, Button, HStack, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { format, isToday } from 'date-fns';
import { useContext, useState } from 'react';

interface Props extends IMessage {
  mine: boolean;
  isFirst: boolean;
  background: BoxProps['background'];
  borderRadius: BoxProps['borderRadius'];
}

export const Message = ({
  mine,
  isFirst,
  id,
  author,
  created,
  modified,
  notify,
  text,
  background,
  borderRadius,
}: Props) => (
  <Box
    key={id}
    borderRadius={borderRadius}
    paddingBlock="space-8"
    paddingInline={getPaddingInline(mine, notify)}
    background={background}
    borderColor="neutral-subtle"
    borderWidth="1"
    position="relative"
    width="fit-content"
    maxWidth="100%"
    minWidth="80px"
    className="group/bubble opacity-100 starting:opacity-0 duration-200"
  >
    {isFirst ? (
      <MessageHeader author={author} created={created} mine={mine} />
    ) : (
      <MessageTime created={created} mine={mine} background={background} />
    )}

    <BodyLong size="small" className="wrap-break-word whitespace-pre-line">
      {text}
    </BodyLong>

    <HStack
      position="absolute"
      top="space-0"
      left={mine ? 'space-0' : undefined}
      right={mine ? undefined : 'space-0'}
      bottom="space-0"
      align="center"
    >
      <Notify id={id} created={created} modified={modified} notify={notify} mine={mine} />
    </HStack>
  </Box>
);

const getPaddingInline = (mine: boolean, notify: boolean): BoxProps['paddingInline'] => {
  if (!mine && !notify) {
    return 'space-8';
  }

  return mine ? 'space-28 space-8' : 'space-8 space-28';
};

interface MessageHeaderProps extends Pick<IMessage, 'author' | 'created'> {
  mine: boolean;
}

const MessageHeader = ({ author, created }: MessageHeaderProps) => {
  const { user } = useContext(StaticDataContext);
  const name = author.navIdent === user.navIdent ? 'Meg' : formatEmployeeName(author);

  return (
    <HStack asChild wrap={false} align="center" justify="space-between" gap="space-8">
      <h1 className="mb-2 overflow-hidden text-ax-small">
        <Tooltip content={name}>
          <span className="truncate text-ax-text-neutral-subtle">{name}</span>
        </Tooltip>

        <HStack
          wrap={false}
          align="center"
          gap="space-4"
          flexShrink="0"
          className="shrink-0 text-ax-small text-ax-text-neutral-subtle"
        >
          <Tooltip content={isoDateTimeToPretty(created) ?? created}>
            <time dateTime={created}>{displayTime(created)}</time>
          </Tooltip>
        </HStack>
      </h1>
    </HStack>
  );
};

interface MessageTimeProps extends Pick<IMessage, 'created'> {
  mine: boolean;
  background: BoxProps['background'];
}

const MessageTime = ({ created, mine, background }: MessageTimeProps) => (
  <HStack
    asChild
    wrap={false}
    position="absolute"
    top="space-0"
    align="center"
    gap="space-4"
    flexShrink="0"
    className={mine ? '-right-0.5 flex-row-reverse' : '-left-0.5'}
  >
    <Box
      paddingInline="space-4"
      borderRadius="4"
      background={background}
      shadow="dialog"
      className="-translate-y-full text-ax-text-neutral-subtle opacity-0 transition-opacity duration-200 group-hover/bubble:opacity-100"
    >
      <Tooltip content={isoDateTimeToPretty(created) ?? created}>
        <time dateTime={created}>{displayTime(created)}</time>
      </Tooltip>
    </Box>
  </HStack>
);

enum Placement {
  LEFT = 'left',
  RIGHT = 'right',
}

interface NotifyProps extends Pick<IMessage, 'notify' | 'id' | 'created' | 'modified'> {
  mine: boolean;
}

const Notify = ({ notify, id, created, modified, mine }: NotifyProps) => {
  const placement = mine ? Placement.LEFT : Placement.RIGHT;

  if (notify) {
    return <MessageNotification at={modified ?? created} placement={placement} />;
  }

  return mine ? <SendNotificationButton id={id} placement={placement} /> : null;
};

interface SendNotificationButtonProps extends Pick<IMessage, 'id'> {
  placement: Placement;
}

const SendNotificationButton = ({ id, placement }: SendNotificationButtonProps) => {
  const behandlingId = useOppgaveId();
  const isTildeltSaksbehandler = useIsTildeltSaksbehandler();
  const disabled = behandlingId === skipToken;
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    if (disabled) {
      return;
    }

    try {
      setIsLoading(true);
      await sendNotification(behandlingId, id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip
      content={isTildeltSaksbehandler ? 'Send varsel til deg selv' : 'Send varsel til saksbehandler'}
      placement={placement}
      describesChild
    >
      <Button
        data-color="neutral"
        variant="tertiary"
        size="xsmall"
        onClick={onClick}
        className={`h-full cursor-pointer ${placement === Placement.RIGHT ? 'rounded-l-none' : 'rounded-r-none'} opacity-0 transition-opacity duration-200 group-hover/bubble:opacity-100`}
        loading={isLoading}
        icon={<BellIcon aria-hidden className="text-ax-medium" />}
      />
    </Tooltip>
  );
};

const NOTIFICATION_FAILED_TO_SEND_ERROR = 'Kunne ikke sende varsel. Vennligst prøv igjen.';

const sendNotification = async (behandlingId: string, messageId: IMessage['id']) => {
  try {
    const response = await fetch(`${KABAL_API_BASE_PATH}/behandlinger/${behandlingId}/meldinger/${messageId}/notify`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      toast.success('Varsel sendt.');
    } else {
      toast.error(NOTIFICATION_FAILED_TO_SEND_ERROR);
    }
  } catch (e) {
    console.error('Failed to send notification for message', e);
    toast.error(NOTIFICATION_FAILED_TO_SEND_ERROR);
  }
};

const displayTime = (date: string) => format(date, isToday(new Date(date)) ? PRETTY_TIME : PRETTY_FORMAT);

interface MessageNotificationProps {
  at: string;
  placement: Placement;
}

const MessageNotification = ({ at, placement }: MessageNotificationProps) => (
  <Tooltip content={`Varsel ble sendt ${isoDateTimeToPretty(at)}`} placement={placement} describesChild>
    <HStack align="center" height="100%" paddingInline="space-2">
      <BellFillIcon aria-hidden role="presentation" className="text-ax-medium" />
    </HStack>
  </Tooltip>
);
