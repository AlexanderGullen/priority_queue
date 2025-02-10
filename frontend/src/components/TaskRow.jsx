import { useRef } from 'react'

export function TaskRow({task, deleteTask, updateTask, notify}){
    const nameRef = useRef(null)
    const assigneeRef = useRef(null)
    const textRef = useRef(null)
    const deadlineRef = useRef(null)
    const priorityRef = useRef(task.priority)

    const update = (t) => {
        const task = {
            id: t.id,
            assignee: assigneeRef.current.value,
            name: nameRef.current.value,
            text: textRef.current.value,
            deadline: null, //TODO: implement datepicker
            priority: priorityRef.current.value
        }

        updateTask(task)
    }

    return (
        <tr key={task.id}>
        <td><input ref={nameRef} defaultValue={task.name}/></td>
        <td>{task.assignee === null ? <input ref={assigneeRef} defaultValue=''/> : <input ref={assigneeRef} defaultValue={task.assignee}/>  }</td>
        <td><input ref={deadlineRef} defaultValue={task.deadline}/></td>
        <td><input ref={priorityRef} defaultValue={task.priority}/></td>
        <td><textarea ref={textRef} defaultValue={task.text}/></td>
        <td>
            <button onClick={() => deleteTask(task)}>Delete</button>
            <button onClick={() => update(task)}>Update</button>
            <button onClick={() => notify(task)}>Notify</button>
            
        </td>
    </tr>
    )
}

export default TaskRow