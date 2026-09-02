const WelcomeMessage = () => (
  <div className="empty-state">
    <div className="empty-state-icon" aria-hidden="true">✨</div>
    <h2 className="empty-state-title">No posts yet</h2>
    <p className="empty-state-subtitle">
      Be the first to share something with the community. Hit "Create Post" to get started!
    </p>
  </div>
);

export default WelcomeMessage;
