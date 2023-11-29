import Form from "./Form";
export const metadata = {
    title: "ok",
};
export default function Product({ searchParams }) {
    return (
        <div>
            <h1>Product</h1>
            <h2>Trạng thái: {searchParams.status}</h2>
            <h2>Trạng thái: {searchParams.keywords}</h2>
            <Form />
        </div>
    );
}
