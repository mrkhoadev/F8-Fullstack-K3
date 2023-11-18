import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import config from "../../../api/config";
import ReactPaginate from "react-paginate";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../redux/slice/productSlice";
import "./Pagination.scss";

const { PAGE_LIMIT } = config;

export default function Pagination() {
  const dispatch = useDispatch();
  const totalPage = useSelector((state) => state.products.totalPage);
  let { page } = useParams();
  const navigate = useNavigate();
  const validCurrentPage = useRef(
    Math.min(!isNaN(+page) ? +page : 1, totalPage)
  );

  useLayoutEffect(() => {
    const pageParams = +page;
    if (!isNaN(pageParams) && pageParams > 0 && pageParams <= totalPage) {
      (async () => {
        await dispatch(
          getProducts({
            limit: PAGE_LIMIT,
            page: +page,
          })
        );
      })();
    } else {
      page = 1;
      navigate(`/product/1`);
      (async () => {
        await dispatch(
          getProducts({
            limit: PAGE_LIMIT,
            page: 1,
          })
        );
      })();
    }
  }, [page]);
  validCurrentPage.current = Math.min(!isNaN(+page) ? +page : 1, totalPage);
  const handlePageClick = (event) => {
    navigate(`/product/${event.selected + 1}`);
    page = event.selected + 1;
  };
  return (
    <div className="pagination">
      <ReactPaginate
        breakLabel="..."
        nextLabel={<i className="bx bx-chevron-right"></i>}
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={totalPage}
        previousLabel={<i className="bx bx-chevron-left"></i>}
        renderOnZeroPageCount={null}
        activeLinkClassName="active"
        forcePage={validCurrentPage.current - 1}
      />
    </div>
  );
}
