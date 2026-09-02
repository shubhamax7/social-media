import { useContext, useEffect, useRef, useState } from "react";
import Post from "./Post";
import { PostList as PostListData } from "../store/post-list-store";
import { useSearch } from "../store/SearchContext";
import WelcomeMessage from "./WelcomeMessage";
import LoadingSpinner from "./LoadingSpinner";

const PAGE_SIZE = 10;

const PostList = () => {
  const { postList, fetchStatus, addInitialPosts, setFetchStatus } =
    useContext(PostListData);
  const { searchQuery } = useSearch();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Use a ref to track whether initial fetch was done (avoids StrictMode double-fetch)
  const fetchDoneRef = useRef(false);

  useEffect(() => {
    if (fetchDoneRef.current) return;
    fetchDoneRef.current = true;

    const controller = new AbortController();
    setFetchStatus("fetching");

    fetch("https://dummyjson.com/posts?limit=100", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const normalizedPosts = data.posts.map((post) => {
          let reactions = post.reactions;
          if (typeof reactions === "object" && reactions !== null) {
            const { likes = 0, dislikes = 0 } = reactions;
            reactions = likes + dislikes;
          }
          return {
            ...post,
            reactions: parseInt(reactions, 10) || 0,
            liked: false,
            createdAt: new Date(
              Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
          };
        });
        addInitialPosts(normalizedPosts);
        setFetchStatus("idle");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Failed to fetch posts:", err);
        setFetchStatus("error");
      });

    return () => controller.abort();
  }, []);

  // Filter posts by search query
  const filteredPosts = postList.filter((post) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.title?.toLowerCase().includes(q) ||
      post.body?.toLowerCase().includes(q) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleLoadMore = () => {
    setVisibleCount((c) => c + PAGE_SIZE);
  };

  const handleRetry = () => {
    fetchDoneRef.current = false;
    // Re-trigger by forcing a re-render via a state bump
    setFetchStatus("idle");
    setTimeout(() => {
      fetchDoneRef.current = false;
      const controller = new AbortController();
      setFetchStatus("fetching");
      fetch("https://dummyjson.com/posts?limit=100", { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          const normalized = data.posts.map((p) => {
            let reactions = p.reactions;
            if (typeof reactions === "object" && reactions !== null) {
              const { likes = 0, dislikes = 0 } = reactions;
              reactions = likes + dislikes;
            }
            return { ...p, reactions: parseInt(reactions, 10) || 0, liked: false };
          });
          addInitialPosts(normalized);
          setFetchStatus("idle");
        })
        .catch(() => setFetchStatus("error"));
    }, 0);
  };

  if (fetchStatus === "fetching") return <LoadingSpinner />;

  if (fetchStatus === "error") {
    return (
      <div className="error-state">
        <div className="error-state-icon">⚠️</div>
        <h2 className="error-state-title">Failed to load posts</h2>
        <p className="error-state-msg">
          Something went wrong while fetching the feed. Check your connection and try again.
        </p>
        <button className="btn-retry" onClick={handleRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (!filteredPosts.length && searchQuery.trim()) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h2 className="empty-state-title">No results for "{searchQuery}"</h2>
        <p className="empty-state-subtitle">
          Try different keywords or check for typos.
        </p>
      </div>
    );
  }

  if (!filteredPosts.length) return <WelcomeMessage />;

  return (
    <>
      <div className="feed-header">
        <h1 className="feed-title">Your Feed</h1>
        <span className="feed-count">{filteredPosts.length} posts</span>
      </div>

      <div className="post-feed">
        {visiblePosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="load-more-wrapper">
          <button className="btn-load-more" onClick={handleLoadMore}>
            Load more posts
          </button>
        </div>
      )}
    </>
  );
};

export default PostList;
