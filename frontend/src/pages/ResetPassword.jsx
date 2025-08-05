import { Link, useSearchParams } from "react-router-dom"
import Alert from "../components/Alert"
import ResetPasswordForm from "../components/ResetPasswordForm";
import styles from '../styles/components/ResetPassword.module.scss'

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');
    const exp = Number(searchParams.get('exp'));
    const now = Date.now();
    const linkIsValid = (exp > now);

    return (
        <div className = {styles.page}>
            {linkIsValid ? <div className = {styles.form}><ResetPasswordForm code = {code} /> </div> : 
            <div className = {styles.errorBox}>
                <Alert success = {linkIsValid} message = 'Invalid link'></Alert>
                <p className = {[styles.text, styles.errorMessage].join(' ')}>The link is invalid or expired</p> 
                <p className = {styles.text}>Request a new password reset <Link to = '/password/forgot' className ={styles.forgotLink}>link</Link></p>
            </div>}
            
        </div>
    )
}

export default ResetPassword