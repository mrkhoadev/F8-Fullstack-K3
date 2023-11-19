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
  const { page } = useParams();
  const navigate = useNavigate();
  const validCurrentPage = useRef(
    Math.min(!isNaN(+page) ? +page : 1, totalPage)
  );
  const getData = async (pageParams) => {
    const data = await dispatch(
      getProducts({
        limit: PAGE_LIMIT,
        page: pageParams,
      })
    );
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      const pageParams = +page;
      if (!isNaN(pageParams) && pageParams > 0 && pageParams <= totalPage) {
        await getData(pageParams);
      } else {
        navigate(`/product/1`);
        await getData(1);
      }
    };

    fetchData();
  }, [page]);
  validCurrentPage.current = Math.min(!isNaN(+page) ? +page : 1, totalPage);
  const handlePageClick = (event) => {
    navigate(`/product/${event.selected + 1}`);
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
