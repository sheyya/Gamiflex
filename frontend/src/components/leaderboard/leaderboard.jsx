import React from "react";
import { useState, useEffect } from 'react'
import {
    Collapse
} from "reactstrap";
import { Link, useLocation } from "react-router-dom";
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
2 : Advance Filter
*/

export const Leaderbord = () => {
    const { user } = useAuth();
    const location = useLocation();
    const userdatatk = localStorage.getItem('usertoken');
    let role = user.role || jwt(userdatatk).role;
    let userid = jwt(userdatatk).user_id
    let mngr_mid;
    const [udata, setUData] = useState([]);
    const [newudata, setNewUData] = useState([]);


    useEffect(() => {
        loadAllEmployees();
        // let urldata = window.location.pathname.split("/");
        // let req_id = urldata[urldata.length - 1];
        // console.log(urldata[urldata.length - 2]);
        // userid = jwt(userdatatk).user_id
        // role == "admin" || role == "manager" ? mngr_mid = jwt(userdatatk).member_id : mngr_mid = "";
        // console.log(role);

        // if (role == "admin") {
        //     getempcount();
        //     getmngrcount();
        //     gettaskscount();
        //     gettargetcount();
        // }
        // else if (role == "manager") {
        //     getempcount();
        //     console.log(getempcount());
        //     gettaskscount();
        //     gettargetcount();
        // }
        // else if (role == "employee") {
        //     gettaskscountbyemp({ id: userid });
        //     gettargetcountbyemp({ id: userid })
        // }

    }, [location]);
    const key = 'loading';

    useEffect(() => {
        console.log("ll", udata);

        const sortArray = () => {
            const sorted = udata.sort((a, b) => b.marks - a.marks);
            setNewUData(sorted);
        };

        sortArray();
        console.log(newudata);

    }, [udata]);

    //getall employees
    const loadAllEmployees = (params) => {
        message.loading({ content: 'Data Loading...', key, duration: 0 })
        Admin.getAllEmployees(params)
            .then((result) => {
                console.log("wait");

                const rdata = result.data;
                console.log(rdata);
                setUData([])
                rdata.map((item) => {

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
                        console.log("aa");

                        dataMapped.sort((a, b) => b.marks - a.marks);

                        setUData(prevState => ([...prevState, ...dataMapped]))
                        console.log("ddjk", udata);

                    })
                        .catch((err) => {
                            console.log(err);
                        });
                })

            })
            .catch((err) => {
                message.warning({ content: 'No Data Found!', key, duration: 2 });
            })

    }



    return (
        <div className="leaderboard">
            <div className="l-grid">
                {role == "employee" ? <div className="l-grid__item l-grid__item--sticky">
                    <div className="c-card u-bg--light-gradient u-text--dark">
                        <div className="c-card__body">
                            <div className="u-display--flex u-justify--space-between">
                                <div className="u-text--left">
                                    <div className="u-text--small ">My Rank</div>
                                    <h2 >3rd Place</h2>
                                </div>
                                <div className="u-text--right">
                                    <div className="u-text--small " >My Score</div>
                                    <h2>24</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="c-card">
                        <div className="c-card__body">
                            <div className="u-text--center" id="winner"></div>
                        </div>
                    </div>
                </div> : <></>}
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
                                                            <a className="c-media__link u-text--small" href={`/dashboard/employee/view/${userd.id}`} >{userd.member_id}</a>
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
