import type { SerializedError } from '@reduxjs/toolkit';
import { type FetchBaseQueryError, skipToken } from '@reduxjs/toolkit/query';
import { getInitalHandling } from '@/components/receivers/functions';
import { isNotNull } from '@/functions/is-not-type-guards';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useSearchPartWithUtsendingskanal } from '@/hooks/use-search-part-with-utsendingskanal';
import type { IMottaker } from '@/types/documents/documents';
import { isApiDataError } from '@/types/errors';
import { Brevmottakertype } from '@/types/kodeverk';
import { type IFullmektig, type IPart, PartStatusEnum, Utsendingskanal } from '@/types/oppgave-common';
import type { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export type ReachableMottaker = IMottaker & { reachable: true; brevmottakertyper: Brevmottakertype[] };

export type UnreachableMottaker = Omit<IMottaker, 'handling'> & {
  reachable: false;
  brevmottakertyper: Brevmottakertype[];
  handling: null;
};

export type IBrevmottaker = ReachableMottaker | UnreachableMottaker;

type SuggestionsLoading = { isLoading: true; brevmottakere: null; error: null };
type SuggestionsLoaded = { isLoading: false; brevmottakere: IBrevmottaker[]; error: null };
type SuggestionsFailed = { isLoading: false; brevmottakere: null; error: string };

type LookupError = SerializedError | FetchBaseQueryError;

type Skipped = { isUninitialized: true; isFetching: false; isError: false; isSuccess: false };
type Fetching = { isUninitialized: false; isFetching: true; isError: false; isSuccess: false };
type LookupFailed = { isUninitialized: false; isFetching: false; isError: true; isSuccess: false; error: LookupError };
// Utsendingskanal is null when the part should not receive letters: it does not exist, is dead or is avviklet
type Resolved = {
  isUninitialized: false;
  isFetching: false;
  isError: false;
  isSuccess: true;
  utsendingskanal: Utsendingskanal | null;
};
type UtsendingskanalResult = Skipped | Fetching | LookupFailed | Resolved;

type Args = {
  mottakerList: IMottaker[];
  templateId?: TemplateIdEnum | undefined;
};

export const useSuggestedBrevmottakere = (
  args: Args | typeof skipToken,
): SuggestionsLoading | SuggestionsLoaded | SuggestionsFailed => {
  const { data, isSuccess: oppgaveIsSuccess } = useOppgave();

  const skip = args === skipToken || !oppgaveIsSuccess;
  const sgKanal = useUtsendingskanalForPart(skip ? skipToken : data?.sakenGjelder);
  const kKanal = useUtsendingskanalForPart(skip ? skipToken : data?.klager);
  const fmKanal = useUtsendingskanalForPart(skip ? skipToken : data?.prosessfullmektig);

  if (args === skipToken) {
    return { isLoading: false, brevmottakere: [], error: null };
  }

  if (sgKanal.isError || kKanal.isError || fmKanal.isError) {
    return { isLoading: false, brevmottakere: null, error: joinErrors([sgKanal, kKanal, fmKanal]) };
  }

  if (!oppgaveIsSuccess || !sgKanal.isSuccess || !kKanal.isSuccess || !fmKanal.isSuccess) {
    return { isLoading: true, brevmottakere: null, error: null };
  }

  const { mottakerList, templateId } = args;

  const { sakenGjelder, klager, prosessfullmektig: fullmektig } = data;

  const brevmottakere: IBrevmottaker[] = [
    partToBrevmottaker(sakenGjelder, sgKanal.utsendingskanal, Brevmottakertype.SAKEN_GJELDER, templateId),
    partToBrevmottaker(klager, kKanal.utsendingskanal, Brevmottakertype.KLAGER, templateId),
    partToBrevmottaker(fullmektig, fmKanal.utsendingskanal, Brevmottakertype.PROSESSFULLMEKTIG, templateId),
  ]
    .filter(isNotNull)
    .reduce<IBrevmottaker[]>((acc, curr) => {
      const found = acc.find(({ part }) => part.id === curr.part.id);

      if (found === undefined) {
        acc.push(curr);

        return acc;
      }

      found.brevmottakertyper.push(...curr.brevmottakertyper);

      return acc;
    }, [])
    .map((sm) => {
      if (!sm.reachable) {
        return sm;
      }

      const mottaker = mottakerList.find((m) => m.part.id === sm.part.id);

      return mottaker === undefined
        ? sm
        : { ...mottaker, brevmottakertyper: sm.brevmottakertyper, reachable: sm.reachable };
    });

  return { isLoading: false, brevmottakere, error: null };
};

const useUtsendingskanalForPart = (part: IPart | null | undefined | typeof skipToken): UtsendingskanalResult => {
  const { currentData, isFetching, error } = useSearchPartWithUtsendingskanal(
    part === skipToken || part === undefined || part === null || isDeadOrDeleted(part) ? skipToken : part.identifikator,
  );

  if (part === skipToken) {
    return SKIPPED;
  }

  // Behandling does not have this part, e.g. no fullmektig.
  if (part === undefined || part === null) {
    return resolved(null);
  }

  // A part without identifikator has a manually entered address and can only receive letters via sentral utskrift.
  if (part.identifikator === null) {
    return resolved(Utsendingskanal.SENTRAL_UTSKRIFT);
  }

  // Dead people and avviklede organisations cannot receive letters, so we do not look them up.
  if (isDeadOrDeleted(part)) {
    return resolved(null);
  }

  if (isFetching) {
    return FETCHING;
  }

  if (error !== undefined) {
    return { isUninitialized: false, isFetching: false, isError: true, isSuccess: false, error };
  }

  // Does not happen in practice after the checks above, but TypeScript does not know that.
  if (currentData === undefined) {
    return FETCHING;
  }

  return resolved(currentData.utsendingskanal);
};

const SKIPPED: Skipped = { isUninitialized: true, isFetching: false, isError: false, isSuccess: false };
const FETCHING: Fetching = { isUninitialized: false, isFetching: true, isError: false, isSuccess: false };

const resolved = (utsendingskanal: Utsendingskanal | null): Resolved => ({
  isUninitialized: false,
  isFetching: false,
  isError: false,
  isSuccess: true,
  utsendingskanal,
});

const isDeadOrDeleted = (part: IPart): boolean =>
  part.statusList?.some((s) => s.status === PartStatusEnum.DEAD || s.status === PartStatusEnum.DELETED) === true;

const joinErrors = (results: UtsendingskanalResult[]): string =>
  results
    .flatMap((r) => (r.isError ? [getErrorMessage(r.error)] : []))
    .filter((msg): msg is string => msg !== undefined)
    .join('; ');

export const getErrorMessage = (error: SerializedError | FetchBaseQueryError | undefined): string | undefined => {
  if (error === undefined) {
    return undefined;
  }

  if (isApiDataError(error)) {
    return `${error.data.title}${typeof error.data.detail === 'string' ? `: ${error.data.detail}` : ''}`;
  }

  return 'Ukjent feil';
};

const partToBrevmottaker = (
  part: IPart | IFullmektig | null,
  utsendingskanal: Utsendingskanal | null,
  brevmottakerType: Brevmottakertype,
  templateId: TemplateIdEnum | undefined,
): IBrevmottaker | null => {
  if (part === null) {
    return null;
  }

  if (utsendingskanal === null) {
    return { part, brevmottakertyper: [brevmottakerType], handling: null, overriddenAddress: null, reachable: false };
  }

  const handling = getInitalHandling(utsendingskanal, templateId);

  return { part, brevmottakertyper: [brevmottakerType], handling, overriddenAddress: null, reachable: true };
};
