import React from "react";
import { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import "./leaderboard.scoped.scss"
import { message } from "antd";
import Admin from "../../controllers/admin";
import Tsk from "../../controllers/task";
import jwt from 'jwt-decode';
import moment from "moment"
import useAuth from "../../useAuth";

/*
Filter Modes : 
0 : No Filter
1 : Search
*/

export const Leaderbord = () => {
    //get current user data
    const { user } = useAuth();
    const userdatatk = localStorage.getItem('usertoken');
    let role = user.role || jwt(userdatatk).role;

    //get current url location of application
    const location = useLocation();

    //state variable to store today target count data
    const [udata, setUData] = useState([]);

    //state variable to store sorted daily marks
    const [newudata, setNewUData] = useState([]);

    //state variable to store sorted monthly marks
    const [monthudata, setMonthUData] = useState([]);

    //function call when page loads at first.
    useEffect(() => {
        loadAllEmployees();
    }, [location]);

    //key value to show toast messages on screen
    const key = 'loading';

    //sort function to call when udata is updated
    useEffect(() => {
        //fuction to sort the array
        const sortArray = () => {
            const sorted = udata.sort((a, b) => b.marks - a.marks);
            setNewUData(sorted);
        };
        sortArray();
    }, [udata]);

    //getall employees
    const loadAllEmployees = (params) => {
        message.loading({ content: 'Data Loading...', key, duration: 0 })
        Admin.getAllEmployees(params)
            .then(async (result) => {
                //store employee data
                const rdata = result.data;

                //initalize state variables
                setUData([])
                setMonthUData([])

                //loop employee data to retrive relavant data and append to state variables
                rdata.forEach((item) => {
                    Tsk.getTargetCountTodaybyEmp({ id: item._id }).then(async (result) => {
                        const out = result.data
                        const dataMapped = out.map((data) => {
                            console.log(data);
                            message.success({ content: 'Loaded!', key, duration: 2 });
                            return (
                                {
                                    id: item._id,
                                    name: `${item.fname} ${item.lname}`,
                                    member_id: item.member_id,
                                    totarget: data.totarget,
                                    totcompleted: data.totcompleted,
                                    marks: Math.round((data.totcompleted / data.totarget * 100), 0)
                                }
                            )
                        })
                        //sort employee target data according to marks DSC
                        dataMapped.sort((a, b) => b.marks - a.marks);
                        //Store sorted array on state variable
                        setUData(prevState => ([...prevState, ...dataMapped]))
                    })
                        .catch((err) => {
                            console.log(err);
                            message.warning({ content: 'No Daily Data Found!', key, duration: 2 });
                        });
                })

                //loop employee data to get monthly marks 
                const mdata = rdata.map((item) => {
                    return (
                        {
                            id: item._id,
                            name: `${item.fname} ${item.lname}`,
                            member_id: item.member_id,
                            marks: item.marks
                        }
                    )
                })
                //sort monthly marks
                await mdata.sort((a, b) => b.marks - a.marks);
                //store monthly marks on state variable
                setMonthUData(prevState => ([...prevState, ...mdata]))
            })
            .catch((err) => {
                message.warning({ content: 'No Data Found!', key, duration: 2 });
            })
    }



    return (
        <div className="leaderboard">
            <div className="l-grid">
                <div className="l-grid__item">
                    <div className="c-card">
                        <div className="c-card__header">
                            <h3 style={{ color: "#ffffff" }}>Daily Leaderboard</h3>
                            <select className="c-select">
                                <option selected="selected">{moment().format("DD MMM YYYY")}</option>
                            </select>
                        </div>
                        <div className="c-card__body">
                            <ul className="c-list" id="list">
                                <li className="c-list__item">
                                    <div className="c-list__grid">
                                        <div className="u-text--left u-text--small u-text--medium">Rank</div>
                                        <div className="u-text--left u-text--small u-text--medium">Employee</div>
                                        <div className="u-text--right u-text--small u-text--medium">Marks</div>
                                    </div>
                                </li>
                                {
                                    newudata.map((userd, index) => {
                                        let newclassrank = "c-flag c-place u-bg--transparent";
                                        let newclassmarks = "u-text--right c-kudos";
                                        // Give Special colors to first 3 employees
                                        if (index + 1 === 1) {
                                            newclassrank = 'c-flag c-place u-text--dark u-bg--yellow'
                                            newclassmarks = 'u-text--right c-kudos u-text--yellow'
                                        } else if (index + 1 === 2) {
                                            newclassrank = 'c-flag c-place u-text--dark u-bg--teal'
                                            newclassmarks = 'u-text--right c-kudos u-text--teal'
                                        } else if (index + 1 === 3) {
                                            newclassrank = 'c-flag c-place u-text--dark u-bg--orange'
                                            newclassmarks = 'u-text--right c-kudos u-text--orange'
                                        }
                                        return (
                                            <li className="c-list__item">
                                                <div className="c-list__grid">
                                                    <div className={newclassrank}>{index + 1}</div>
                                                    <div className="c-media">
                                                        <div className="c-media__content">
                                                            <div className="c-media__title">{userd.name}</div>
                                                            <a className="c-media__link u-text--small" href={role == "admin" ? `/dashboard/employee/view/${userd.id}` : ""} >{userd.member_id}</a>
                                                        </div>
                                                    </div>
                                                    <div className={newclassmarks}>
                                                        <div className="u-mt--8">
                                                            <strong>{userd.marks}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>)
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="l-grid__item">
                    <div className="c-card">
                        <div className="c-card__header">
                            <h3 style={{ color: "#ffffff" }}>Monthly Leaderboard</h3>
                            <select className="c-select">
                                <option selected="selected">{moment().format("MMM YYYY")}</option>
                            </select>
                        </div>
                        <div className="c-card__body">
                            <ul className="c-list" id="list">
                                <li className="c-list__item">
                                    <div className="c-list__grid">
                                        <div className="u-text--left u-text--small u-text--medium">Rank</div>
                                        <div className="u-text--left u-text--small u-text--medium">Employee</div>
                                        <div className="u-text--right u-text--small u-text--medium">Marks</div>
                                    </div>
                                </li>
                                {

                                    monthudata.map((userd, index) => {
                                        let newclassrank = "c-flag c-place u-bg--transparent";
                                        let newclassmarks = "u-text--right c-kudos";
                                        if (index + 1 === 1) {
                                            newclassrank = 'c-flag c-place u-text--dark u-bg--yellow'
                                            newclassmarks = 'u-text--right c-kudos u-text--yellow'
                                        } else if (index + 1 === 2) {
                                            newclassrank = 'c-flag c-place u-text--dark u-bg--teal'
                                            newclassmarks = 'u-text--right c-kudos u-text--teal'
                                        } else if (index + 1 === 3) {
                                            newclassrank = 'c-flag c-place u-text--dark u-bg--orange'
                                            newclassmarks = 'u-text--right c-kudos u-text--orange'
                                        }
                                        return (
                                            <li className="c-list__item">
                                                <div className="c-list__grid">
                                                    <div className={newclassrank}>{index + 1}</div>
                                                    <div className="c-media">
                                                        <div className="c-media__content">
                                                            <div className="c-media__title">{userd.name}</div>
                                                            <a className="c-media__link u-text--small" href={role === "admin" || "manager" ? `/dashboard/employee/view/${userd.id}` : ""} >{userd.member_id}</a>
                                                        </div>
                                                    </div>
                                                    <div className={newclassmarks}>
                                                        <div className="u-mt--8">
                                                            <strong>{userd.marks}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>)
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
};
