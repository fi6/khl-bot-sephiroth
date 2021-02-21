export function cardParser(...contents: string[] | any[]): string {
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
