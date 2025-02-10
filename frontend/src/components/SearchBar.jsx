import { useRef, useEffect } from 'react'

export function SearchBar({tasks,setSearchResults}){
    const inputRef = useRef()

    useEffect(() => {
        setSearchResults(tasks)
    })

    const handleSearchChange = (e) => {
        if (!e.target.value) return setSearchResults(tasks)

        const resultsArray = tasks.filter(task => 
            task.name.includes(e.target.value) ||
            task.text.includes(e.target.value)
        )

        setSearchResults(resultsArray)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <header>
            <form onSubmit={handleSubmit}>
                <input
                type='text'
                ref={inputRef}
                onChange={(e) => {
                    handleSearchChange(e)
                    inputRef.current.focus()
                }}
                />
                <button>Search</button>

            </form>
        </header>

    )

}

export default SearchBar