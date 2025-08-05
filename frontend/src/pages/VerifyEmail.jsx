import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { verifyEmail } from "../lib/api";
import styles from '../styles/components/VerifyEmail.module.scss'
import Alert from "../components/Alert";
import { Link } from "react-router-dom";

const VerifyEmail = ()=> {
    const {code} = useParams();
    const {isPending, isSuccess, isError} = useQuery({
        queryKey : ['emailVerification', code],
        queryFn : () => verifyEmail(code),
    })
    
    return (
        <div className={styles.page}>
            <div className = {styles.container}>
                {isPending && <div className = {styles.spinner} />}
                <Alert success = {isSuccess} message = {isSuccess ? 'Email Verified' : 'Invalid link'} className = {styles.alert} />
                {isError && <p className = {styles.text}>The link is either invalid or expired. <Link to = '/password/reset' className = {styles.forgotLink}>Get a new link</Link></p>}
                <Link to = '/' className ={styles.homeLink}>Back to Home</Link>
            </div>
        </div>
    )
}

export default VerifyEmail