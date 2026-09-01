import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

interface Props {
  /** To tie the error to a field with aria-describedby */
  id: string;
  /** The error text */
  children: string;
}

export const FieldError = ({ id, children }: Props) => (
  <p
    id={id}
    aria-relevant="additions removals"
    aria-live="polite"
    className="flex items-center gap-1 font-ax-bold text-ax-text-danger-subtle leading-5"
  >
    <ExclamationmarkTriangleFillIcon
      aria-hidden
      role="presentation"
      className="mt-[0.15em] w-4 shrink-0 self-start p-[1.8px]"
    />
    {children}
  </p>
);
