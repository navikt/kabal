import { RichText_V0, RichText_V0_SmartEditor, RichText_V0_Text } from './v0';
import { RichText_V1, RichText_V1_SmartEditor, RichText_V1_Text } from './v1';

export type VersionedSmartEditor = RichText_V0_SmartEditor | RichText_V1_SmartEditor;

export type VersionedText = RichText_V0_Text | RichText_V1_Text;

export type VersionedRichText = RichText_V0 | RichText_V1;