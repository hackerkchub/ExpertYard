import React, { useRef, useEffect, useState, useMemo } from "react";
import { usePublicExpert as useExpert } from "../../context/PublicExpertContext";
import { getTopRatedExpertsApi } from "../../../../shared/api/expertapi/filter.api";
import { getExpertPriceByIdApi } from "../../../../shared/api/expertapi/price.api";
import { useNavigate } from "react-router-dom";
import useChatRequest from "../../../../shared/hooks/useChatRequest.jsx";

export default function Experts() {
  const scrollContainerRef = useRef(null);
  const { experts, expertsLoading } = useExpert();
  const navigate = useNavigate();
  const { startChat, ChatPopups } = useChatRequest();

  const [topIds, setTopIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({});

  /* ================= FETCH TOP RATED ================= */
  useEffect(() => {
    const loadTopRated = async () => {
      try {
        setLoading(true);
        const res = await getTopRatedExpertsApi(20); 
        const ids = res?.data?.data?.map((e) => e.expert_id || e.id) || [];
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

  /* ================= FETCH PRICES (STRICT DOUBLE BATCHING) ================= */
  useEffect(() => {
    let isMounted = true;

    const loadPrices = async () => {
      if (!topExperts.length) return;

      // ✅ STEP 1: Wait 3 seconds to clear Lighthouse Critical Path
      const initialTimer = setTimeout(async () => {
        try {
          // Pehle sirf top 6 experts (Priority Batch)
          const priorityBatch = topExperts.slice(0, 6);
          const remainingBatch = topExperts.slice(6);

          const fetchBatchData = async (list) => {
            const promises = list.map((ex) =>
              getExpertPriceByIdApi(ex.id)
                .then((res) => ({
                  id: ex.id,
                  price: Number(res?.data?.chat_per_minute || 0),
                }))
                .catch(() => ({ id: ex.id, price: 0 }))
            );
            return await Promise.all(promises);
          };

          // Fetch First Batch
          const results1 = await fetchBatchData(priorityBatch);
          if (isMounted) {
            const map1 = {};
            results1.forEach((item) => (map1[item.id] = item.price));
            setPrices((prev) => ({ ...prev, ...map1 }));
          }

          // ✅ STEP 2: Fetch Remaining 14 experts after another 2 seconds
          setTimeout(async () => {
            if (!isMounted) return;
            const results2 = await fetchBatchData(remainingBatch);
            const map2 = {};
            results2.forEach((item) => (map2[item.id] = item.price));
            setPrices((prev) => ({ ...prev, ...map2 }));
          }, 2000);

        } catch (error) {
          console.error("Price Batch Error:", error);
        }
      }, 3000);

      return () => {
        isMounted = false;
        clearTimeout(initialTimer);
      };
    };

    loadPrices();
  }, [topExperts]);

  /* ================= HELPER FUNCTIONS ================= */
  const scrollLeft = () => scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    return words.length === 1 
      ? words[0].charAt(0).toUpperCase() 
      : (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  if (loading || expertsLoading) {
    return <div style={{ padding: 40, textAlign: 'center', minHeight: '300px' }}>Loading top experts...</div>;
  }

  return (
    <>
      <section className="section-expert">
        <div className="section-header">
          <h2>Popular Experts</h2>
          <div className="scroll-controls">
            <button className="scroll-btn" onClick={scrollLeft}>◀</button>
            <button className="scroll-btn" onClick={scrollRight}>▶</button>
          </div>
        </div>

        <div className="expert-container">
          <div className="expert-row" ref={scrollContainerRef}>
            {topExperts.map((ex) => (
              <div
                className="expert-card"
                key={ex.id}
                onClick={() => navigate(`experts/${ex.id}`)}
              >
                {ex.profile_photo ? (
                  <img 
                    src={ex.profile_photo} 
                    alt={ex.name} 
                    className="avatar" 
                    loading="lazy" 
                    decoding="async"
                    width="100" 
                    height="100" 
                  />
                ) : (
                  <div className="avatar-fallback">{getInitials(ex.name)}</div>
                )}

                <h4>{ex.name}</h4>
                <p>{ex.position}</p>
                <div className="rating">★★★★★</div>

                <p className="price">
                  {prices[ex.id] !== undefined ? `₹${prices[ex.id]} / min` : "..."}
                </p>

                <button
                  className="btn-primary small"
                  onClick={(e) => {
                    e.stopPropagation();
                    startChat({
                      expertId: ex.id,
                      chatPrice: prices[ex.id] || 0,
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
      <ChatPopups />
    </>
  );
}