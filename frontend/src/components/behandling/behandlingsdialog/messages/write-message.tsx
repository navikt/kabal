import { Knapp } from 'nav-frontend-knapper';
import { Textarea } from 'nav-frontend-skjema';
import React, { useState } from 'react';

export const WriteMessage = () => {
  const [newMessage, setNewMessage] = useState<string>('');

  const postMessage = () => {
    console.log('posting');
  };

  return (
    <>
      <Textarea label="Meldinger:" value={newMessage} onChange={({ target }) => setNewMessage(target.value)} />
      <Knapp onClick={() => postMessage()}>Send</Knapp>
    </>
  );
};
