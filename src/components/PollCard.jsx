import { usePostList } from "../store/post-list-store";
import { useToast } from "./Toast";
import { FiCheckCircle, FiClock, FiAward } from "react-icons/fi";
import { MdHowToVote } from "react-icons/md";

const PollCard = ({ poll, postId }) => {
  const { votePoll } = usePostList();
  const { showToast } = useToast();

  if (!poll || !poll.options || poll.options.length === 0) return null;

  const totalVotes = poll.totalVotes || 0;
  const userSelected = poll.userVotedOptionId;
  const hasVoted = Boolean(userSelected);

  // Find max votes to mark the leader
  const maxVotes = Math.max(...poll.options.map((o) => o.votes || 0));

  const handleOptionClick = (option) => {
    const isUndo = userSelected === option.id;
    votePoll(postId, option.id);

    if (isUndo) {
      showToast({
        type: "info",
        title: "Vote retracted",
        message: "You removed your vote from the poll.",
      });
    } else {
      showToast({
        type: "success",
        title: "Vote submitted! 🗳️",
        message: `Voted for: "${option.text.slice(0, 30)}${option.text.length > 30 ? "..." : ""}"`,
      });
    }
  };

  return (
    <div className="poll-container" role="region" aria-label="Community Poll">
      <div className="poll-header-row">
        <div className="poll-title-wrap">
          <MdHowToVote className="poll-icon" aria-hidden="true" />
          <h3 className="poll-question">{poll.question}</h3>
        </div>
        <div className="poll-meta-badge">
          <FiClock className="poll-clock-icon" aria-hidden="true" />
          <span>{poll.expiresAt || "Active Community Poll"}</span>
        </div>
      </div>

      <div className="poll-options-list" role="radiogroup" aria-label={poll.question}>
        {poll.options.map((opt) => {
          const isSelected = userSelected === opt.id;
          const votes = opt.votes || 0;
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          const isLeader = maxVotes > 0 && votes === maxVotes;

          return (
            <button
              key={opt.id}
              type="button"
              className={`poll-option-row ${isSelected ? "selected" : ""} ${
                hasVoted ? "has-voted" : ""
              } ${isLeader && hasVoted ? "leader-option" : ""}`}
              onClick={() => handleOptionClick(opt)}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${opt.text}, ${votes} votes, ${percentage} percent`}
            >
              {/* Animated Fill Bar */}
              {hasVoted && (
                <div
                  className="poll-fill-bar"
                  style={{ width: `${percentage}%` }}
                  aria-hidden="true"
                />
              )}

              {/* Option Content Row */}
              <div className="poll-option-content">
                <div className="poll-option-left">
                  <span className={`poll-radio-dot ${isSelected ? "checked" : ""}`}>
                    {isSelected && <FiCheckCircle className="poll-check-icon" />}
                  </span>
                  <span className="poll-option-text">{opt.text}</span>
                  {isLeader && hasVoted && totalVotes > 1 && (
                    <span className="poll-leader-chip" title="Leading Choice">
                      <FiAward /> Leading
                    </span>
                  )}
                </div>

                {hasVoted && (
                  <div className="poll-option-right">
                    <span className="poll-percent-val">{percentage}%</span>
                    <span className="poll-count-val">({votes})</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="poll-footer-info">
        <span className="poll-total-count">
          {totalVotes} {totalVotes === 1 ? "vote" : "votes"} recorded
        </span>
        <span className="poll-hint">
          {hasVoted ? "Click your choice again to retract vote" : "Tap an option to cast your vote"}
        </span>
      </div>
    </div>
  );
};

export default PollCard;
