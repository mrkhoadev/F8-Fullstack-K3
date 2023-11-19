
export const ProductDetail = ({ id }) => {
    return `
        <h2>Chi tiết sản phẩm: ${id}</h2>
        <button onclick="navigate('/san-pham')">Back</button>
    `;
};
