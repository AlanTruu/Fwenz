import React, { useState } from 'react'
import Button from './Button'
import styles from '../styles/components/Post.module.scss'
import HeartButton from './HeartButton'

const Post = (props) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    const handleLike = (liked) => {
        setIsLiked(liked);
        if (props.onClick) {
            props.onClick(liked);
        }
    };

    return (
        <div className={styles.postContainer}>
            <div className={styles.postHeader}>
                <h3 className={styles.postTitle}>{props.title}</h3>
            </div>
            
            <div className={styles.imageContainer}>
                <img 
                    className={styles.postImage} 
                    src={props.image} 
                    alt={props.alt || props.title}
                    loading="lazy"
                />
            </div>
            
            {/* <div className={styles.postActions}>
                <HeartButton 
                    size="medium"
                    onClick={handleLike}
                    isLiked={isLiked}
                />
                <span className={styles.likeCount}>
                    {isLiked ? '1 like' : '0 likes'}
                </span>
                <span className = {styles.comments}><Button type = 'commentsButton' onClick = {() => setIsCommentsOpen(!isCommentsOpen)}>Comments</Button></span>
            </div>
            {isCommentsOpen && <div className = {styles.commentsContainer}> 
                
                
            </div>} */}
        </div>
    )
}

export default Post