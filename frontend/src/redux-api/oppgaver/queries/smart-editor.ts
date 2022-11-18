import { migrateFromV0ToV1 } from '../../../components/rich-text/migrations/v0';
import { migrateFromV1ToV2 } from '../../../components/rich-text/migrations/v1';
import { migrateRichTextV2ToV3 } from '../../../components/rich-text/migrations/v2';
import { migrateRichTextV3ToV4 } from '../../../components/rich-text/migrations/v3';
import { VERSION } from '../../../components/rich-text/version';
import { IOppgavebehandlingBaseParams } from '../../../types/oppgavebehandling/params';
import { RichText_Latest_SmartEditor } from '../../../types/rich-text/latest';
import { VersionedSmartEditor } from '../../../types/rich-text/versions';
import { IGetSmartEditorParams } from '../../../types/smart-editor/params';
import { ISmartEditor } from '../../../types/smart-editor/smart-editor';
import { NoTemplateIdEnum } from '../../../types/smart-editor/template-enums';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';

export const smartEditorQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getSmartEditors: builder.query<ISmartEditor[], IOppgavebehandlingBaseParams>({
      query: ({ oppgaveId }) => `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter`,
      transformResponse: (response: VersionedSmartEditor[]) => response.map(migrate),
    }),

    getSmartEditor: builder.query<ISmartEditor | null, IGetSmartEditorParams>({
      query: ({ oppgaveId, dokumentId }) => `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter/${dokumentId}`,
      transformResponse: (response: VersionedSmartEditor) => migrate(response),
    }),
  }),
});

export const { useGetSmartEditorsQuery, useGetSmartEditorQuery, useLazyGetSmartEditorQuery } = smartEditorQuerySlice;

const migrate = (smartEditor: VersionedSmartEditor): RichText_Latest_SmartEditor => {
  if (smartEditor.version === VERSION) {
    return smartEditor;
  }

  if (smartEditor.version === undefined || smartEditor.version === 0) {
    return migrate({
      ...smartEditor,
      ...migrateFromV0ToV1(smartEditor),
      templateId: smartEditor.templateId ?? NoTemplateIdEnum.NONE,
    });
  }

  if (smartEditor.version === 1) {
    return migrate({
      ...smartEditor,
      ...migrateFromV1ToV2(smartEditor),
    });
  }

  if (smartEditor.version === 2) {
    return migrate({
      ...smartEditor,
      ...migrateRichTextV2ToV3(smartEditor),
    });
  }

  if (smartEditor.version === 3) {
    return migrate({
      ...smartEditor,
      ...migrateRichTextV3ToV4(smartEditor),
    });
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`Unsupported version ${smartEditor.version ?? 0}`);
};
