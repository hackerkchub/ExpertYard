import React, { useRef, useEffect, useState, useMemo } from "react";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { getTopRatedExpertsApi } from "../../../../shared/api/expertapi/filter.api";
import { useNavigate } from "react-router-dom";
import useChatRequest from "../../../../shared/hooks/useChatRequest.jsx";

export default function Experts() {
  const scrollContainerRef = useRef(null);

  const { experts, expertsLoading } = useExpert();
  const navigate = useNavigate();

  /* ========= HOOK (ALL CHAT LOGIC HERE) ========= */
  const { startChat, ChatPopups } = useChatRequest();

  const [topIds, setTopIds] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH TOP RATED ================= */
  useEffect(() => {
    const loadTopRated = async () => {
      try {
        setLoading(true);

        const res = await getTopRatedExpertsApi(6);

        const ids =
          res?.data?.data?.map((e) => e.expert_id || e.id) || [];

        setTopIds(ids);
      } catch (err) {
        console.error("Top rated load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadTopRated();
  }, []);

  /* ================= FILTER FROM CONTEXT ================= */
  const topExperts = useMemo(() => {
    if (!experts?.length) return [];

    return experts.filter((e) => topIds.includes(e.id));
  }, [experts, topIds]);

  /* ================= SCROLL ================= */
  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  if (loading || expertsLoading) {
    return <p style={{ padding: 20 }}>Loading experts...</p>;
  }

  return (
    <>
      <section className="section-expert">
        <div className="section-header">
          <h2>Popular Experts</h2>

          <div className="scroll-controls">
            <button className="scroll-btn left-btn" onClick={scrollLeft}>
              ◀
            </button>
            <button className="scroll-btn right-btn" onClick={scrollRight}>
              ▶
            </button>
          </div>
        </div>

        <div className="expert-container">
          <div className="expert-row" ref={scrollContainerRef}>
            {topExperts.map((ex) => (
              <div
                className="expert-card"
                key={ex.id}
                onClick={() => navigate(`experts/${ex.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={ex.profile_photo}
                  alt={ex.name}
                  className="avatar"
                />

                <h4>{ex.name}</h4>
                <p>{ex.position}</p>

                <div className="rating">★★★★★</div>

                <p className="price">
                  ₹{ex.chat_per_minute || 0} / min
                </p>

                <button
                  className="btn-primary small"
                  onClick={(e) => {
                    e.stopPropagation();
                    startChat({
                      expertId: ex.id,
                      chatPrice: ex.chat_per_minute,
                    });
                  }}
                >
                  Chat Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 AUTO POPUPS FROM HOOK */}
      <ChatPopups />
    </>
  );
}
