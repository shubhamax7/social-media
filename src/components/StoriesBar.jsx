import { FiPlus } from "react-icons/fi";
import { useStories } from "../store/StoriesContext";

const StoriesBar = () => {
  const { allStoriesList, openStoryViewer, openStoryCreator } = useStories();

  const handleStoryClick = (story, e) => {
    if (story.isUser) {
      if (story.slides && story.slides.length > 0) {
        openStoryViewer(story.id, 0);
      } else {
        openStoryCreator();
      }
    } else {
      openStoryViewer(story.id);
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    openStoryCreator();
  };

  return (
    <section className="stories-container" aria-label="Stories and Highlights">
      <div className="stories-scroll">
        {allStoriesList.map((story) => (
          <button
            key={story.id}
            className={`story-item ${story.isUser ? "story-item-user" : ""} ${
              story.hasUnseen ? "has-unseen" : "is-seen"
            }`}
            onClick={(e) => handleStoryClick(story, e)}
            aria-label={`View ${story.name}`}
          >
            <div className="story-avatar-wrapper">
              <img
                src={story.avatar}
                alt={story.name}
                className="story-avatar"
                loading="lazy"
                width={52}
                height={52}
              />
              {story.isUser && (
                <div
                  className="story-add-badge"
                  onClick={handleAddClick}
                  title="Create new story"
                  aria-label="Create new story"
                >
                  <FiPlus />
                </div>
              )}
            </div>
            <span className="story-name">{story.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default StoriesBar;
