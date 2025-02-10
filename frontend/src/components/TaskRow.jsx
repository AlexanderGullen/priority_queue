import { useRef } from 'react'

export function TaskRow({task, deleteTask, updateTask, notify}){
    const nameRef = useRef(null)
    const assigneeRef = useRef(null)
    const textRef = useRef(null)
    const deadlineRef = useRef(null)
    const priorityRef = useRef(task.priority)

    const formatDate = (date) => {
        if (!date) return '';  // If no date is provided, return an empty string
      
        // If the date is a Date object, convert it to YYYY-MM-DD
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');  // Months are 0-based, so we add 1
        const day = d.getDate().toString().padStart(2, '0');  // Add leading zero for single-digit days
        return `${year}-${month}-${day}`;
      }

    const update = (t) => {
        const task = {
            id: t.id,
            assignee: assigneeRef.current.value,
            name: nameRef.current.value,
            text: textRef.current.value,
            priority: priorityRef.current.value
        }

        if(deadlineRef.current.value){
            task.deadline = deadlineRef.current.value
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
    <td><input type="date" ref={deadlineRef} defaultValue={formatDate(task.deadline)} className="form-control" /></td>
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