import React from 'react';
import { useInnsendingshjemmelFromId } from '../../hooks/use-kodeverk-ids';
import { LabelMain } from '../../styled-components/labels';

interface Props {
  hjemmel: string;
}

export const Hjemmel = ({ hjemmel }: Props) => <LabelMain>{useInnsendingshjemmelFromId(hjemmel)}</LabelMain>;
