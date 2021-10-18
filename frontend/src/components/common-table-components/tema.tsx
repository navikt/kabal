import React from 'react';
import { useTemaFromId } from '../../hooks/use-kodeverk-ids';
import { LabelTema } from '../../styled-components/labels';

interface Props {
  tema: string;
}

export const Tema = ({ tema }: Props) => <LabelTema tema={tema}>{useTemaFromId(tema)}</LabelTema>;
