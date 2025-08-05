import React from 'react'
import { useState } from 'react'
import Post from '../components/Post'
import Spinner from '../components/Spinner'
import styles from '../styles/components/Feed.module.scss'
import { useMutation } from '@tanstack/react-query'
import { getPosts } from '../lib/api'
import Button from '../components/Button'

const Feed = () => {
    const [passKey, setPassKey] = useState('');
    const [success, setSuccess] = useState(false);
    
    const {mutate : findPerson, data : posts, isPending, isError, error} = useMutation({
      mutationFn : getPosts,
      onSuccess : () => setSuccess(true),
      
    });
  
    return (
        //Gatekeep here, must have a use state to accept name
        //form element with input, upon clicking the button, calls mutation function with name as an input
        //if success -> change state, 
        
          <>
            {
              !success ? 
                <div className={styles.formContainer}>
                  <form className={styles.form}>
                    <label htmlFor='passKey' className={styles.formLabel}>Enter Name</label>
                    <input 
                      id='passKey'
                      className={styles.formInput}
                      placeholder="Enter Name" 
                      value={passKey} 
                      onChange={(e) => setPassKey(e.target.value)}
                    />
                  </form>
                  {isError && <p className = {styles.err}>{error.message || 'An error occured'}</p>}
                  <Button type='login' onClick={() => findPerson(passKey)} className={styles.formButton} disabled={isPending}>
                    {isPending ? 'Loading...' : 'Find'}
                  </Button>
                  {isPending && (
                    <div className={styles.loadingContainer}>
                      <Spinner />
                    </div>
                  )}
                </div>
              :
              <div className = {styles.feed}>
              <h1 className = {styles.header}>My Feed</h1>
              {posts.map(post => <Post title = {post.post_title} image = {post.post_img_url} alt = {post.img_alt}></Post>)}
              </div>
            }
          </>
  )
}

export default Feed
