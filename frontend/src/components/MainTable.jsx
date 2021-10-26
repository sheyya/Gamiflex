import React from "react";
import { useState, useEffect } from 'react'
import { Pagination } from "./Pagination";
import { Link } from "react-router-dom";
import empty from '../assets/images/empty.svg'


/*
Filter Modes : 
0 : No Filter
1 : Search
*/

export const MainTable = ({ meta, data = [], handlePageChange, columns = [], actions = [] }) => {

  const initFilters = columns.reduce((a, c) => { a[c.field] = ""; return a; }, { search: "" });
  const [filterMode, setFilterMode] = useState(0);
  const [pageSize, setPageSize] = useState(35);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState(initFilters)

  // Function call when type something on search filter
  const onChangeFilter = (field, value) => {
    let changes = {};
    changes[field] = value;
    setFilters({ ...filters, ...changes })
  }

  // Function to get filtered data on page change
  const pageChange = (params = {}, forced = false) => {
    const currentParams = { page: currentPage, size: pageSize }
    const sFilters = getActiveFiltersList();
    if (forced) {
      handlePageChange(params);
    } else {

      handlePageChange({ ...currentParams, ...sFilters, ...params });
    }
  }

  const handleSearch = () => {
    pageChange();
  }

  // Function to get currently active filters
  const getActiveFiltersList = () => {
    let reduce = [...columns, { field: 'search' }].reduce((ff, current) => {
      const cFieled = current.field
      if (filters[cFieled] != null && filters[cFieled].trim().length > 0) {
        ff[cFieled] = filters[cFieled].trim()
      }
      return ff;
    }, {})

    if (reduce.search) {
      return { search: reduce.search, page: 0 }
    } else {
      return { ...reduce, page: 0 };
    }
  }

  useEffect(() => {
    pageChange();
  }, []);
  console.log(meta);

  return (
    <div>
      <div className="row mb-2 px-2" id="filter">
        <div className="form-group col-12 mt-1 mb-2 px-1">
        </div>
        <div className="form-group col-12 my-1 px-1">
          <div className="d-flex justify-content-between search">
            <div className="d-flex w-50">
              <input
                onChange={(e) => {
                  if (e.target.value.length === 0) {
                    pageChange({ page: 0, size: pageSize }, true);
                  }
                  onChangeFilter("search", e.target.value)
                }}
                value={filters.search}
                style={{
                  backgroundColor: "#fbfbfb",
                  fontSize: 13,
                  marginRight: "12px",
                }}
                className={`form-control ${filterMode === 2 && "d-none"}`}
                placeholder={`Search Anything..`}
              ></input>
              <button
                onClick={() => handleSearch()}
                className="btn bg-table-blue text-white mx-2 font-size-13 px-3 d-flex align-items-center"
              >
                <i className="fa fa-search px-1"></i>
                <b>Search</b>
              </button>
            </div>

            <div className="d-flex w-25 justify-content-end">
              <select
                className="custom-select w-25"
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0);
                  pageChange({ size: Number(e.target.value), page: 0 });
                }}
                style={{ backgroundColor: "#fbfbfb", fontSize: 13 }}
              >
                {[1, 10, 15, 20, 50].map((col) => (
                  <option value={col} selected={pageSize === col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="table-responsive-md">
        <table
          className={"table table-striped "}
        >
          <thead className="table-header-top">
            <tr>
              {columns.map((col) => (
                <th>
                  <div className="th-inner font-weight-bolder">{col.label}</div>
                </th>
              ))}

              {/* actions */}
              {actions.length > 0 && (
                <th style={{ width: "10%" }}>
                  <div className="th-inner font-weight-bolder">Actions </div>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="table-body ">
            {data.map((row) => (
              <tr className="">
                {columns.map((col) => (
                  <td className="table-pd">{row[col.field]}</td>
                ))}

                {actions.length > 0 && (
                  <td className="table-pd">
                    {actions.map((action) => (
                      <Link to={`${action.path}${row.id}`}>
                        {action.button}
                      </Link>
                    ))}
                  </td>
                )}
              </tr>
            ))}
            <tr>
              <td colSpan={15}>
                {/* IF there is no data */}
                {data.length === 0 && <div className="px-2 py-5 text-center" >
                  <div className="d-flex flex-column justify-content-center">
                    <div className=" text-center">
                      <img alt="No Data" src={empty} style={{ width: "8%" }} />
                    </div>
                    <span className="small mt-2"><b>No Item Found!</b></span>
                  </div>
                </div>}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="d-flex justify-content-between">
          {/* Pagination block */}
          <Pagination
            meta={meta}
            handlePageChange={(no) => {
              setCurrentPage(no);
              pageChange({ page: no });
            }}
          />
        </div>
      </div>

    </div>
  )
};
