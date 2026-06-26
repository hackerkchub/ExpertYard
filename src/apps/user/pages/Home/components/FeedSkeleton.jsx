import React from "react";

export default function FeedSkeleton({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <article className="feed-card feed-card--skeleton" key={index}>
          <div className="feed-skeleton-head">
            <span />
            <div>
              <b />
              <i />
            </div>
          </div>
          <p />
          <p />
          <div className="feed-skeleton-media" />
        </article>
      ))}
    </>
  );
}
