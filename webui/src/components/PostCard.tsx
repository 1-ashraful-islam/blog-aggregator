import { FaLink } from "react-icons/fa";
import styles from "../styles/PostCard.module.css";
import { format } from "date-fns";

export interface Post {
  id: string;
  title: string;
  url: string;
  description: string;
  publish_date: string;
}

export default function PostCard({
  post,
  index,
  url,
}: {
  post: Post;
  index: number;
  url: string;
}) {
  const formattedDate = format(post.publish_date, "dd MMM yyyy");
  return (
    <div className={styles.postCardContainer}>
      <div className={styles.flexContainer}>
        <span>{formattedDate}</span>{" "}
        <span className={styles.numericBadge}>{index + 1}</span>
      </div>

      <h4>
        {post.title || "Post Title"}{" "}
        <a href={post.url || "#"} target="_blank" rel="noreferrer">
          <FaLink />
        </a>
      </h4>
      <p>
        {post.description && post.description.length > 300
          ? post.description.slice(0, 297) + "..."
          : post.description || "Post Description"}
      </p>
      {url && <p style={{ color: "#666" }}>{url}</p>}
    </div>
  );
}
