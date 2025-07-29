import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useCompleteMerkantilTaskMutation } from '@app/redux-api/internal';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { BoxNew, Button, Textarea, VStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';

interface Props {
  id: string;
  dateHandled: string | null;
}

export const Finish = ({ id, dateHandled }: Props) => {
  const [complete, { isLoading }] = useCompleteMerkantilTaskMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  if (dateHandled !== null) {
    return null;
  }

  return (
    <div className="relative" ref={ref}>
      <Button onClick={() => setIsOpen(!isOpen)} variant="primary" size="small" icon={<CheckmarkIcon aria-hidden />}>
        Fullfør med kommentar
      </Button>

      {isOpen ? (
        <BoxNew
          className="right-full z-1"
          top="0"
          position="absolute"
          background="default"
          width="400px"
          shadow="dialog"
          borderRadius="medium"
          padding="4"
          asChild
        >
          <VStack gap="2">
            <Textarea
              label="Kommentar"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              size="small"
              autoFocus
            />
            <Button
              onClick={async () => {
                await complete({ taskId: id, comment }).unwrap();

                setIsOpen(false);
                setComment('');
              }}
              loading={isLoading}
              variant="primary"
              size="small"
              icon={<CheckmarkIcon aria-hidden />}
            >
              Fullfør
            </Button>
          </VStack>
        </BoxNew>
      ) : null}
    </div>
  );
};
