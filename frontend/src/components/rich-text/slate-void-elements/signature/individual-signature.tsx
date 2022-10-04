import React from 'react';
import { ISignature } from '../../types/editor-void-types';
import { Title } from './title';

interface Props {
  signature: ISignature | undefined;
}

export const IndividualSignature = ({ signature }: Props) => {
  if (typeof signature === 'undefined') {
    return null;
  }

  return (
    <div>
      <div>{signature.name}</div>
      <Title title={signature.title} />
    </div>
  );
};
