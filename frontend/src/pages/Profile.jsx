import React from 'react'
import useAuth from '../hooks/useAuth'
import Alert from '../components/Alert';

const Profile = () => {
    const {user} = useAuth();
    const {email, verified, createdAt} = user;
  
    return (
    <div>
        <h1>My Account</h1>
        {!verified && <Alert success = {false} message = {'Account is not verified'}></Alert>}
        <span>{email}</span>
        <span>Created at {new Date(createdAt).toLocaleDateString()}</span>
    </div>
  )
}

export default Profile
