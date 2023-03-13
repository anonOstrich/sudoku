export async function promiseAwait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}