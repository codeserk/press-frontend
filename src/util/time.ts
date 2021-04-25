/**
 * Waits the given seconds.
 * @param seconds
 * @returns
 */
export async function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}
