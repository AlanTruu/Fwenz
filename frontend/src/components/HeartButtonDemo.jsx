import React, { useState } from 'react';
import HeartButton from './HeartButton';
import styles from '../styles/components/HeartButtonDemo.module.scss';

const HeartButtonDemo = () => {
    const [likedPosts, setLikedPosts] = useState({
        post1: false,
        post2: false,
        post3: false,
        post4: false
    });

    const handleLike = (postId, isLiked) => {
        setLikedPosts(prev => ({
            ...prev,
            [postId]: isLiked
        }));
        
        // You can add API call here to save the like state
        console.log(`Post ${postId} ${isLiked ? 'liked' : 'unliked'}`);
    };

    return (
        <div className={styles.demoContainer}>
            <h2 className={styles.title}>Heart Button Demo</h2>
            
            <div className={styles.sizeDemo}>
                <h3>Different Sizes:</h3>
                <div className={styles.buttonRow}>
                    <div className={styles.buttonItem}>
                        <span>Small:</span>
                        <HeartButton 
                            size="small" 
                            onClick={(isLiked) => handleLike('small', isLiked)}
                            isLiked={likedPosts.small}
                        />
                    </div>
                    
                    <div className={styles.buttonItem}>
                        <span>Medium:</span>
                        <HeartButton 
                            size="medium" 
                            onClick={(isLiked) => handleLike('medium', isLiked)}
                            isLiked={likedPosts.medium}
                        />
                    </div>
                    
                    <div className={styles.buttonItem}>
                        <span>Large:</span>
                        <HeartButton 
                            size="large" 
                            onClick={(isLiked) => handleLike('large', isLiked)}
                            isLiked={likedPosts.large}
                        />
                    </div>
                    
                    <div className={styles.buttonItem}>
                        <span>XLarge:</span>
                        <HeartButton 
                            size="xlarge" 
                            onClick={(isLiked) => handleLike('xlarge', isLiked)}
                            isLiked={likedPosts.xlarge}
                        />
                    </div>
                </div>
            </div>
            
            <div className={styles.postDemo}>
                <h3>Post Examples:</h3>
                <div className={styles.post}>
                    <h4>Amazing Sunset Photo</h4>
                    <p>Check out this beautiful sunset I captured today!</p>
                    <div className={styles.postActions}>
                        <HeartButton 
                            size="medium" 
                            onClick={(isLiked) => handleLike('post1', isLiked)}
                            isLiked={likedPosts.post1}
                        />
                        <span className={styles.likeCount}>
                            {likedPosts.post1 ? '1 like' : '0 likes'}
                        </span>
                    </div>
                </div>
                
                <div className={styles.post}>
                    <h4>Delicious Recipe</h4>
                    <p>Just made this incredible pasta dish!</p>
                    <div className={styles.postActions}>
                        <HeartButton 
                            size="medium" 
                            onClick={(isLiked) => handleLike('post2', isLiked)}
                            isLiked={likedPosts.post2}
                        />
                        <span className={styles.likeCount}>
                            {likedPosts.post2 ? '1 like' : '0 likes'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeartButtonDemo; 