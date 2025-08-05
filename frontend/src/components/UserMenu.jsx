import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query';
import { logout } from '../lib/api';
import queryClient from '../config/queryClient';
import styles from '../styles/components/UserMenu.module.scss'

const UserMenu = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    
    const {mutate : signOut} = useMutation({
        mutationFn : logout,
        onSettled : () => {
            queryClient.clear();
            navigate('/login', {replace : true})
        }
    })

    function focusMenu() {
        setShowMenu(true);
    }

    function unfocusMenu() {
        setShowMenu(false)
    }

    return (
        <div className = {styles.userIcon}>
            <button className = {styles.iconButton} onFocus = {() => focusMenu()} onBlur = {() => unfocusMenu()}><img className ={styles.iconImg}></img></button>
            {
                showMenu && 
                <span className = {styles.menu}>
                    <button onMouseDown = {() => {navigate('/')}} className = {styles.button}>Profile</button>
                    <button onMouseDown = {() => {navigate('settings')}} className = {styles.button}>Settings</button>
                    <button onMouseDown = {() => {navigate('feed')}} className = {styles.button}>Feeds</button>
                    <button onMouseDown = {() => signOut()} className = {styles.button}>Logout</button>
                </span>
            }
        </div>
  )
}

//onClick = {() => {navigate('/')}}
//onClick = {() => {navigate('settings')}}

export default UserMenu
