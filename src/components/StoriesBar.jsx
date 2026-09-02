import { FiPlus } from "react-icons/fi";
import { useToast } from "./Toast";

const STORIES = [
  { id: 1, name: "Your Story", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Shubham", isUser: true },
  { id: 2, name: "Sarah J.", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=SarahJ", hasUnseen: true },
  { id: 3, name: "Devon V.", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=DevonV", hasUnseen: true },
  { id: 4, name: "Elena R.", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ElenaR", hasUnseen: true },
  { id: 5, name: "Marcus B.", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=MarcusB", hasUnseen: false },
  { id: 6, name: "Aria Kim", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=AriaK", hasUnseen: true },
  { id: 7, name: "Liam Wu", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=LiamW", hasUnseen: false },
];

const StoriesBar = () => {
  const { showToast } = useToast();

  const handleClick = (story) => {
    if (story.isUser) {
      showToast({
        type: "info",
        title: "Story creation",
        message: "Add image or video to share to your story for 24 hours.",
      });
    } else {
      showToast({
        type: "info",
        title: `${story.name}'s Story`,
        message: `Viewing active story highlights from ${story.name}.`,
      });
    }
  };

  return (
    <section className="stories-container" aria-label="Stories and Highlights">
      <div className="stories-scroll">
        {STORIES.map((story) => (
          <button
            key={story.id}
            className={`story-item ${story.isUser ? "story-item-user" : ""} ${story.hasUnseen ? "has-unseen" : ""}`}
            onClick={() => handleClick(story)}
            aria-label={`View ${story.name}`}
          >
            <div className="story-avatar-wrapper">
              <img
                src={story.avatar}
                alt={story.name}
                className="story-avatar"
                loading="lazy"
              />
              {story.isUser && (
                <div className="story-add-badge">
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
