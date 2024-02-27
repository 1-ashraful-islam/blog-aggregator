import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaLink, FaPlus, FaTrash } from "react-icons/fa";
import NewFeedForm from "./NewFeedForm";
import PostList from "./PostList";
import styles from "../styles/FeedList.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

// Set app element for accessibility; typically set to your root app element
Modal.setAppElement("#root");

interface Feed {
  id: string;
  title: string;
  url: string;
  follow: boolean;
}

const fetchFeeds = async (
  isLoggedIn: boolean,
  showAll: boolean,
  apiKey: string
): Promise<Feed[]> => {
  if (isLoggedIn) {
    const followsUrl = `http://localhost:8080/v1/feed_follows`;
    const headers = { Authorization: `Bearer ${apiKey}` };
    const followedFeedsResponse = await fetchWithRetry(followsUrl, { headers });
    if (!followedFeedsResponse.ok) {
      throw new Error(`HTTP error! status: ${followedFeedsResponse.status}`);
    }
    const followedFeeds: Feed[] = await followedFeedsResponse.json();

    if (!showAll) {
      return followedFeeds.map((feed) => ({ ...feed, follow: true }));
    } else {
      const allFeedsUrl = `http://localhost:8080/v1/feeds`;
      const allFeedsResponse = await fetchWithRetry(allFeedsUrl, { headers });
      if (!allFeedsResponse.ok) {
        throw new Error(`HTTP error! status: ${allFeedsResponse.status}`);
      }
      const allFeeds: Feed[] = await allFeedsResponse.json();
      const followedIds = new Set(followedFeeds.map((feed) => feed.id));
      return allFeeds.map((feed) => ({
        ...feed,
        follow: followedIds.has(feed.id),
      }));
    }
  } else {
    const allFeedsUrl = `http://localhost:8080/v1/feeds`;
    const allFeedsResponse = await fetchWithRetry(allFeedsUrl);
    if (!allFeedsResponse.ok) {
      throw new Error(`HTTP error! status: ${allFeedsResponse.status}`);
    }
    const allFeeds: Feed[] = await allFeedsResponse.json();
    return allFeeds.map((feed) => ({ ...feed, follow: false }));
  }
};

const fetchWithRetry = async (
  url: string,
  options?: RequestInit,
  maxRetries = 3,
  retryDelay = 2000
): Promise<Response> => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      console.error("Error fetching data", error);
      retries++;
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
  throw new Error(`Failed to fetch data after ${maxRetries} retries`);
};

const FeedList: React.FC<{ showAll: boolean }> = ({ showAll }) => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [fetchError, setFetchError] = useState<string>("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { apiKey, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeeds(isLoggedIn, showAll, apiKey)
      .then(setFeeds)
      .catch((error) => {
        console.error("Error fetching feeds", error);
        setFetchError("Error fetching / refreshing feeds");
      });
  }, [apiKey, isLoggedIn, showAll]);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleFeedFollow = async (feed_id: string) => {
    if (!isLoggedIn) {
      toast.error("Please login with an API key to follow a feed", {
        position: "top-center",
        autoClose: 1500,
      });
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/v1/feed_follows`,
        { feed_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      if (response.status === 201) {
        setFeeds(
          feeds.map((f) => (f.id === feed_id ? { ...f, follow: true } : f))
        );
        toast.success("Feed followed successfully", {
          position: "top-center",
          autoClose: 1500,
        });
      }
    } catch (error) {
      console.error("Error following feed", error);
    }
  };

  const handleFeedFollowDelete = async (feed_id: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/v1/feed_follows/${feed_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      if (response.status === 200) {
        if (showAll) {
          setFeeds(
            feeds.map((feed) =>
              feed.id === feed_id ? { ...feed, follow: false } : feed
            )
          );
        } else {
          setFeeds(feeds.filter((feed) => feed.id !== feed_id));
        }

        toast.success("Feed unfollowed successfully", {
          position: "top-center",
          autoClose: 1500,
        });
      }
    } catch (error) {
      console.error("Error unfollowing feed", error);
    }
  };

  return (
    <>
      {fetchError && <div className="network-error">{fetchError}</div>}
      <ul className={styles.feedList}>
        <li>
          <div>
            <h2>
              <button onClick={toggleFormVisibility}>
                <strong>+</strong>{" "}
                {isFormVisible ? "Cancel new feed" : "Add a new Feed"}
              </button>
            </h2>
            {isFormVisible && <NewFeedForm />}
          </div>
        </li>
        {feeds
          .sort((a) => (a.follow === false ? -1 : 1))
          .map((feed) => (
            <li key={feed.id}>
              <h3>
                {feed.title}{" "}
                <a href={feed.url || "#"} target="_blank" rel="noreferrer">
                  <FaLink />
                </a>{" "}
                {feed.follow ? (
                  <button
                    className={styles.unfollowButton}
                    onClick={() => handleFeedFollowDelete(feed.id)}
                  >
                    <FaTrash /> Unfollow the feed
                  </button>
                ) : (
                  <button
                    className={styles.followButton}
                    onClick={() => handleFeedFollow(feed.id)}
                  >
                    <FaPlus /> Follow the feed
                  </button>
                )}
              </h3>

              <PostList
                feed_id={feed.id}
                initialOffset={`${0}`}
                initialLimit={`${10}`}
              />
            </li>
          ))}
      </ul>
    </>
  );
};

export default FeedList;
