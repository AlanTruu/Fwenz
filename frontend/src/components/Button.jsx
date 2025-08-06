import React from 'react'
import styles from '../styles/components/Button.module.scss'

const Button = (props) => {
    const types = {
        login : styles.loginButton,
        deleteSession : styles.deleteSession,
        commentsButton : styles.commentsButton
    }
    return (
        
    <button className = {types[props.type]} onClick = {props.onClick}>{props.children}</button>
  )
}

export default Button