import { SECTION_KEY } from '@app/functions/error-type-guard';

export const useSectionTitle = (sectionKey: SECTION_KEY): string => {
  switch (sectionKey) {
    case SECTION_KEY.BEHANDLING:
      return 'Behandling';
    case SECTION_KEY.KVALITETSVURDERING:
      return 'Kvalitetsvurdering';
    case SECTION_KEY.DOKUMENTER:
      return 'Dokumenter';
    default:
      return '';
  }
};
