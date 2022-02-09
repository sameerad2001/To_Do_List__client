import React, { useState } from "react";
import ReactDOM from "react-dom"
import axios from 'axios'

import TextareaAutosize from '@mui/material/TextareaAutosize';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import BuildIcon from '@mui/icons-material/Build';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';

function EditList(props) {

    let [list, setList] = useState(props.list)

    let [newObjective, setNewObjective] = useState({
        objective: "",
        isDone: false
    })

    // Create rows of objectives__________________________________________________________________________________
    function createRows(listObjective, index) {
        return <tr key={index}>
            <td> {index + 1} </td>
            <td style={listObjective.isDone ? { textDecoration: "line-through" } : {}}> {listObjective.objective} </td>
            <td>
                <Button variant="text" size="large" name={listObjective.objective} onClick={completeObjective}>
                    {listObjective.isDone ? <DoneIcon color="success" /> : <CloseIcon color="error" />}
                </Button>
            </td>
            <td>
                <Button variant="text" size="large" name={listObjective.objective} onClick={forgetObjective}>
                    <DeleteIcon color="error" />
                </Button>
            </td>

        </tr>
    }

    function completeObjective(event) {
        let objectToComplete = event.currentTarget.name

        const modifiedObjectives = list.objectives

        const index = modifiedObjectives.findIndex((objective) => {
            return objective.objective === objectToComplete
        })

        modifiedObjectives[index].isDone = !modifiedObjectives[index].isDone

        setList((preVal) => {
            return {
                ...preVal,
                objectives: modifiedObjectives
            }
        })
    }

    // Delete the current list______________________________________________________________________________________
    function forgetList() {
        let baseURL_delete = "http://localhost:5000/lists/listNumber/" + String(list.listNumber);

        axios.delete(baseURL_delete)
            .then(result => {
                console.log(result.data)
                props.closeListEditor();
            })
            .catch(err => {
                console.log(err)
            })
    }

    // Delete a list objective_________________________________________________________________________________________________
    function forgetObjective(event) {
        let objectiveToForget = event.currentTarget.name

        const modifiedList = list.objectives.filter((objective, index) => {
            return objective.objective !== objectiveToForget
        })

        setList((preVal) => {
            return {
                ...preVal,
                objectives: modifiedList
            }
        })
    }

    // Modify list_________________________________________________________________________________________________
    function modifyList() {

        let listNumber = props.list.listNumber
        let baseURL = "http://localhost:5000/lists/listNumber/" + listNumber;

        axios.patch(baseURL, list)
            .then((res) => {
                console.log(res.data)
                props.closeListEditor()
            })
            .catch((err) => { throw err })

    }

    // Add objective
    function addObjective() {
        setList((preVal) => {
            return {
                ...preVal,
                objectives: [...preVal.objectives, newObjective]
            }
        })

        setNewObjective({
            objective: "",
            isDone: false
        })
    }

    return ReactDOM.createPortal(
        <div >
            <div className="overlay" />

            <div className="card  popup-card" >

                <div className="card-header">
                    <div className="row">
                        <div className="col">
                            List Number : {list.listNumber}
                        </div>

                        <div className="col">
                            Date : {list.obtained.split("T")[0]}
                        </div>

                        <div className="col">
                            <Button variant="text" size="small" color="error" onClick={forgetList} >
                                <DeleteIcon fontSize="small" />(Danger)
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={"card-body"}>
                    <TextField
                        className="card-title"
                        fullWidth
                        required
                        name="title"
                        margin="dense"
                        label="Title"
                        value={list.title}
                        onChange={(e) => {
                            let { name, value } = e.target
                            setList((preVal) => {
                                return {
                                    ...preVal,
                                    [name]: value
                                }
                            })
                        }}
                    />

                    <br />

                    <TextareaAutosize
                        style={{ width: "100%", maxHeight: "10%" }}
                        aria-label="minimum height"
                        name="details"
                        minRows={3}
                        placeholder="Details"
                        maxRows={6}
                        value={list.details}
                        onChange={(e) => {
                            let { name, value } = e.target

                            setList((preVal) => {
                                return {
                                    ...preVal,
                                    [name]: value
                                }
                            })
                        }}
                    />

                    <br />

                    <table className="table table-hover">
                        <thead >
                            <tr className="table-dark">
                                <th scope="col">#</th>
                                <th scope="col">Objectives</th>
                                <th scope="col">Completed</th>
                                <th scope="col">Add/Delete</th>
                            </tr>
                        </thead>

                        <tbody>

                            <tr>
                                <td >#</td>
                                <td>
                                    <TextField
                                        required
                                        name="objective"
                                        label="Objective name"
                                        margin="dense"
                                        value={newObjective.objective}
                                        onChange={(e) => {
                                            let { name, value } = e.target

                                            setNewObjective((preVal) => {
                                                return {
                                                    ...preVal,
                                                    [name]: value
                                                }
                                            })
                                        }}
                                    />
                                </td>
                                <td>
                                    <Button
                                        variant="text"
                                        size="large"
                                        color={newObjective.isDone ? "success" : "error"}
                                        onClick={() => {
                                            setNewObjective((preVal) => {
                                                return {
                                                    ...preVal,
                                                    isDone: !newObjective.isDone
                                                }
                                            })
                                        }}
                                    >
                                        {newObjective.isDone ?

                                            <DoneIcon style={{
                                                transform: "scale(1.2)"
                                            }} fontSize="large" /> :

                                            <CloseIcon style={{
                                                transform: "scale(1.2)"
                                            }} fontSize="large" />
                                        }
                                    </Button>
                                </td>
                                <td>
                                    <Button variant="text" size="large" color="success" onClick={addObjective}>
                                        <AddIcon style={{
                                            transform: "scale(1.2)"
                                        }} fontSize="large" />
                                    </Button>
                                </td>

                            </tr>

                            {list.objectives.map(createRows)}
                        </tbody>
                    </table>
                </div>

                <Stack direction="row" spacing={1}>
                    <Button variant="text" size="large" style={{ width: "50%" }} onClick={() => { props.closeListEditor() }}>
                        <CloseIcon color="active" fontSize="large" />
                    </Button>

                    <Button variant="text" size="large" style={{ width: "50%" }} onClick={modifyList}>
                        <BuildIcon color="success" fontSize="large" />
                    </Button>
                </Stack>


            </div>

        </div >, document.getElementById("portal"))

}

export default EditList