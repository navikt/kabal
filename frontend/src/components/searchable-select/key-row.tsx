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
          className="bg-ax-bg-neutral-moderate text-ax-small inline-block rounded-sm px-1.5 py-0.5 text-center font-mono"
        >
          {s}
        </kbd>
      ))}
    </dt>

    <dd className="py-0.5">{description}</dd>
  </>
);
