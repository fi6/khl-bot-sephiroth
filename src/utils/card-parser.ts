/**
 * input cardParser in sequence
 *
 * @param contents json / string, not array!
 * @returns
 */
export function cardParser(...contents: string[] | unknown[]): string {
    let list: JSON[] = [];
    contents.forEach((card: string | any) => {
        if (typeof card == 'string') {
            list.push(JSON.parse(card));
        } else {
            list.push(card);
        }
    });
    return JSON.stringify(list);
}
