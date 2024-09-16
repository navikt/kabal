import { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { toast } from '@app/components/toast/store';
import { Toast } from '@app/components/toast/toast/toast';
import { Message } from '@app/components/toast/types';

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
    <Container ref={ref} aria-live="polite" aria-relevant="additions text">
      {toastList}
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  bottom: 8px;
  right: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding-right: 8px;
  margin-right: 0;
  margin-bottom: 0;
  margin-top: 8px;
  max-height: calc(100% - 16px);
  overflow-y: auto;
  overflow-x: visible;
`;
