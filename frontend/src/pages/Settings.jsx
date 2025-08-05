import React from 'react'
import useSessions from '../hooks/useSessions'
import Spinner from '../components/Spinner'
import SessionCard from '../components/SessionCard'
import styles from '../styles/components/Settings.module.scss'
import useDeleteAllSessions from '../hooks/useDeleteAllSessions'
import Button from '../components/Button'

const Settings = () => {
    const {sessions, isPending, isSuccess, isError} = useSessions()
    const {clearSessions, ...rest} = useDeleteAllSessions()
  
    return (
    <div className = {styles.settingsContainer}>
        <div >
            <h1 className = {styles.header}>Settings</h1>
        </div>

        <div className = {styles.avatarContainer}> 
            <h2 className = {styles.header}>Change Profile Picture</h2>
            <img className = {styles.settingsAvatar} src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"></img>
            <label htmlFor = "avatarInput" className = {styles.settingsAvatarInputLabel}>Upload Avatar image</label>
            <input type = "file" accept = "image/*"></input>
            <Button type = "login">Save</Button>
        </div>

        <div>
            <h1 className = {styles.header}>My Sessions</h1>
            {isPending && <Spinner />}
            {isError && <p className = {styles.errorMessage}>Failed to get sessions.</p>}
            {isSuccess && 
                <div className = {styles.sessions}>
                    {sessions.map((session) => (<SessionCard key = {session._id} session = {session} />))}
                    <button onClick = {clearSessions} className = {styles.deleteButton}>Delete All Sessions </button>
                </div>
            }
        </div>
    </div>
  )
}

export default Settings
