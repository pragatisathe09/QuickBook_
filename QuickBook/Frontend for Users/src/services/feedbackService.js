export const submitFeedback = async (reservationId, feedback) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feedbacks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        reservationId,
        rating: feedback.rating,
        comment: feedback.feedback
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};