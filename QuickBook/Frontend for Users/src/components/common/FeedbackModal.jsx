import React, { useState } from 'react';
import styles from './FeedbackModal.module.css';

export default function FeedbackModal({ isOpen, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please share your experience');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, feedback: comment });
      setComment('');
      setRating(5);
      onClose();
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton}>
          ✕
        </button>

        <h2 className={styles.modalTitle}>Room Feedback</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.ratingSection}>
            <p className={styles.ratingTitle}>How would you rate your experience?</p>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={styles.starButton}
                  onClick={() => setRating(star)}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill={star <= rating ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 2l4.326 8.766L30 12.27l-7 6.818 1.652 9.637L16 24.773l-8.652 3.952L9 19.088 2 12.27l9.674-1.504L16 2z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.feedbackSection}>
            <label htmlFor="feedback" className={styles.feedbackLabel}>
              Share your experience
            </label>
            <textarea
              id="feedback"
              className={styles.feedbackInput}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}