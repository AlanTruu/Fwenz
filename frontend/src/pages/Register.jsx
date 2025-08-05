import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import { register } from "../lib/api";
import { useMutation } from "@tanstack/react-query";
import styles from '../styles/components/register.module.scss'


const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [disabled, setDisabled] = useState(true);
    const navigate = useNavigate();

    const {mutate : createAccount, isPending, isError, error} = useMutation({
        mutationFn : register,
        onSuccess : () => {navigate('/', {replace : true})}
    })
    
    useEffect(()=>{
        const isValid = email && password.length >= 6 && password === confirmPassword;
        setDisabled(!isValid);
    }, [email, password, confirmPassword])
    
    return (
        <div className = {styles.page}>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                    <div className = {styles.container}>
                        <h1 className = {styles.header1}>Create an account</h1>
                        <form>
                            {isError && <p className = {styles.errorMessage}>{error?.message || 'An error occured'}</p>}
                            <label htmlFor="femail">Email</label><br />
                            <input type="email" id="femail" name="femail" className = {styles.input} placeholder = "Email" value = {email}
                                onChange={(e) => setEmail(e.target.value)} required
                            /><br />
                            <label htmlFor="fpassword">Password</label><br />
                            <input type="password" id="fpassword" name="fpassword" className = {styles.input} placeholder = 'Password' value = {password} 
                                onChange={(e) => setPassword(e.target.value)} required 
                            />
                            <p className ={styles.p}>-Password should be 6 characters in length</p>
                            <label htmlFor="fconfirm_password"><br />Confirm Password</label><br />
                            <input type="password" id="fconfirm_password" name="fconfirm_password" className = {styles.input} placeholder = 'Password' value = {confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} required onKeyDown={(e) => {e.key === 'Enter' && createAccount({email, password, confirmPassword})}}
                            />
                        </form> 
                        <button className = {styles.button} disabled = {disabled} onClick = {() => {createAccount({email, password, confirmPassword})}}>{isPending ? <i class = 'fa fa-spinner fa-spin'></i> : 'Sign up'}</button>
                        <p>Already have an account? <Link to ='/login' className = {styles.link}>login</Link></p>
                    </div>
                </div>
    )
}

export default Register