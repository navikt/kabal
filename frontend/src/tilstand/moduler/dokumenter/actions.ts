import { createAction } from '@reduxjs/toolkit';
import { IDokumenterParams } from './types';

export const hentDokumenter = createAction<IDokumenterParams>('dokumenter/HENT');
export const nullstillOgHentDokumenter = createAction<IDokumenterParams>('dokumenter/HENT_FILTRERTE_DOKUMENTER');
export const hentTilknyttedeDokumenter = createAction<string>('dokumenter/HENT_TILKNYTTEDE');
