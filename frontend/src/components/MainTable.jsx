import React from "react";
import { useState, useEffect } from 'react'
import { Pagination } from "./Pagination";
import {
  Collapse
} from "reactstrap";
import { Link, RouteComponentProps } from "react-router-dom";
import empty from '../assets/images/empty.svg'


/*
Filter Modes : 
0 : No Filter
1 : Search
2 : Advance Filter
*/

export const MainTable = ({ meta, data = [], handlePageChange, columns = [], actions = [] }) => {

  const initFilters = columns.reduce((a, c) => { a[c.field] = ""; return a; }, { search: "" });
  const [filterMode, setFilterMode] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState(initFilters)

  const onChangeFilter = (field, value) => {
    let changes = {};
    changes[field] = value;
    setFilters({ ...filters, ...changes })
  }

  const pageChange = (params = {}, forced = false) => {
    const currentParams = { page: currentPage, size: pageSize }
    const sFilters = getActiveFiltersList();
    if (forced) {
      handlePageChange(params);
    } else {

      handlePageChange({ ...currentParams, ...sFilters, ...params });
    }
  }

  const advanceFilterModeToggle = () => {
    setFilterMode(filterMode == 2 ? 0 : 2)
    setFilters(initFilters);
    if (filterMode == 2) {
      pageChange({ page: 0, size: pageSize }, true)
    }
  }

  const handleSearch = () => {
    pageChange();
  }

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

  return (
    <div>
      <div className="row mb-2 px-2" id="filter">
        <div className="form-group col-12 mt-1 mb-2 px-1">
          {/* <h6 className="mb-0 small"><b>Global Search {JSON.stringify(meta)}</b></h6> */}
        </div>
        <div className="form-group col-12 my-1 px-1">
          <div className="d-flex justify-content-between search">
            <div className="d-flex w-50">
              <input
                onChange={(e) => onChangeFilter("search", e.target.value)}
                value={filters.search}
                style={{ backgroundColor: '#fbfbfb', fontSize: 13, marginRight: '12px' }}
                className={`form-control ${filterMode == 2 && 'd-none'}`} placeholder={`Search Anything..`} >

              </input>
              <button
                onClick={() => advanceFilterModeToggle()}
                className="btn dropdown-icon  font-size-13 px-3">
                <i className={`fa fa-angle-double-${filterMode == 2 ? 'up' : 'down'}`}></i></button>
              <button
                onClick={() => handleSearch()}
                className="btn bg-table-blue text-white mx-2 font-size-13 px-3 d-flex align-items-center">
                <i className="fa fa-search px-1"></i><b>Search</b>
              </button>
            </div>

            <div className="d-flex w-25 justify-content-end">
              <select className="custom-select w-25"
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(0);
                  pageChange({ size: Number(e.target.value), page: 0 })
                }}
                style={{ backgroundColor: '#fbfbfb', fontSize: 13 }} >
                {[1, 10, 15, 20, 50].map((col) => (<option value={col} selected={pageSize == col}>{col}</option>))}
              </select>
              {/* <button className="mr-auto btn dropdown-icon mx-2 font-size-13 px-3 d-flex align-items-center"><b>Export</b><i className="fa fa-print px-1 font-size-12"></i> </button> */}
            </div>
          </div>

        </div>
        <Collapse isOpen={filterMode == 2} className="p-0 my-1">
          <div className="row m-0 p-0">
            {columns.map((col) => (
              <div className="form-group col-md-2 col-sm-3 col-xs-6 mt-2 px-1">
                <input
                  onChange={(e) => onChangeFilter(col.field, e.target.value)}
                  style={{ backgroundColor: '#fafafa', fontSize: 13 }}
                  className="form-control" placeholder={`Search by ${col.label}`} value={filters[col.field]}></input>
              </div>
            ))}
          </div>
        </Collapse>
      </div>
      <div className="table-responsive-md">
        <table className="table table-striped ">
          <thead className="table-header-top">
            <tr>
              <th style={{ width: '5%' }}>
                <div className="th-inner" >
                  <input type="checkbox" id="checkall" />
                </div>
              </th>
              {columns.map((col) => (
                <th>
                  <div className="th-inner font-weight-bolder">{col.label}</div>
                </th>))}

              {/* actions */}
              {actions.length > 0 &&
                <th style={{ width: '10%' }}>
                  <div className="th-inner font-weight-bolder">Actions</div>
                </th>}
            </tr>
          </thead>

          <tbody className="table-body " >
            {data.map((row) => (
              <tr className="">
                <td className="table-pd"><input type="checkbox" id="checkall" /></td>
                {columns.map((col) => (
                  <td className="table-pd">{row[col.field]}</td>
                ))}

                {actions.length > 0 && <td className="table-pd">
                  {actions.map((action) => (<Link to={`${action.path}${row.id}`}>{action.button}</Link>))}
                </td>}

              </tr>
            ))}
            <tr>
              <td colSpan={8}>
                {data.length == 0 && <div className="px-2 py-5 text-center" >
                  <div className="d-flex flex-column justify-content-center">
                    <div className=" text-center">
                      <img src={empty} style={{ width: "8%" }} />
                    </div>
                    <span className="small mt-2"><b>No Item Found!</b></span>
                  </div>
                </div>}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="d-flex justify-content-between">
          {/* <div className="align-self-center" >
          <span className="results">Results: {`${(meta.current * pageSize) + 1 }- ${meta.total > ((meta.current + 1) * pageSize) ? ((meta.current + 1) * pageSize) : meta.total }`} of {meta.total}</span>
        </div> */}
          <Pagination
            meta={meta}
            handlePageChange={(no) => {
              setCurrentPage(no);
              pageChange({ page: no })
            }}
          />
        </div>
      </div>

    </div>
  )
};
