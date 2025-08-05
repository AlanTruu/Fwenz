import styles from '../styles/components/Alert.module.scss'

const Alert = (props) => {
    //get bool value from props, determines style
    return (
        <div className = {props.success ? styles.successMessage : styles.errorMessage}>{props.message}</div>
    )
}

export default Alert