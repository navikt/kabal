import { toast } from '@app/components/toast/store';
import { Toast } from '@app/components/toast/toast/toast';
import type { Message } from '@app/components/toast/types';
import { VStack } from '@navikt/ds-react';
import { useEffect, useRef, useState } from 'react';

export const Toasts = () => {
  const [toasts, setToasts] = useState<Message[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const previousLength = useRef(0);

  useEffect(() => toast.subscribe(setToasts), []);

  useEffect(() => {
    if (toasts.length > previousLength.current) {
      const { current } = ref;

      if (current !== null) {
        current.scrollTop = current.scrollHeight;
      }
    }
    previousLength.current = toasts.length;
  }, [toasts.length]);

  const toastList = toasts.map((props) => <Toast key={props.id} {...props} />);

  return (
    <VStack
      position="fixed"
      bottom="2"
      right="0"
      gap="2 0"
      paddingInline="0 2"
      marginBlock="2 0"
      maxHeight="calc(100% - var(--ax-space-16))"
      overflowY="auto"
      overflowX="visible"
      className="z-1000"
      ref={ref}
      aria-live="polite"
      aria-relevant="additions text"
    >
      {toastList}
    </VStack>
  );
};
