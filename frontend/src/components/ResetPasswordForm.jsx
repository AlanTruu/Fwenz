import { useEffect, useState } from "react"
import Alert from "./Alert";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../lib/api";
import styles from '../styles/components/ResetPasswordForm.module.scss'
import { Link } from "react-router-dom";

const ResetPasswordForm = ({code}) => {
    const [password, setPassword] = useState('');
    const [disabled, setDisabled] = useState(true);
    
    useEffect(()=> {
        const isValid = password.length >= 6;
        setDisabled(!isValid);
    }, [password])

    const {mutate : resetUserPassword, isPending, isSuccess, isError, error} = useMutation({
        mutationFn : resetPassword
    })

    return (
        <div>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <h1 className = {styles.header1}>Change your password</h1>
            {isError && (error.message || 'An error occured')}
            {
                isSuccess ? <div>
                    <Alert success = {true} message = {'Password updated successfully'}></Alert>
                    <Link to = '/login' replace className = {styles.loginLink}>Sign in</Link>
                    {console.log('isSuccess is: ' + isSuccess)}
                </div>
                :
                <>
                    <form className = {styles.form}>
                        <label htmlFor="fpassword" className = {styles.label}>New Password</label><br />
                        <input type="password" id="fpassword" name="fpassword" className = {styles.input} placeholder = 'Password' value = {password} 
                            onChange={(e) => setPassword(e.target.value)} required onKeyDown={(e) => {e.key === 'Enter' && resetUserPassword({password, verificationCode : code})}}
                            autoFocus
                        />
                    </form>
                    <button className = {styles.button} disabled = {disabled} onClick = {() => {resetUserPassword({password, verificationCode : code})}}>{isPending ? <i class = 'fa fa-spinner fa-spin'></i> : 'Reset password'}</button>
                </>
            }
        </div>
    )
}

export default ResetPasswordForm