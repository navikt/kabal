import { RichText_V0_SmartEditor, RichText_V0_Text } from './v0';
import { RichText_V1_SmartEditor, RichText_V1_Text } from './v1';
import { RichText_V2_SmartEditor, RichText_V2_Text } from './v2';

export type VersionedSmartEditor = RichText_V0_SmartEditor | RichText_V1_SmartEditor | RichText_V2_SmartEditor;

export type VersionedText = RichText_V0_Text | RichText_V1_Text | RichText_V2_Text;
