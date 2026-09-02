export function getISOWeek(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));

    const firstThursday = new Date(d.getFullYear(), 0, 4);
    firstThursday.setDate(
        firstThursday.getDate() +
        3 -
        ((firstThursday.getDay() + 6) % 7)
    );

    return (
        1 +
        Math.round((d - firstThursday) / (7 * 24 * 60 * 60 * 1000))
    );
}

export function formatDate(dateString) {
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');

    return `${day}/${month}/${year}`;
}

export function totalHours(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInSeconds = (end - start) / 1000;
    return (diffInSeconds / 3600).toFixed(0);
}

export function totalAccHours(startDate, endDate, qntdeFuncionarios) {
    const result = totalHours(startDate, endDate);
    return result * qntdeFuncionarios;
}  