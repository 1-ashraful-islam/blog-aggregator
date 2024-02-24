import { Tooltip } from "react-tooltip";
import styles from "../styles/APIList.module.css";
import { FaLock } from "react-icons/fa";

function APIList() {
  const apiEndpoints = [
    {
      path: "/v1/readiness",
      method: "GET",
      description: "Check if the API endpoint is ready",
      isAuthenticated: false,
    },
    {
      path: "/v1/err",
      method: "GET",
      description: "Internal server error",
      isAuthenticated: false,
    },
    {
      path: "/v1/users",
      method: "POST",
      description: "Create a new user",
      isAuthenticated: true,
    },
    {
      path: "/v1/users",
      method: "GET",
      description: "Get user details",
      isAuthenticated: true,
    },
    {
      path: "/v1/feeds",
      method: "POST",
      description: "Create a new feed",
      isAuthenticated: true,
    },
    {
      path: "/v1/feeds",
      method: "GET",
      description: "Get all feeds",
      isAuthenticated: false,
    },
    {
      path: "/v1/feed_follows",
      method: "POST",
      description: "Create a new feed follow",
      isAuthenticated: true,
    },
    {
      path: "/v1/feed_follows",
      method: "GET",
      description: "Get all feed follows",
      isAuthenticated: true,
    },
    {
      path: "/v1/feed_follows/{feed_id}",
      method: "DELETE",
      description: "Delete a feed follow",
      isAuthenticated: true,
    },
    {
      path: "/v1/posts",
      method: "GET",
      description: "Get all posts",
      isAuthenticated: true,
    },
    {
      path: "/v1/posts/{feed_id}",
      method: "GET",
      description: "Get all posts for a feed id",
      isAuthenticated: false,
    },
  ];

  return (
    <div className={styles.apiContainer}>
      <p>
        (<FaLock /> - Authentication Required)
      </p>
      {apiEndpoints.map((api, index) => (
        <div key={index} className={styles.apiItem}>
          <div>
            <span
              className={`${styles.apiMethod} ${
                styles[api.method.toLowerCase()]
              }`}
            >
              {api.method}
            </span>
            <span className={styles.apiPath}>
              <code>{api.path}</code>
            </span>
            {api.isAuthenticated && (
              <>
                <span
                  className={styles.apiAuthBadge}
                  data-tooltip-id={`auth-tooltip-${index}`}
                  data-tooltip-content={`Requires authentication`}
                  data-tooltip-place="top"
                >
                  <FaLock />
                </span>
                <Tooltip id={`auth-tooltip-${index}`}></Tooltip>
              </>
            )}
          </div>
          <div className={styles.apiDescription}>{api.description}</div>
        </div>
      ))}
    </div>
  );
}

export default APIList;
