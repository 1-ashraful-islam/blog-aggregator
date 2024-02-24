import FeedList from "./FeedList";
import LoginForm from "./LoginForm";

export default function NotLoggedInLanding() {
  return (
    <>
      <div
        style={{
          // display: "flex",
          justifyContent: "center",
          textAlign: "center",
          maxWidth: "1000px",
          margin: "auto",
        }}
      >
        <div>
          <h1 style={{ fontSize: "4em" }}>Welcome to the blog aggregator!</h1>
          <p style={{ fontSize: "1.5em" }}>
            Keep up with your favorite blogs, find new blogs that resonate with
            you, or explore posts from a curated list of rss feeds
          </p>
        </div>
        <div style={{ margin: "20px 0" }}>
          <LoginForm />
          <p>Log in with your API key to see posts from your curated list</p>
        </div>

        <br />
        <h2 style={{ fontSize: "2.5em" }}> Discover New RSS feeds</h2>
      </div>
      <FeedList showAll={true} />
    </>
  );
}
