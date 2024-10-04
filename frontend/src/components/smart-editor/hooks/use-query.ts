import { SkipToken, skipToken } from '@reduxjs/toolkit/query';
import { useContext, useMemo } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { GLOBAL, LIST_DELIMITER, SET_DELIMITER, WILDCARD_TYPE } from '@app/components/smart-editor-texts/types';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { TemplateSections } from '@app/plate/template-sections';
import {
  GOD_FORMULERING_TYPE,
  IGetConsumerGodFormuleringParams,
  IGetConsumerHeaderFooterParams,
  IGetConsumerMaltekstseksjonerParams,
  IGetConsumerRegelverkParams,
  IGetConsumerTextsParams,
  PlainTextTypes,
  REGELVERK_TYPE,
  TextTypes,
} from '@app/types/common-text-types';
import { UtfallEnum } from '@app/types/kodeverk';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Language, UNTRANSLATED } from '@app/types/texts/language';

interface Params {
  templateId?: TemplateIdEnum;
  section?: string;
  includeEnhet?: boolean;
  textType: TextTypes;
  language?: Language | typeof UNTRANSLATED;
}

/** Deprecated
 * @deprecated Remove when no longer in use by legacy (redigerbar) maltekst.
 */
export const useQuery = ({ textType, templateId, section, language, includeEnhet = false }: Params) => {
  const { data: oppgave, isLoading } = useOppgave();
  const { user } = useContext(StaticDataContext);
  const defaultLanguagae = useSmartEditorLanguage();

  return useMemo<IGetConsumerTextsParams | typeof skipToken>(() => {
    if (isLoading || oppgave === undefined) {
      return skipToken;
    }

    const { extraUtfallIdSet, utfallId } = oppgave.resultat;

    const templateSectionList =
      templateId !== undefined && section !== undefined
        ? [`${templateId}${LIST_DELIMITER}${section}`, `${GLOBAL}${LIST_DELIMITER}${section}`]
        : [];

    const query: IGetConsumerTextsParams = {
      ytelseHjemmelIdList: getYtelseHjemmelList(oppgave.ytelseId, oppgave.resultat.hjemmelIdSet),
      utfallIdList: getUtfallList(extraUtfallIdSet, utfallId),
      enhetIdList: includeEnhet ? [user.ansattEnhet.id] : undefined,
      templateSectionIdList: templateSectionList,
      textType,
      language: language ?? defaultLanguagae,
    };

    return query;
  }, [
    isLoading,
    oppgave,
    templateId,
    section,
    includeEnhet,
    user.ansattEnhet.id,
    textType,
    language,
    defaultLanguagae,
  ]);
};

export const useHeaderFooterQuery = (textType: PlainTextTypes): IGetConsumerHeaderFooterParams | SkipToken => {
  const { user } = useContext(StaticDataContext);
  const language = useSmartEditorLanguage();

  return useMemo<IGetConsumerHeaderFooterParams>(
    () => ({ textType, enhetIdList: [user.ansattEnhet.id], language }),
    [textType, user.ansattEnhet.id, language],
  );
};

export const useMaltekstseksjonQuery = (
  templateId: TemplateIdEnum,
  section: TemplateSections,
): IGetConsumerMaltekstseksjonerParams | SkipToken => {
  const { data: oppgave, isLoading } = useOppgave();

  return useMemo<IGetConsumerMaltekstseksjonerParams | SkipToken>(() => {
    if (isLoading || oppgave === undefined) {
      return skipToken;
    }

    const { extraUtfallIdSet, utfallId } = oppgave.resultat;

    return {
      ytelseHjemmelIdList: getYtelseHjemmelList(oppgave.ytelseId, oppgave.resultat.hjemmelIdSet),
      utfallIdList: getUtfallList(extraUtfallIdSet, utfallId),
      templateSectionIdList: [`${templateId}${LIST_DELIMITER}${section}`, `${GLOBAL}${LIST_DELIMITER}${section}`],
    };
  }, [isLoading, oppgave, templateId, section]);
};

export const useGodFormuleringerQuery = (
  templateId: TemplateIdEnum,
  section: TemplateSections | WILDCARD_TYPE,
): IGetConsumerGodFormuleringParams | SkipToken => {
  const { data: oppgave, isLoading } = useOppgave();
  const language = useSmartEditorLanguage();

  return useMemo<IGetConsumerGodFormuleringParams | SkipToken>(() => {
    if (isLoading || oppgave === undefined) {
      return skipToken;
    }

    const { extraUtfallIdSet, utfallId } = oppgave.resultat;

    return {
      ytelseHjemmelIdList: getYtelseHjemmelList(oppgave.ytelseId, oppgave.resultat.hjemmelIdSet),
      utfallIdList: getUtfallList(extraUtfallIdSet, utfallId),
      templateSectionIdList: [`${templateId}${LIST_DELIMITER}${section}`, `${GLOBAL}${LIST_DELIMITER}${section}`],
      textType: GOD_FORMULERING_TYPE,
      language,
    };
  }, [isLoading, oppgave, templateId, section, language]);
};

export const useRegelverkQuery = (): IGetConsumerRegelverkParams | SkipToken => {
  const { data: oppgave, isLoading } = useOppgave();

  return useMemo<IGetConsumerRegelverkParams | SkipToken>(() => {
    if (isLoading || oppgave === undefined) {
      return skipToken;
    }

    const { extraUtfallIdSet, utfallId } = oppgave.resultat;

    return {
      ytelseHjemmelIdList: getYtelseHjemmelList(oppgave.ytelseId, oppgave.resultat.hjemmelIdSet),
      utfallIdList: getUtfallList(extraUtfallIdSet, utfallId),
      textType: REGELVERK_TYPE,
      language: UNTRANSLATED,
    };
  }, [isLoading, oppgave]);
};

const getYtelseHjemmelList = (ytelse: string, hjemmelList: string[]): string[] => {
  const result: string[] = [ytelse];

  for (const hjemmel of hjemmelList) {
    result.push(`${ytelse}${LIST_DELIMITER}${hjemmel}`, `${GLOBAL}${LIST_DELIMITER}${hjemmel}`);
  }

  return result;
};

const getUtfallList = (extraUtfallIdSet: UtfallEnum[], utfallId: UtfallEnum | null): string => {
  const utfallSet: Set<UtfallEnum> = utfallId === null ? new Set([]) : new Set([utfallId]);

  for (const item of extraUtfallIdSet) {
    utfallSet.add(item);
  }

  return utfallSet.size === 0 ? '' : Array.from(utfallSet).sort().join(SET_DELIMITER);
};
