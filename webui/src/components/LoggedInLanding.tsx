import { useState } from "react";
import FeedList from "./FeedList";
import PostList from "./PostList";

export default function LoggedInLanding() {
  const [viewMode, setViewMode] = useState("byFeed");

  const handleViewModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewMode(e.target.value);
  };

  return (
    <div>
      <div>
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            display: "block",
            justifyContent: "center",
          }}
        >
          <h1> Posts from your curated feeds</h1>
          <select
            value={viewMode}
            onChange={handleViewModeChange}
            style={{ fontSize: "1.2em" }}
          >
            <option value="byFeed">By Feed</option>
            <option value="aggregated">Aggregated</option>
          </select>
        </div>
      </div>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {viewMode === "aggregated" ? (
          <PostList feed_id="" initialLimit="10" initialOffset="0" />
        ) : (
          <FeedList showAll={false} />
        )}
      </div>
    </div>
  );
}
