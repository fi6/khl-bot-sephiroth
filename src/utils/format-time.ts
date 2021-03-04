export function formatTime(s: Date): string {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Shanghai',
    };
    const dtFormat = new Intl.DateTimeFormat('en-GB', options as any);
    return dtFormat.format(s);
}
