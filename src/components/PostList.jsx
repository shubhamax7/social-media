import { useContext, useEffect, useRef, useState } from "react";
import Post from "./Post";
import StoriesBar from "./StoriesBar";
import QuickCompose from "./QuickCompose";
import { PostList as PostListData } from "../store/post-list-store";
import { useSearch } from "../store/SearchContext";
import WelcomeMessage from "./WelcomeMessage";
import LoadingSpinner from "./LoadingSpinner";
import { FiTrendingUp, FiSparkles, FiCode, FiBookmark, FiX, FiRefreshCw } from "react-icons/fi";

const PAGE_SIZE = 8;

const PostList = () => {
  const {
    postList,
    fetchStatus,
    activeTag,
    activeFeedTab,
    setActiveTag,
    setActiveFeedTab,
    addInitialPosts,
  } = useContext(PostListData);

  const { searchQuery, setSearchQuery } = useSearch();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Background fetch to enrich with remote posts if needed
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let isMounted = true;

    fetch("https://dummyjson.com/posts?limit=20")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const normalized = data.posts.map((post) => {
          let reactions = post.reactions;
          if (typeof reactions === "object" && reactions !== null) {
            reactions = (reactions.likes || 0) + (reactions.dislikes || 0);
          }
          return {
            ...post,
            reactions: parseInt(reactions, 10) || 0,
            liked: false,
            repostsCount: Math.floor(Math.random() * 20),
            reposted: false,
            bookmarked: false,
            commentsCount: Math.floor(Math.random() * 12),
            comments: [],
            authorName: `Dev Creator #${post.userId}`,
            username: `dev_${post.userId}`,
            authorAvatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=Dummy${post.userId}`,
            isVerified: post.id % 2 === 0,
            createdAt: new Date(
              Date.now() - (post.id * 4 + 10) * 60 * 1000
            ).toISOString(),
          };
        });
        addInitialPosts(normalized);
      })
      .catch((err) => {
        console.warn("Background fetch notice:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter posts
  const filteredPosts = postList.filter((post) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        post.title?.toLowerCase().includes(q) ||
        post.body?.toLowerCase().includes(q) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    // Active tag filter
    if (activeTag !== "all") {
      const hasTag = post.tags?.some(
        (t) => t.toLowerCase() === activeTag.toLowerCase()
      );
      if (!hasTag) return false;
    }

    // Feed tab filter
    if (activeFeedTab === "bookmarks") {
      return post.bookmarked === true;
    }
    if (activeFeedTab === "tech") {
      const techTags = ["react", "webdev", "ai", "vite", "coding", "tech", "design"];
      return post.tags?.some((t) => techTags.includes(t.toLowerCase()));
    }
    if (activeFeedTab === "foryou") {
      return (post.reactions || 0) > 20 || post.liked;
    }

    return true;
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const tabs = [
    { id: "trending", label: "Trending", icon: <FiTrendingUp /> },
    { id: "foryou", label: "For You", icon: <FiSparkles /> },
    { id: "tech", label: "Tech & Dev", icon: <FiCode /> },
    { id: "bookmarks", label: "Saved", icon: <FiBookmark /> },
  ];

  return (
    <div className="feed-container">
      {/* Stories Bar */}
      <StoriesBar />

      {/* Inline Quick Compose */}
      <QuickCompose />

      {/* Feed Tabs Navigation */}
      <div className="feed-tabs-bar">
        <div className="feed-tabs-list" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeFeedTab === tab.id}
              className={`feed-tab-btn ${activeFeedTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveFeedTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {tab.id === "bookmarks" && (
                <span className="tab-badge">
                  {postList.filter((p) => p.bookmarked).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`btn-refresh-feed ${isRefreshing ? "spinning" : ""}`}
          onClick={handleRefresh}
          title="Refresh feed"
          aria-label="Refresh feed"
        >
          <FiRefreshCw />
        </button>
      </div>

      {/* Active Filter Indicators */}
      {(searchQuery.trim() || activeTag !== "all") && (
        <div className="active-filters-banner">
          <span className="filter-summary">
            Filtering by:{" "}
            {searchQuery && (
              <span className="filter-chip">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search filter"
                >
                  <FiX />
                </button>
              </span>
            )}
            {activeTag !== "all" && (
              <span className="filter-chip">
                Tag: #{activeTag}
                <button
                  onClick={() => setActiveTag("all")}
                  aria-label="Clear tag filter"
                >
                  <FiX />
                </button>
              </span>
            )}
          </span>
          <button
            className="clear-all-btn"
            onClick={() => {
              setSearchQuery("");
              setActiveTag("all");
            }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Feed List */}
      {fetchStatus === "fetching" && postList.length === 0 ? (
        <LoadingSpinner />
      ) : filteredPosts.length === 0 ? (
        activeFeedTab === "bookmarks" ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔖</div>
            <h2 className="empty-state-title">No saved posts</h2>
            <p className="empty-state-subtitle">
              Click the bookmark icon on any post to save it for reading later.
            </p>
          </div>
        ) : searchQuery.trim() || activeTag !== "all" ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h2 className="empty-state-title">No matching posts found</h2>
            <p className="empty-state-subtitle">
              Try adjusting your search terms or clearing active filters.
            </p>
          </div>
        ) : (
          <WelcomeMessage />
        )
      ) : (
        <div className="post-feed">
          {visiblePosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="load-more-wrapper">
          <button
            className="btn-load-more"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          >
            Load more thoughts ({filteredPosts.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;
