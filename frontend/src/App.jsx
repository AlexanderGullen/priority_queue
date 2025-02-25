import { useState, useEffect } from 'react'
import axios from 'axios'

import toast, {Toaster} from 'react-hot-toast'

import './App.css'
import config from './config'

import Registration from '../src/components/Registration'
import Tasks from '../src/components/Tasks'

function App() {
	const [token, setToken] = useState('')
	const [username, setUsername] = useState('')

	const logout = (event => {
		setToken('')
	})

	function validate_token(token){
		axios.get(config.backend + 'test_token',{
			headers: { 'Authorization': 'Token ' + token }
		})
		.then((response) => {
			setToken(token)
			setUsername(response.data)
		})
		.catch((error) => {
			toast.error("Automatically Signed out: " + error.response.data)
			setToken('')
			setUsername('')
		})
	}

  	return (
    		<>
		<h1>Priority Queue</h1>
		{token.length > 0 ? <p> Hello <strong className="p-1 border">{username}</strong> </p> : <p>Welcome! once you register you'll be given a fun name that you can use to trade tasks with other users. Make sure you save this name!</p>}
		{token.length > 0 ? <Tasks token={token} /> : <Registration validate_token={validate_token}/>}
		{token.length > 0 ? <button onClick={logout}>Log Out</button> : null}
		<Toaster/>
    		</>
  	)
}

export default App
