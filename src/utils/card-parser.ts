/**
 * input cardParser in sequence
 *
 * @param contents json / string, not array!
 * @returns
 */
export function parseCard(...contents: string[] | unknown[]): string {
    const list: JSON[] = [];
    contents.forEach((card: string | any) => {
        if (typeof card == 'string') {
            card = JSON.parse(card);
        }
        if (Array.isArray(card)) {
            list.push(...card);
        } else {
            list.push(card);
        }
    });
    return JSON.stringify(list);
}
