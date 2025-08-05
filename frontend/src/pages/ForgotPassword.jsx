import { useMutation } from "@tanstack/react-query";
import { sendPasswordResetEmail } from "../lib/api";
import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import styles from '../styles/components/ForgotPassword.module.scss'
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [disabled, setDisabled] = useState(true);

    const {mutate : sendPasswordReset, isPending, isSuccess, isError, error} = useMutation({
        mutationFn : sendPasswordResetEmail,
    })

    useEffect(()=>{
            const isValid = email ? true : false;
            setDisabled(!isValid);
        }, [email])
    
    return (
        <div className = {styles.page}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <div className = {styles.container}>
                {isSuccess ? <Alert success = {true} message = {'Password reset email sent'} className = {styles.alert}></Alert>: <><h1 className = {styles.header1}>Reset your password</h1>
                <form>
                    {isError && <p className = {styles.errorMessage}>{error?.message || 'An error occured' && console.error(error)}</p>}
                    <label htmlFor="femail">Email</label><br />
                    <input type="email" id="femail" name="femail" className = {styles.input} placeholder = "Email" value = {email}
                        onChange={(e) => setEmail(e.target.value)} required onKeyDown={(e) => {e.key === 'Enter' && sendPasswordReset(email)}}
                    /><br />
                </form>
                <button className = {styles.button} disabled = {disabled} onClick = {() => {sendPasswordReset(email)}}>{isPending ? <i class = 'fa fa-spinner fa-spin'></i> : 'Reset Password'}</button>
                <p>Go back to <Link to = '/login' className = {styles.link}>Sign in</Link> or <Link to = '/register' className = {styles.link}>Sign up</Link></p> </>}
            </div>
        </div>
    )
}

export default ForgotPassword