import React from 'react';
import { NewComment } from './new-comment';

interface Props {
  show: boolean;
  close: () => void;
}

export const NewCommentThread = ({ show, close }: Props) => {
  if (!show) {
    return null;
  }

  return <NewComment close={close} />;
};
