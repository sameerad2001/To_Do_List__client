import React, { useState } from "react";
import axios from "axios"
import Masonry from 'react-masonry-css'

import AddList from "./AddList.js";
import EditList from "./EditList.js";

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Button from '@mui/material/Button';
import BuildIcon from '@mui/icons-material/Build';

function Lists() {
    const fetchLists = () => {
        let baseURL = "http://localhost:5000/lists";

        axios.get(baseURL)
            .then((res) => {
                setLists(res.data.reverse())
                setNumberOfLists(res.data[0] ? res.data[0].listNumber : 0)
            })
            .catch((err) => { throw err })
    }

    // When loading the page fetch all the Lists
    let [isFirstLoad, setIsFirstLoad] = useState(true)

    if (isFirstLoad) {
        setIsFirstLoad(false);
        fetchLists();
    }

    let [lists, setLists] = useState([])

    let [numberOfLists, setNumberOfLists] = useState(0)

    let [listToBeViewed, setListToBeViewed] = useState({})

    function createRows(listObjective, index) {
        return <tr key={index}>
            <td> {index + 1} </td>
            <td style={listObjective.isDone ? { textDecoration: "line-through", color: "green" } : {}}> {listObjective.objective} </td>
        </tr>
    }

    function createListCard(list, index) {


        return <div key={list.listNumber}>

            <div className="card " >
                <div className="card-header">
                    <div className="row">
                        <div className="col">
                            list # : {list.listNumber}
                        </div>

                        <div className="col">
                            Date : {list.obtained.split("T")[0]}
                        </div>

                        <div className="col">
                            <Button variant="text" fullWidth size="small" style={{ color: "#79A8A9" }} onClick={() => {
                                setIsEditingList(true)
                                setListToBeViewed(list)
                            }}>

                                <BuildIcon />

                            </Button>
                        </div>
                    </div>
                </div>

                <div className={"card-body"}>

                    <div id="title">
                        <h3 className="card-title"> {list.title}</h3>
                    </div>

                    <div id="info">
                        <blockquote className="blockquote">
                            <p>{list.details} </p>
                        </blockquote>
                    </div>

                    <table className="table table-hover">

                        <thead >
                            <tr className="table-dark">
                                <th scope="col">#</th>
                                <th scope="col">Objectives</th>
                            </tr>
                        </thead>

                        <tbody>

                            {list.objectives.map(createRows)}

                        </tbody>

                    </table>

                </div>
            </div>

        </div >
    }

    const breakpoints = {
        default: 3,
        1100: 2,
        700: 1
    }

    // Popup : Add List____________________________________________________________________________________
    let [isAddingList, setIsAddingList] = useState(false)

    function closeListMaker() {
        setIsAddingList(false)
        fetchLists();
    }

    // Popup : Edit List__________________________________________________________________________________
    let [isEditingList, setIsEditingList] = useState(false)

    function closeListEditor() {
        setIsEditingList(false)
        fetchLists();
    }

    return <div className="container-fluid">

        <h1 className="pageTitle">
            To-Do-Lists
        </h1>

        <div className="options">

            <Button variant="text" size="large" onClick={() => { setIsAddingList(true) }}>
                <NoteAddIcon style={{
                    transform: "scale(1.2)", color: "#056676"
                }} fontSize="large" />
            </Button>

        </div>


        {/* Popups _____________________________________________________________________________________________ */}
        {isAddingList && <AddList closeListMaker={closeListMaker} numberOfLists={numberOfLists} />}

        {isEditingList && <EditList scrollable={true} closeListEditor={closeListEditor} list={listToBeViewed} />}

        <Masonry
            breakpointCols={breakpoints}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
        >
            {lists.map(createListCard)}

        </Masonry>

    </div >
}

export default Lists;