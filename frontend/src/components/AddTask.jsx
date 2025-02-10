import { useRef } from 'react'

export function AddTask({createTask}){
    const nameRef = useRef('')
    const textRef = useRef('')
    const deadlineRef = useRef(null)
    const priorityRef = useRef(0)


    const create = (e) => {
        e.preventDefault()
        const task = {
            name: nameRef.current.value,
            text: textRef.current.value,
            deadline: null, //TODO: implement datepicker
            priority: priorityRef.current.value
        }

        createTask(task)
    }

    return (
        <form onSubmit={create}>
            <input type="text" ref={nameRef} placeholder="Task Name" maxLength={50} required />
            <textarea ref={textRef} placeholder="Details"/>
            <input ref={deadlineRef} type="datetime" placeholder="Task Deadline" />
            <input ref={priorityRef} type="number" placeholder="Task Priority" defaultValue={0} />
            <button type="submit">Create Task</button>
        </form>
    )
}

export default AddTask