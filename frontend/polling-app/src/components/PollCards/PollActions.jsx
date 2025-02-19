import React, { useState } from "react";
import { FaBookmark } from "react-icons/fa6";

const PollActions = ({
  pollId,
  isVoteComplete,
  inputCaptured,
  onVoteSubmit,
  isBookmarked,
  toggleBookmark,
  isMyPoll,
  pollClosed,
  onClosePoll,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);

  const handleVoteClick = async () => {
    setLoading(true);
    try {
      await onVoteSubmit();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {(isVoteComplete || pollClosed) && (
        <div className="text-[11px] font-medium text-slate-600 bg-sky-700/10 px-3 py-1 rounded-md">
          {pollClosed ? "Closed" : "Voted"}
        </div>
      )}

      {isMyPoll && !pollClosed && (
        <button
          className="btn-small text-orange-500 hover:bg-orange-500 bg-orange-500/20 hover:text-white hover:border-orange-100 "
          onClick={onClosePoll}
          disabled={loading}>
          Close
        </button>
      )}

      {isMyPoll && (
        <button
          className="btn-small text-red-500 hover:bg-red-500 bg-red-500/20 hover:text-white hover:border-red-100 "
          onClick={onDelete}
          disabled={loading}>
          Delete
        </button>
      )}

      <button className="icon-btn" onClick={toggleBookmark}>
        {isBookmarked ? (
          <FaBookmark className="text-sky-500 " />
        ) : (
          <FaBookmark className="text-slate-400" />
        )}
      </button>

      {inputCaptured && !isVoteComplete && (
        <button
          className="btn-small ml-auto"
          onClick={handleVoteClick}
          disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      )}
    </div>
  );
};

export default PollActions;
