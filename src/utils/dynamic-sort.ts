export function dynamicSort(property: string): (a: any, b: any) => number {
    let sortOrder = 1;
    if (property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a: { [x: string]: number }, b: { [x: string]: number }) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        const result =
            a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        return result * sortOrder;
    };
}
