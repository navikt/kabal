import type { KabalValue } from '@/plate/types';
import type { INavEmployee } from '@/types/bruker';

export enum HistorySource {
  API = 'api',
  LOCAL = 'local',
}

interface BaseEntry {
  author: INavEmployee | null;
  /** ISO datetime string used for sorting and display. */
  timestamp: string;
}

export interface ApiHistoryEntry extends BaseEntry {
  source: HistorySource.API;
  version: number;
}

export interface LocalHistoryEntry extends BaseEntry {
  source: HistorySource.LOCAL;
  /** Full localStorage key — uniquely identifies this entry. */
  key: string;
  content: KabalValue;
}

export type HistoryEntry = ApiHistoryEntry | LocalHistoryEntry;
