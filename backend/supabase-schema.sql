-- Profiles table to store user information
CREATE TABLE IF NOT EXISTS profiles (
	uid VARCHAR(24) PRIMARY KEY, -- user id from mongodb
	avatar VARCHAR(255), -- avatar url from supabase storage
	created_at TIMESTAMP DEFAULT NOW()
);

-- Posts table to store user posts
CREATE TABLE IF NOT EXISTS posts (
	post_id SERIAL PRIMARY KEY,
	poster_id VARCHAR(24) NOT NULL,
	post_title TEXT NOT NULL,
    post_img_alt TEXT NOT NULL,
    post_img_url TEXT NOT NULL,
	likes_count INTEGER DEFAULT 0,
    person_name VARCHAR(60) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	
	FOREIGN KEY (poster_id) REFERENCES profiles(uid) ON DELETE CASCADE
);

-- Likes table to track user likes on posts
CREATE TABLE IF NOT EXISTS likes (
	liker_id VARCHAR(24) REFERENCES profiles(uid) ON DELETE CASCADE,
	liked_post_id INTEGER REFERENCES posts(post_id) ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT NOW(),
	
	PRIMARY KEY (liker_id, liked_post_id)
);

-- CREATE TABLE IF NOT EXISTS comments (
--     comment_id SERIAL PRIMARY KEY,
--     commenter_id VARCHAR(24) REFERENCES profiles(uid) ON DELETE CASCADE,
--     post_id INTEGER REFERENCES posts(post_id) ON DELETE CASCADE,
--     comment_text TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_poster_id ON posts(poster_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(liked_post_id);
CREATE INDEX IF NOT EXISTS idx_likes_created_at ON likes(created_at);
-- CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
-- CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
-- CREATE INDEX IF NOT EXISTS idx_comments_commenter_id ON comments(commenter_id);
CREATE INDEX IF NOT EXISTS idx_person_name ON posts(person_name);


CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET likes_count = likes_count + 1 WHERE post_id = NEW.liked_post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET likes_count = likes_count - 1 WHERE post_id = OLD.liked_post_id;
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically call the function
CREATE TRIGGER trigger_update_likes_count
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW
    EXECUTE FUNCTION update_likes_count();

-- CREATE OR REPLACE FUNCTION update_comments_count()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     IF TG_OP = 'INSERT' THEN
--         UPDATE posts SET comments_count = comments_count + 1 WHERE post_id = NEW.post_id;
--         RETURN NEW;
--     ELSIF TG_OP = 'DELETE' THEN
--         UPDATE posts SET comments_count = comments_count - 1 WHERE post_id = OLD.post_id;
--         RETURN OLD;
--     END IF;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER trigger_update_comments_count
--     AFTER INSERT OR DELETE ON comments
--     FOR EACH ROW
--     EXECUTE FUNCTION update_comments_count();

-- Enable Row Level Security on all tables
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- ========================================
-- PROFILES POLICIES
-- ========================================

-- Anyone can read profiles (public information)

-- CREATE POLICY "Profiles are viewable by everyone" ON profiles
--     FOR SELECT USING (true);

-- -- Users can only update their own profile
-- CREATE POLICY "Users can update own profile" ON profiles
--     FOR UPDATE USING (current_setting('app.user_id') = uid);

-- -- Users can only insert their own profile
-- CREATE POLICY "Users can insert own profile" ON profiles
--     FOR INSERT WITH CHECK (current_setting('app.user_id') = uid);

-- -- Users can only delete their own profile
-- CREATE POLICY "Users can delete own profile" ON profiles
--     FOR DELETE USING (current_setting('app.user_id') = uid);

-- ========================================
-- POSTS POLICIES
-- ========================================

-- Anyone can read posts (public feed)
CREATE POLICY "Posts are viewable by everyone" ON posts
    FOR SELECT USING (true);

-- Users can only create posts for themselves
-- CREATE POLICY "Users can create own posts" ON posts
--     FOR INSERT WITH CHECK (current_setting('app.user_id') = poster_id);

-- -- Users can only update their own posts
-- CREATE POLICY "Users can update own posts" ON posts
--     FOR UPDATE USING (current_setting('app.user_id') = poster_id);

-- -- Users can only delete their own posts
-- CREATE POLICY "Users can delete own posts" ON posts
--     FOR DELETE USING (current_setting('app.user_id') = poster_id);

-- ========================================
-- LIKES POLICIES
-- ========================================

-- Anyone can read likes (public information)
CREATE POLICY "Likes are viewable by everyone" ON likes
    FOR SELECT USING (true);

-- Users can only like posts for themselves
CREATE POLICY "Users can create own likes" ON likes
    FOR INSERT WITH CHECK (current_setting('app.user_id') = liker_id);

-- Users can only unlike their own likes
CREATE POLICY "Users can delete own likes" ON likes
    FOR DELETE USING (current_setting('app.user_id') = liker_id);

-- ========================================
-- COMMENTS POLICIES
-- ========================================

-- Anyone can read comments (public information)
CREATE POLICY "Comments are viewable by everyone" ON comments
    FOR SELECT USING (true);

-- Users can only create comments for themselves
CREATE POLICY "Users can create own comments" ON comments
    FOR INSERT WITH CHECK (current_setting('app.user_id') = commenter_id);

-- Users can only update their own comments
CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE USING (current_setting('app.user_id') = commenter_id);

-- Users can only delete their own comments
CREATE POLICY "Users can delete own comments" ON comments
    FOR DELETE USING (current_setting('app.user_id') = commenter_id);

-- ========================================
-- HELPER FUNCTION FOR CUSTOM AUTH
-- ========================================

-- Function to set current user ID for RLS policies
CREATE OR REPLACE FUNCTION set_current_user_id(user_id TEXT)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.user_id', user_id, false);
END;
$$ LANGUAGE plpgsql;

-- Alternative: Function to get current user ID (for debugging)
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS TEXT AS $$
BEGIN
    RETURN current_setting('app.user_id', true);
END;
$$ LANGUAGE plpgsql;