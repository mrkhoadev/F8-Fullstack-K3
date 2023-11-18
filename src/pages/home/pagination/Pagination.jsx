import React, { useEffect } from "react";
import config from "../../../api/config";
import ReactPaginate from "react-paginate";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../redux/slice/productSlice";
import './Pagination.scss';

const { PAGE_LIMIT } = config;
export default function Pagination() {
    const dispatch = useDispatch();
    const totalPage = useSelector((state) => state.products.totalPage);
    let { page } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            await dispatch(
                getProducts({
                    limit: PAGE_LIMIT,
                    page: Number.isInteger(+page) && +page > 0 ? page : 1,
                })
            );
        })();
    }, [page]);
    const handlePageClick = (event) => {
        navigate(`product/${event.selected + 1}`);
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
            />
        </div>
    );
}
