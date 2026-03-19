import type { IMaltekstseksjon } from '@/types/maltekstseksjoner/responses';

export interface IDeleteDraftOrUnpublishTextResponse {
  maltekstseksjonVersions: {
    maltekstseksjonId: string;
    maltekstseksjonVersions: IMaltekstseksjon[];
  }[];
}
