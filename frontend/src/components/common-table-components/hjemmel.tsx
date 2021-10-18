import React from 'react';
import { useHjemmelFromId } from '../../hooks/use-kodeverk-ids';
import { LabelMain } from '../../styled-components/labels';

interface Props {
  hjemmel: string;
}

export const Hjemmel = ({ hjemmel }: Props) => <LabelMain>{useHjemmelFromId(hjemmel)}</LabelMain>;
