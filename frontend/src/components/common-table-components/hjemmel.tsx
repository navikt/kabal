import React from 'react';
import { useInnsendingshjemmelFromId } from '@app/hooks/use-kodeverk-ids';
import { LabelMain } from '@app/styled-components/labels';

interface Props {
  hjemmel: string | null;
}

export const Hjemmel = ({ hjemmel }: Props) => <LabelMain>{useInnsendingshjemmelFromId(hjemmel)}</LabelMain>;
