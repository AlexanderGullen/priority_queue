import { useState } from 'react'
import axios from 'axios'

import config from '../config'

export function Registration({validate_token}){
    const [login, setLogin] = useState({
		username: '',
		password: ''
	})

	const [signup, setSignup] = useState({
		email: '',
		password: ''
	})

    const [banner, setBanner] = useState({
        visible: false,
        message: ''
    })

	const loginInput = (event) => {
		setLogin({...login, [event.target.id]: event.target.value})
	}

    const signupInput = (event) => {
		setSignup({...signup, [event.target.id]: event.target.value})	
	}

    function handleLogIn(event) {
		event.preventDefault()
		axios.post(config.backend + 'login', login)
		.then((response) => {
			validate_token(response.data.token)
            setBanner({
                visible: false,
                message: ''
            })
		})
		.catch((error) => {
            setBanner({
                visible: true,
                message: error.response.data
            })
		})
	}

    
	function handleSignUp(event) {
		event.preventDefault()
		axios.post(config.backend + 'sign_up', signup)
		.then((response) => {
			validate_token(response.data.token)
            setBanner({
                visible: false,
                message: ''
            })
		})
		.catch((error) => {
            setBanner({
                visible: true,
                message: error.response.data
            })
		})
	}

    return ( 
        <>
        <h2>Login</h2>
        {banner.visible === true ? <h3>{banner.message}</h3> : null}
        <form onSubmit={handleLogIn}>
            <input id="username" type="text" placeholder="Username" onChange={loginInput} required />
            <input id="password" type="password" placeholder="Password" onChange={loginInput} required />
              <button type="submit">Login</button>
        </form>
        <h2>Sign up</h2>
        <form onSubmit={handleSignUp}>
            <input id="email" type="text" placeholder="Username" onChange={signupInput} required />
            <input id="password" type="password" placeholder="Password" onChange={signupInput} required />
            <button type="submit">Login</button>
        </form>
        </>
    )

}

export default Registration