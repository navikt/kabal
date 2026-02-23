import { LedigeSakerITRTable } from '@/components/saker-i-tr/ledige';
import { SakerITRPåVentTable } from '@/components/saker-i-tr/på-vent';
import { TildelteSakerITRTable } from '@/components/saker-i-tr/tildelte';
import { OppgaverPageWrapper } from '../page-wrapper';

export const SakerITRPage = () => (
  <OppgaverPageWrapper title="Saker i Trygderetten">
    <TildelteSakerITRTable />
    <SakerITRPåVentTable />
    <LedigeSakerITRTable />
  </OppgaverPageWrapper>
);
