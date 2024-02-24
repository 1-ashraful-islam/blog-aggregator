import React, { useState, useEffect, useRef } from "react";
import PostCard, { Post } from "./PostCard";
import { useAuth } from "./AuthContext";

const PostList: React.FC<{
  feed_id: string;
  initialOffset: string;
  initialLimit: string;
}> = ({ feed_id, initialOffset, initialLimit }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [fetchError, setFetchError] = useState<string>("");
  const [offset, setOffset] = useState(initialOffset);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLLIElement | null>(null);
  const { apiKey, isLoggedIn } = useAuth();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setOffset((prevOffset) =>
            (parseInt(prevOffset) + parseInt(initialLimit)).toString()
          );
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isFetching, initialLimit]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsFetching(true);
      try {
        const url = new URL(`http://localhost:8080/v1/posts/${feed_id}`);
        const params = new URLSearchParams({ offset, limit: initialLimit });
        url.search = params.toString();
        const response = await fetch(url.toString(), {
          headers: isLoggedIn ? { Authorization: `Bearer ${apiKey}` } : {},
        });
        if (response.ok) {
          const newPosts: Post[] = await response.json();
          if (newPosts) {
            setPosts((prevPosts) => {
              // greedy approach: Check if the first new post is unique among the last `limit` number of posts
              const lastIndex = Math.max(
                prevPosts.length - parseInt(initialLimit),
                0
              );
              const recentPosts = prevPosts.slice(lastIndex);
              const isFirstNewPostUnique = !recentPosts.some(
                (recentPost) => recentPost.id === newPosts[0].id
              );

              if (isFirstNewPostUnique) {
                return [...prevPosts, ...newPosts];
              }

              // Return the previous posts if the first new post is not unique
              return prevPosts;
            });
            setHasMore(newPosts.length > 0);
          } else {
            setHasMore(false);
          }

          setIsFetching(false);
        }
      } catch (error) {
        setFetchError("Error fetching / refreshing Posts");
        setIsFetching(false);
      }
    };

    fetchPosts();
  }, [apiKey, feed_id, initialLimit, isLoggedIn, offset]);

  const getBaseUrl = (url: string) => {
    const urlObject = new URL(url);
    return urlObject.host.toString();
  };

  return (
    <>
      {fetchError && <div className="network-error">{fetchError}</div>}
      <ul className={feed_id !== "" ? "horizontal-list" : "gallery-list"}>
        {posts.map((post, index) => (
          <li key={post.id}>
            <PostCard
              post={post}
              index={index}
              url={feed_id === "" ? getBaseUrl(post.url) : ""}
            />
          </li>
        ))}
        {hasMore && !isFetching && (
          <li ref={loaderRef}>Loading more posts...</li>
        )}
        {isFetching && <li>Loading...</li>}
        {!hasMore && <li>No more posts to Fetch</li>}
      </ul>
    </>
  );
};

export default PostList;
