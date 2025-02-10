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
    <td><input ref={nameRef} defaultValue={task.name} className="form-control" /></td>
    <td>
        {task.assignee === null ? 
            <input ref={assigneeRef} defaultValue='' className="form-control" /> : 
            <input ref={assigneeRef} defaultValue={task.assignee} className="form-control" />
        }
    </td>
    <td><input ref={deadlineRef} defaultValue={task.deadline} className="form-control" /></td>
    <td><input ref={priorityRef} defaultValue={task.priority} className="form-control" /></td>
    <td><textarea ref={textRef} defaultValue={task.text} className="form-control" /></td>
    <td>
        <button onClick={() => deleteTask(task)} className="btn btn-danger me-2">Delete</button>
        <button onClick={() => update(task)} className="btn btn-warning me-2">Update</button>
        <button onClick={() => notify(task)} className="btn btn-info">Notify</button>
    </td>
</tr>
    )
}

export default TaskRow