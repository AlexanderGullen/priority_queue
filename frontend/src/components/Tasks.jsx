import { useState, useEffect } from 'react'
import axios from 'axios'
import toast, {Toaster} from 'react-hot-toast'

import config from '../config'

import AddTask from './AddTask'
import TaskRow from './TaskRow'
import SearchBar from './SearchBar'

export function Tasks({token}){

    const [tasks,setTasks] = useState([])
    const [searchResults, setSearchResults] = useState([])

    useEffect(()=>{
        readTasks()
    },[])

    const createTask = async (task) => {
        axios.post(config.backend + 'task/create', {
            name: task.name,
            text: task.text,
            deadline: task.deadline,
            priority: task.priority
        }, { headers: { 'Authorization': 'Token ' + token }})
        .then((response) => {
            readTasks()
        })
        .catch((error) => {
            toast.error("Create Error: " + error.response.data)
        })
    }

    const readTasks = () => {
        const response = axios.get(config.backend + 'task',{
            headers: { 'Authorization': 'Token ' + token }
        })
        .then((response) => {

            setTasks(response.data)
        })
        .catch((error) => {
            toast.error("Read Error: " + error.response.data)
            setTasks([])
        })
    }

    const updateTask = (task) => {

        axios.post(config.backend + 'user_id', { username: task.assignee }, { headers: { 'Authorization': 'Token ' + token }})
        .then((response) => {
            task.assignee = response.data.id
        })
        .catch((error) => {
            //an error here is part of anticipated function of this program if the system is unable to 
            // find the given assignee
        })
        .finally(() => {

            const update = axios.put(config.backend + 'task/' + task.id,task,{ headers: {'Authorization': 'Token ' + token }})

            toast.promise(update, {
                loading: 'Updating',
                success: 'Update Successful!'
            })

            update
            .then((response) => {
                readTasks()
            })
            .catch((error) => {
                toast.error("Update Error: " + error.response.data)
                readTasks()
            })
        })
    }

    const deleteTask = (task) => {
        const deletePromise = axios.delete(config.backend + 'task/' + task.id, { headers: {'Authorization': 'Token ' + token }})

        toast.promise(deletePromise, {
            loading: 'Deleting',
            success: 'Deletion Successful!'
        })

        deletePromise
        .then((response) => {
            readTasks()
        })
        .catch((error) => {
            toast.error("Delete Error: " + error.response.data)
            readTasks()
        })
    }

    const notify = (task) => {
        const notification = axios.put(config.backend + 'task/' + task.id + '/notify',{},{ headers: {'Authorization': 'Token ' + token }})

        toast.promise(notification, {
            loading: 'Sending Mail...',
            success: 'Notification Sent!'
        })

        notification
        .then((response) => {
            readTasks()
        })
        .catch((error) => {
            toast.error("Notification Error: " + error.response.data)
            readTasks()
        })
    }

    return (
        <>
    <h2 className="text-center mb-4">Tasks</h2>
    
    <div className="mb-4">
        <AddTask createTask={createTask} />
    </div>
    
    <div className="mb-4">
        <SearchBar tasks={tasks} setSearchResults={setSearchResults} />
    </div>

    <h3>View Tasks</h3>
    <div className="table-responsive">
        <table className="table table-striped table-bordered">
            <thead className="table-light">
                <tr>
                    <th>Name</th>
                    <th>Assignee</th>
                    <th>Deadline</th>
                    <th>Priority</th>
                    <th>Details</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {searchResults.map((t) => (
                    <TaskRow key={t.id} task={t} updateTask={updateTask} deleteTask={deleteTask} notify={notify} />
                ))}
            </tbody>
        </table>
    </div>
</>
    )
}

export default Tasks