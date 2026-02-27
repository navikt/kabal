interface KeyRowProps {
  shortcuts: string[];
  description: string;
}

export const KeyRow = ({ shortcuts, description }: KeyRowProps) => (
  <>
    <dt className="flex flex-row gap-2 py-0.5">
      {shortcuts.map((s) => (
        <kbd
          key={s}
          className="inline-block rounded-sm bg-ax-bg-neutral-moderate px-1.5 py-0.5 text-center font-mono text-ax-small"
        >
          {s}
        </kbd>
      ))}
    </dt>

    <dd className="py-0.5">{description}</dd>
  </>
);
