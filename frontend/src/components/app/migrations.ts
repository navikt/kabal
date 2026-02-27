const KLAGE_FILE_VIEWER_SCALE_MODE_KEY = 'klage-file-viewer/settings/scale/mode';
const KLAGE_FILE_VIEWER_SCALE_VALUE_KEY = 'klage-file-viewer/settings/scale/value';

/**
 * Migrate PDF scale settings from the old per-user localStorage keys to the
 * keys used internally by `@navikt/klage-file-viewer`.
 *
 * The old keys are scoped per user (`{navIdent}/pdf/new_tab/scale_mode` and
 * `{navIdent}/pdf/new_tab/custom_scale`). The new keys are global.
 *
 * Old scale mode was stored as a JSON string (e.g. `"page-fit"` with quotes),
 * so it needs to be JSON-parsed before writing to the new key.
 * Old custom scale was stored as a plain number string (e.g. `125`), which
 * matches the new format directly.
 *
 * This function is safe to call multiple times — it only migrates if the old
 * keys exist and removes them after migration.
 */
export const runMigrations = (navIdent: string): void => {
  migratePdfScale(navIdent);
};

const migratePdfScale = (navIdent: string): void => {
  const oldScaleModeKey = `${navIdent}/pdf/new_tab/scale_mode`;
  const oldCustomScaleKey = `${navIdent}/pdf/new_tab/custom_scale`;

  const oldScaleModeRaw = localStorage.getItem(oldScaleModeKey);
  const oldCustomScale = localStorage.getItem(oldCustomScaleKey);

  if (oldScaleModeRaw !== null) {
    // Only migrate if the new key has not already been set.
    if (localStorage.getItem(KLAGE_FILE_VIEWER_SCALE_MODE_KEY) === null) {
      try {
        const parsed: unknown = JSON.parse(oldScaleModeRaw);

        if (typeof parsed === 'string') {
          localStorage.setItem(KLAGE_FILE_VIEWER_SCALE_MODE_KEY, parsed);
        }
      } catch {
        // If it's not valid JSON, use the raw value as-is.
        localStorage.setItem(KLAGE_FILE_VIEWER_SCALE_MODE_KEY, oldScaleModeRaw);
      }
    }

    localStorage.removeItem(oldScaleModeKey);
  }

  if (oldCustomScale !== null) {
    if (localStorage.getItem(KLAGE_FILE_VIEWER_SCALE_VALUE_KEY) === null) {
      localStorage.setItem(KLAGE_FILE_VIEWER_SCALE_VALUE_KEY, oldCustomScale);
    }

    localStorage.removeItem(oldCustomScaleKey);
  }
};
