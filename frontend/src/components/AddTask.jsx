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
            priority: priorityRef.current.value
        }

        if(deadlineRef.current.value){
            task.deadline = deadlineRef.current.value
        }

        createTask(task)
    }

    return (
        <div className="card p-4 shadow-sm mb-4">
        <h3>Create Task</h3>
        <form onSubmit={create}>
            <div className="mb-3">
                <input 
                    type="text" 
                    ref={nameRef} 
                    placeholder="Task Name" 
                    maxLength={50} 
                    required 
                    className="form-control" 
                />
            </div>
            <div className="mb-3">
                <textarea 
                    ref={textRef} 
                    placeholder="Details" 
                    className="form-control" 
                />
            </div>
            <div className="mb-3">
                <input 
                    ref={deadlineRef} 
                    type="datetime-local" 
                    placeholder="Task Deadline" 
                    className="form-control" 
                />
            </div>
            <div className="mb-3">
                <input 
                    ref={priorityRef} 
                    type="number" 
                    placeholder="Task Priority" 
                    defaultValue={0} 
                    className="form-control" 
                />
            </div>
            <button type="submit" className="btn btn-success w-100">Create Task</button>
        </form>
    </div>
    )
}

export default AddTask