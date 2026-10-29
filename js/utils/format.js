export function formatMoney(value) {
    return value.toFixed(2).replace('.', ',') + ' €';
}

export function formatMoneyShort(value) {
    return value.toFixed(2).replace('.', ',') + '€';
}