import React, { useState } from "react";
import { submitWorkspaceReview } from "../../../api/workspace.api";

export default function ReviewTab({ bookingId, workspace, snapshot }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await submitWorkspaceReview({
        booking_id: bookingId,
        expert_id: snapshot?.expert?.expert_id,
        rating,
        comment
      });

      if (response.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      alert("Error submitting review.");
    }
  };

  if (submitted) {
    return (
      <div style={{ background: '#ecfdf5', padding: '1.5rem', borderRadius: '8px', border: '1px solid #6ee7b7' }}>
        <h4 style={{ margin: 0, color: '#065f46' }}>Thank You for Your Feedback! ⭐</h4>
        <p style={{ margin: '0.25rem 0 0 0', color: '#047857' }}>Your review has been published on the expert profile.</p>
      </div>
    );
  }

  return (
    <div className="tab-review">
      <h3 className="tab-panel-title">Rating & Service Feedback</h3>

      <form onSubmit={handleSubmitReview} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.5rem' }}>Star Rating</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
            <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
            <option value={3}>⭐⭐⭐ (3 - Average)</option>
            <option value={2}>⭐⭐ (2 - Poor)</option>
            <option value={1}>⭐ (1 - Terrible)</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.5rem' }}>Review Comments</label>
          <textarea
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700' }}>
          Submit Review
        </button>
      </form>
    </div>
  );
}