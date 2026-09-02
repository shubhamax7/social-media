const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-header">
      <div className="skeleton skeleton-avatar" />
      <div className="skeleton-text-group">
        <div className="skeleton skeleton-line" style={{ width: "40%" }} />
        <div className="skeleton skeleton-line" style={{ width: "25%" }} />
      </div>
    </div>
    <div className="skeleton skeleton-title" />
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div className="skeleton skeleton-body-line" />
      <div className="skeleton skeleton-body-line" />
      <div className="skeleton skeleton-body-line" style={{ width: "60%" }} />
    </div>
    <div className="skeleton-tags">
      <div className="skeleton skeleton-tag" />
      <div className="skeleton skeleton-tag" style={{ width: "80px" }} />
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} aria-label="Loading posts" aria-busy="true">
    <div className="feed-header" style={{ marginBottom: 0 }}>
      <div className="skeleton" style={{ width: "120px", height: "28px", borderRadius: "8px" }} />
      <div className="skeleton" style={{ width: "60px", height: "24px", borderRadius: "999px" }} />
    </div>
    {[1, 2, 3, 4].map((i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default LoadingSpinner;
