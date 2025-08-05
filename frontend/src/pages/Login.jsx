import { useState, useEffect } from "react"
import styles from '../styles/components/Login.module.scss'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../lib/api";
import { useMutation } from "@tanstack/react-query";

export const Login = () => {
    const location = useLocation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disabled, setDisabled] = useState(true);
    const navigate = useNavigate();
    const redirectUrl = location.state?.redirectUrl || '/'

    const {mutate : signIn, isPending, isError} = useMutation({
        mutationFn : login,
        onSuccess : () => {navigate(redirectUrl, {replace : true})}
    })

    useEffect(()=>{
        const isValid = email && password.length >= 6;
        setDisabled(!isValid);
    }, [email, password])

    return (
        <div className = {styles.page}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <div className = {styles.container}>
                <h1 className = {styles.header1}>Sign into your account</h1>
                <form>
                    {isError && <p className = {styles.errorMessage}>Invalid username or password</p>}
                    <label htmlFor="femail">Email</label><br />
                    <input type="email" id="femail" name="femail" className = {styles.input} placeholder = "Email" value = {email}
                        onChange={(e) => setEmail(e.target.value)} required
                    /><br />
                    <label htmlFor="fpassword">Password</label><br />
                    <input type="password" id="fpassword" name="fpassword" className = {styles.input} placeholder = 'Password' value = {password} 
                        onChange={(e) => setPassword(e.target.value)} required onKeyDown={(e) => {e.key === 'Enter' && signIn({email, password})}}
                    />
                </form> 
                <Link to = '/password/forgot' className = {[styles.forgotLink, styles.link].join(' ')}>Forgot Password?</Link>
                <button className = {styles.button} disabled = {disabled} onClick = {() => {signIn({email, password})}}>{isPending ? <i class = 'fa fa-spinner fa-spin'></i> : 'Sign in'}</button>
                <p>Don't have an account? <Link to ='/register' className = {styles.link}>Sign up</Link></p>
            </div>
        </div>
    )
}