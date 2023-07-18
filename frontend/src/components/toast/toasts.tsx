import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { Message, toast } from './store';
import { Toast } from './toast';

export const Toasts = () => {
  const [toasts, setToasts] = useState<Message[]>([]);

  useEffect(() => {
    toast.subscribe(setToasts);

    return () => toast.unsubscribe(setToasts);
  }, []);

  const toastList = toasts.map((props) => <Toast key={props.id} {...props} />);

  return <Container>{toastList}</Container>;
};

const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  margin-right: 8px;
  margin-bottom: 8px;
  margin-top: 8px;
  max-height: calc(100% - 16px);
  overflow-y: auto;
  overflow-x: hidden;
`;
