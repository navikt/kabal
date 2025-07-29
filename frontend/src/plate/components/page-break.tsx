import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { UNCHANGEABLE } from '@app/plate/plugins/element-types';
import type { PageBreakElement } from '@app/plate/types';
import { TrashIcon } from '@navikt/aksel-icons';
import { BoxNew, Button } from '@navikt/ds-react';
import type { PlateEditor } from '@platejs/core/react';
import { ElementApi, type NodeEntry } from 'platejs';
import { PlateElement, type PlateElementProps } from 'platejs/react';

const parentIsUnchangeable = (editor: PlateEditor, entry: NodeEntry<PageBreakElement> | undefined): boolean => {
  if (entry === undefined) {
    return true;
  }

  const [, path] = entry;

  const parentEntry = editor.api.parent(path);

  if (parentEntry === undefined) {
    return true;
  }

  const [parentNode, parentNodePath] = parentEntry;

  // Used to be isEditor(parentNode), but isEditor is unavailable for parentNode
  if (parentNodePath.length === 0) {
    return false;
  }

  if (!ElementApi.isElement(parentNode)) {
    return true;
  }

  return UNCHANGEABLE.includes(parentNode.type);
};

export const PageBreak = (props: PlateElementProps<PageBreakElement>) => {
  const { children, element, editor } = props;
  const entry = editor.api.node<PageBreakElement>({ at: [], match: (n) => n === element });

  const disableDelete = parentIsUnchangeable(editor, entry);

  const onClick = () => {
    if (entry === undefined) {
      return;
    }

    const [, path] = entry;

    editor.tf.removeNodes({ at: path });
  };

  return (
    <PlateElement<PageBreakElement> {...props} as="div" attributes={{ ...props.attributes, contentEditable: false }}>
      <BoxNew
        background="default"
        position="relative"
        height={`calc(var(${EDITOR_SCALE_CSS_VAR}) + 1px)`}
        style={{
          height: `calc(var(${EDITOR_SCALE_CSS_VAR}) * 8mm)`,
          marginBlock: `calc(var(${EDITOR_SCALE_CSS_VAR}) * 20mm)`,
          marginInline: `calc((var(${EDITOR_SCALE_CSS_VAR}) * -20mm) - var(--ax-space-16))`,
        }}
        className={`group ${BEFORE_CLASSES} ${AFTER_CLASSES}`}
      >
        {disableDelete ? null : (
          <Button
            onClick={onClick}
            title="Fjern sideskift"
            variant="tertiary-neutral"
            size="xsmall"
            icon={<TrashIcon aria-hidden />}
            className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-1 w-fit grow-0 self-center opacity-0 transition-opacity duration-200 ease-in-out focus:opacity-100 group-hover:opacity-100"
          >
            Fjern sideskift
          </Button>
        )}
        {children}
      </BoxNew>
    </PlateElement>
  );
};

const BEFORE_CLASSES =
  'before:absolute before:top-0 before:right-4 before:left-4 before:h-[10px] before:bg-gradient-to-b before:from-[rgba(0,0,0,0.15)] before:to-transparent';
const AFTER_CLASSES =
  'after:absolute after:bottom-0 after:right-4 after:left-4 after:h-[10px] after:bg-gradient-to-t after:from-[rgba(0,0,0,0.15)] after:to-transparent';
