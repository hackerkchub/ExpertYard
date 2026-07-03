import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  BadgeCheck,
  Clock3,
} from "lucide-react";

export default function LatestPosts({
  posts = [],
  loading,
}) {

  if (loading) {

    return (

      <section className="home-section">

        <div className="home-section-header">

          <h2>Latest Expert Posts</h2>

        </div>

        <div className="latest-post-list">

          {[1,2,3].map((item)=>(

            <div
              key={item}
              className="latest-post-card home-card"
            >

              <div className="latest-post-header">

                <div className="latest-avatar skeleton"/>

                <div className="latest-post-info">

                  <span className="skeleton latest-line"/>

                  <span className="skeleton latest-line short"/>

                </div>

              </div>

              <div className="latest-image skeleton"/>

              <span className="skeleton latest-line"/>

              <span className="skeleton latest-line"/>

            </div>

          ))}

        </div>

      </section>

    );

  }

  if (!posts.length) return null;

  return (

    <section className="home-section">

      <div className="home-section-header">

        <h2>

          Latest Expert Posts

        </h2>

        <Link to="/user/posts">

          View All

        </Link>

      </div>

      <div className="latest-post-list">

        {posts.map((post)=>(

          <article
            key={post.id}
            className="latest-post-card home-card"
          >

            <div className="latest-post-header">

              <img
                src={post.profile_photo}
                alt={post.expert_name}
                className="latest-avatar"
              />

              <div className="latest-post-info">

                <h3>

                  {post.expert_name}

                  <BadgeCheck
                    size={16}
                    className="verified-icon"
                  />

                </h3>

                <span>

                  <Clock3 size={14}/>

                  {post.created_at || "Just now"}

                </span>

              </div>

            </div>

            <p className="latest-post-description">

              {post.description}

            </p>

            {post.image_url && (

              <div className="latest-image">

                <img
                  src={post.image_url}
                  alt={post.title}
                />

              </div>

            )}

            <div className="latest-post-stats">

              <span>

                ❤️ {post.likes || 0} Likes

              </span>

              <span>

                💬 {post.comments_count || 0} Comments

              </span>

            </div>

            <div className="latest-post-actions">

              <button>

                <Heart size={18}/>

                Like

              </button>

              <button>

                <MessageCircle size={18}/>

                Comment

              </button>

              <button>

                <Share2 size={18}/>

                Share

              </button>

            </div>

          </article>

        ))}

      </div>

    </section>

  );

}