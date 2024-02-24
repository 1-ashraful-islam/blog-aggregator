import FeedList from "../components/FeedList";

export default function ExplorePage() {
  return (
    <>
      <div
        style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}
      >
        <h1>Explore All Feeds</h1>
        <p> Discover new blogs!</p>
      </div>
      <FeedList showAll={true} />
    </>
  );
}
