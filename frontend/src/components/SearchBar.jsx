import { useRef, useEffect } from 'react'

export function SearchBar({tasks,setSearchResults}){
    const inputRef = useRef()

    useEffect(() => {

        setSearchResults(tasks)
    },[tasks,setSearchResults])

    const handleSearchChange = (e) => {
        if (!e.target.value) return setSearchResults(tasks)

        const resultsArray = tasks.filter(task => 
            task.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            task.text.toLowerCase().includes(e.target.value.toLowerCase())
        )

        setSearchResults(resultsArray)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <header>
    <form onSubmit={handleSubmit} className="d-flex justify-content-center align-items-center mb-4">
        <input
            type="text"
            ref={inputRef}
            onChange={(e) => {
                handleSearchChange(e)
                inputRef.current.focus()
            }}
            className="form-control me-2"
            placeholder="Search tasks..."
        />
        <button type="submit" className="btn btn-primary">Search</button>
    </form>
</header>

    )

}

export default SearchBar