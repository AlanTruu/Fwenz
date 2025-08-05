import React from 'react'
import useDeleteSession from '../hooks/useDeleteSession';
import styles from '../styles/components/SessionCard.module.scss'
import Button from './Button'

const SessionCard = ({session}) => {
    const {_id, createdAt, userAgent, isCurrent} = session;
    const {deleteSession, isPending} = useDeleteSession(_id)

    return (
    <div className = {styles.card}>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <p className = {styles.text}>{new Date(createdAt).toLocaleString('en-US')}</p>
        <p className = {styles.text}>{isCurrent && "(Current Session)"}</p>
        <p className = {styles.text}>{userAgent}</p>
        {!isCurrent && <Button type = 'deleteSession' onClick = {deleteSession}>{isPending ? <i class = 'fa fa-spinner fa-spin'></i> : "Delete Session"}</Button>}
    </div>
  )
}

export default SessionCard
