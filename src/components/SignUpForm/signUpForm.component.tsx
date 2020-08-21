import React, {useState, Dispatch} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {connect} from 'react-redux';

import {API_URL} from '../../config';
import {SignUpFormContainer} from './signUpForm.styles';
import { CustomButton } from '../../styles/styles';
import {IUser} from '../../redux/user/user.types';
import {setCurrentUser} from '../../redux/user/user.actions';


export interface ISignIn {
    setCurrentUser: (user:IUser|null) => void,
    toggleShowSignIn: () => void,
    height: number
}


const SignInForm: React.FC<ISignIn> = ({setCurrentUser, toggleShowSignIn, height}) => {
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleChange = (event:React.FormEvent<HTMLInputElement>) => {
        const {name, value} = event.currentTarget
        if (name==='email') {
            setEmail(value)
        } else if (name==='password') {
            setPassword(value)
        } else if (name==='confirmPassword') {
            setConfirmPassword(value)
        } else if (name==='userName') {
            setUserName(value)
        }
    }

    const saveJWTToken = (token: string) => {
        window.localStorage.setItem('token', token)
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        if (password !== confirmPassword) {
            alert('Passwords do not match')
        } else {
            const data = {userName, email, password}
            setEmail('')
            setPassword('')
            setUserName('')
            setConfirmPassword('')
            axios.post(`${API_URL}signup`, data)
            .then(response => {
                const { data: { token, ...user} } = response
       
                saveJWTToken(token)
                setCurrentUser(user)
            })
            .catch(err =>  {
                console.log(err)
            })
        }
    }


    return (
        <SignUpFormContainer
        initial={{y: '100%', opacity: 0}}
        animate={{y:'0%', opacity: 1, transition: {delay: 0.3, duration: 0.8}}}
        exit={{y: '100%', opacity: 0, transition: { duration: 0.8}}}
        height={height}
        >
            <div>
                <FontAwesomeIcon onClick={toggleShowSignIn} icon={faTimes}/>
            </div>
            <form  onSubmit={handleSubmit}>
                <input placeholder='UserName' name='userName' onChange={handleChange} type='text' value={userName}/>
                <input placeholder='Email' name='email' onChange={handleChange} type='email' value={email}/>
                <input placeholder='Password' name='password' onChange={handleChange} type='password' value={password} />
                <input placeholder='Confirm password' name='confirmPassword' onChange={handleChange} type='password' value={confirmPassword} />
                <CustomButton type='submit' shadow={true}>Sign Up</CustomButton>
            </form>
        </SignUpFormContainer>
    )
}


const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    setCurrentUser: (user:IUser|null) => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(SignInForm);