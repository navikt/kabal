/** Polls until `condition` holds. Throws after `timeoutMs`. */
export const waitFor = async (condition: () => boolean | Promise<boolean>, timeoutMs = 2_000): Promise<void> => {
  const deadline = Date.now() + timeoutMs;

  while (!(await condition())) {
    if (Date.now() > deadline) {
      throw new Error('Timed out');
    }

    await Bun.sleep(5);
  }
};
