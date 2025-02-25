import { useState } from 'react'
import axios from 'axios'

import toast, {Toaster} from 'react-hot-toast'

import config from '../config'

import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../../node_modules/bootstrap/dist/js/bootstrap.min.js"

export function Registration({validate_token}){
    const [login, setLogin] = useState({
		username: '',
		password: '',
        email: ''
	})

	const [signup, setSignup] = useState({
		email: '',
		password: ''
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
		})
		.catch((error) => {
            toast.error("Failed to sign up: " + error.response.data)
		})
	}

    
	function handleSignUp(event) {
		event.preventDefault()
		axios.post(config.backend + 'sign_up', signup)
		.then((response) => {
			validate_token(response.data.token)
		})
		.catch((error) => {
            toast.error("Faild to sign up: " + error.response.data)
		})
	}

    return ( 
<>
    <h2 className="text-center mb-4">Login</h2>
    <form onSubmit={handleLogIn} className="mb-4">
  <div className="mb-3">
    <div className="d-flex align-items-center">
      <input 
        id="email" 
        type="text" 
        placeholder="Email" 
        onChange={loginInput} 
        className="form-control me-2" 
      />
      <span className="mx-2">or</span>
      <input 
        id="username" 
        type="text" 
        placeholder="Username" 
        onChange={loginInput} 
        className="form-control ms-2" 
      />
    </div>
  </div>
  
  <div className="mb-3">
    <input 
      id="password" 
      type="password" 
      placeholder="Password" 
      onChange={loginInput} 
      required 
      className="form-control" 
    />
  </div>
  
  <button type="submit" className="btn btn-primary w-100">Login</button>
</form>

    <h2 className="text-center mb-4">Sign up</h2>
    <form onSubmit={handleSignUp}>
        <div className="mb-3">
            <input 
                id="email" 
                type="text" 
                placeholder="Email" 
                required
                onChange={signupInput} 
                className="form-control" 
            />
        </div>
        <div className="mb-3">
            <input 
                id="password" 
                type="password" 
                placeholder="Password"
                required
                onChange={signupInput} 
                className="form-control" 
            />
        </div>
        <button type="submit" className="btn btn-success w-100">Sign Up</button>
    </form>
</>
    )

}

export default Registration