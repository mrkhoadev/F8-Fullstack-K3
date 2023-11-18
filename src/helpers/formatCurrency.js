export function formatCurrency(amount, currencyCode = "VND") {
    return amount
        .toLocaleString("en-US", {
            style: "currency",
            currency: currencyCode,
        })
        .replace(/,/g, ".");;
}
