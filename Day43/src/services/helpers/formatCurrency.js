export function formatCurrency(amount, currencyCode = 'VND') {
    // Định dạng số tiền với dấu phân cách hàng ngàn và ký hiệu tiền tệ
    return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: currencyCode,
    });
}
