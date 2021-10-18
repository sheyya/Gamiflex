import React from "react";
import ReactPaginate from 'react-paginate';



export const Pagination = ({ meta, handlePageChange }) => {
  console.log(meta);

  if (meta && meta.pages && meta.pages > 1) {
    return (
      <div className="">
        <div>
          <ReactPaginate
            previousLabel={"Prev"}
            nextLabel={"Next"}
            breakLabel={"..."}
            forcePage={meta.current ?? 0}
            pageCount={meta.pages ?? 0}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={(data) => {
              handlePageChange(data.selected);
            }}
            containerClassName={`pagination`}
            breakClassName={`page-item page-link pagination-item`}
            previousClassName={`page-item page-link pagination-item`}
            nextClassName={`page-item page-link pagination-item`}
            pageClassName={`page-item page-link pagination-item`}
            activeClassName={`page-item page-link pagination-item active`}
          />
        </div>
      </div>
    );
  } else {
    return (<div></div>)
  }
};
