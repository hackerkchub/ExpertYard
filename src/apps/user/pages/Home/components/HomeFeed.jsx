import React from "react";
import FeedCardRenderer from "./FeedCardRenderer";
import FeedSkeleton from "./FeedSkeleton";

const HomeFeed = React.memo(function HomeFeed({
  items,
  loading,
  loadingMore,
  error,
  hasMore,
  loadMoreRef,
  onRetry,
}) {
  return (
    <section className="home-feed-stream" aria-label="Home discovery feed">
      {items.map((item, index) => (
        <FeedCardRenderer item={item} key={`${item.type}-${item.id}-${index}`} />
      ))}

      {loading ? <FeedSkeleton count={5} /> : null}

      {!loading && error ? (
        <div className="feed-state">
          <strong>Unable to load feed</strong>
          <p>{error}</p>
          <button type="button" onClick={onRetry}>Try again</button>
        </div>
      ) : null}

      {!loading && !error && !items.length ? (
        <div className="feed-state">
          <strong>No recommendations found</strong>
          <p>Try another category or clear the selected location.</p>
        </div>
      ) : null}

      <div ref={loadMoreRef} className="feed-load-anchor" aria-hidden="true" />
      {loadingMore ? <FeedSkeleton count={2} /> : null}
      {!loading && !loadingMore && items.length > 0 && !hasMore ? (
        <div className="feed-end">You are all caught up.</div>
      ) : null}
    </section>
  );
});

export default HomeFeed;
