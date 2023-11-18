import React from 'react'
import { useDispatch } from 'react-redux';
import { deleteProduct } from '../../redux/slice/productSlice';
import alertify from "alertifyjs";

export default function DeleteBtn({ data }) {
    const dispatch = useDispatch();
    const handleDelete = () => {
        alertify.confirm(
            "Bạn có muốn xóa sản phẩm này không?",
            function () {
                dispatch(deleteProduct(data));
            },
            function () {
                alertify.error("Đã hủy!");
            }
        );
    }
  return (
      <button onClick={handleDelete} type='button'>
          <i className="bx bx-trash"></i>
      </button>
  );
}
