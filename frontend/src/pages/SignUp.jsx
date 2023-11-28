import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { baseURL } from '../util'

const SignUp = ({ setUser }) => {
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPass: ""
  })

  const [err, setErr] = useState()

  const handleChange = (event) => {
    setUserForm(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErr()
    if (userForm.password !== userForm.confirmPass) {
      return setErr("Passwords don't match")
    }

    const { username, email, password } = userForm

    await axios.post(`${baseURL}/auth/register`, {
      username, email, password
    }, { withCredentials: true })
    .then(res => {
      if (res.data.user) {
        setUser(res.data.user)
      }
      else {
        setErr(res.data.error)
      }
    })
    .catch(err => {
      setErr(err.message)
    })
  }

  return (
    <div className="formWrapper">
      <div className="container">
        <h1>Sign Up</h1>
        { 
          err && 
          <div className='err' >
            <p>{err}</p>
          </div>
        }

        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            placeholder='username'
            name='username'
            value={userForm.username}
            onChange={handleChange}
          />
          <input 
            type="email"
            placeholder='email'
            name='email'
            value={userForm.email}
            onChange={handleChange}
          />
          <input 
            type="password"
            placeholder='password'
            name='password'
            value={userForm.password}
            onChange={handleChange}
          />
          <input 
            type="password"
            placeholder='password'
            name='confirmPass'
            value={userForm.confirmPass}
            onChange={handleChange}
          />

          <button onClick={handleSubmit} className='btn'>Sign Up</button>
        </form>
        <p>Already logged in? <Link to='/login'>Login</Link></p>
      </div>
    </div> 
  )
}

export default SignUp