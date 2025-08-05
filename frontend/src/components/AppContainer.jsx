import useAuth from "../hooks/UseAuth"
import { Navigate, Outlet } from "react-router-dom"
import UserMenu from "./UserMenu";
import styles from '../styles/components/AppContainer.module.scss'


const AppContainer = () => {
    const {user, isLoading} = useAuth();
    
    return (
        isLoading ? <div className = {styles.spinner}></div> : user ? 
        <div className = {styles.page}>
            {console.log(user)}
            <div className = {styles.menu}><UserMenu></UserMenu></div>
            <div className = {styles.outlet}><Outlet></Outlet></div>
        </div> 
        
        : <Navigate to = '/login' replace state = {{redirectUrl : window.location.pathname}}></Navigate>
    )
}

export default AppContainer