import { useState, useEffect, useCallback} from 'react'
import axios from 'axios'

import config from '../config'


export function Tasks({token}){
    const [banner, setBanner] = useState({
        visible: false,
        message: ''
    })

    const [tasks,setTasks] = useState([])

    const [newTask, setNewTask] = useState({
        name: '',
        text: '',
        deadline: null,
        priority: 0
    })

    const [requery, setRequery] = useState(0)


    const createTaskInput = (event) => {
        console.log(event)
        console.log(tasks)
        setNewTask({...newTask, [event.target.id]: event.target.value})
    }

    function createTask(event){
        event.preventDefault()
        axios.post(config.backend + 'task/create', {
            name: newTask.name,
            text: newTask.text,
            deadline: newTask.deadline,
            priority: newTask.priority
        }, { headers: { 'Authorization': 'Token ' + token }})
        .then((response) => {
            console.log(response)
            setBanner({
                visible: false,
                message: ''
            })
            setRequery(!requery)
        })
        .catch((error) => {
            console.log(error)
            setBanner({
                visible: true,
                message: error.response.data
            })
        })
    }

    useEffect(()=>{
        console.log("R is for read")
        axios.get(config.backend + 'task',{
            headers: { 'Authorization': 'Token ' + token }
        })
        .then((response) => {
            console.log(response.data)
            setTasks(response.data)
        })
        .catch((error) => {
            setBanner({
                visible: false,
                message: error.response.data
            })
        })
    },[requery])

    const updateTask = (t) => {
        axios.put(config.backend + 'task/' + t.id,{},{ headers: {'Authorization': 'Token ' + token }})
        .then((response) => {
            console.log(response)
            setBanner({
                visible: false,
                message: ''
            })
            setRequery(!requery)
        })
        .catch((error) => {
            console.log(error)
            setBanner({
                visible: true,
                message: error.response.data
            })
        })
    }

    const deleteTask = (t) => {
        console.log(t)
        axios.delete(config.backend + 'task/' + t.id, { 
            headers: {'Authorization': 'Token ' + token },
            name: t.name,
            text: t.text,
            deadline: t.deadline,
            priority: t.priority
        })
        .then((response) => {
            console.log(response)
            setBanner({
                visible: false,
                message: ''
            })
            setRequery(!requery)
        })
        .catch((error) => {
            console.log(error)
            setBanner({
                visible: true,
                message: error.response.data
            })
        })
    }


    function TasksRow({task}){

        return (
            <tr>
            <td><input value={task.name} onChange={() => updateTask(task)}></input></td>
            <td>{task.assignee === null ? <button/> : task.assignee}</td>
            <td>{task.deadline}</td>
            <td>{task.priority}</td>
            <td>{task.text}</td>
            <td><button onClick={() => deleteTask(task)}>Delete</button></td>
        </tr>
        )
    }

    return (
        <>
        <h2>Tasks</h2>
        <form onSubmit={createTask}>
            <input id="name" type="text" placeholder="Task Name" maxLength={50} onChange={createTaskInput} required />
            <textarea id="text" type="" placeholder="Details" onChange={createTaskInput} />
            <input id="deadline" type="datetime" placeholder="Task Deadline" onChange={createTaskInput} />
            <input id="priority" type="number" placeholder="Task Priority" onChange={createTaskInput} />
            <button type="submit">Create Task</button>
        </form>
        <table>
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Assignee</td>
                    <td>Deadline</td>
                    <td>Priority</td>
                    <td>Details</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                {tasks.map((t) =>
                    <TasksRow task={t}/>
                )}
            </tbody>
        </table>
        </>
    )


}

export default Tasks