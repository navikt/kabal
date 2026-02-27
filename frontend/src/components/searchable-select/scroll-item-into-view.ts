export const scrollItemIntoView = (list: HTMLElement | null, index: number) => {
  if (list === null) {
    return;
  }

  const item = list.querySelector(`[data-index="${index}"]`);

  if (item instanceof HTMLElement) {
    item.scrollIntoView({ block: 'nearest' });
  }
};
