import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import useUserAuth from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import PollCard from "../../components/PollCards/PollCard";
import BOOKMARK_ICON from "../../assets/bookmark.png";
import EmptyCard from "../../components/cards/EmptyCard";
import { UserContext } from "../../context/UserContext";

const Bookmarks = () => {
  useUserAuth();

  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [bookmarkedPolls, setBookmarkedPolls] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllPolls = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.GET_BOOKMARKED);

      if (response.data?.bookmarkedPolls?.length > 0) {
        setBookmarkedPolls(response.data.bookmarkedPolls);
      }
    } catch (error) {
      console.log("Some thing went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPolls();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Bookmarks">
      <div className="my-5 mx-auto">
        <h2 className="text-xl font-medium text-slate-800">Bookmarks </h2>

        {bookmarkedPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={BOOKMARK_ICON}
            message="You haven't bookmarked any polls yet. Start bookmarking your favorites to keep track of them! "
            btnText="Explore"
            onClick={() => navigate("/dashboard")}
          />
        )}

        {/* //! Lest Implement Infinite Scroll Pagination */}

        {bookmarkedPolls.map((poll) => {
          if (!user?.bookmarkedPolls?.includes(poll._id)) return null;
          return (
            <PollCard
              key={`dashboard${poll._id}`}
              pollId={poll._id}
              question={poll.question}
              type={poll.type}
              options={poll.options}
              voters={poll.voters.length || 0}
              responses={poll.responses}
              creatorProfileImg={poll.creator.profileImg || null}
              creatorName={poll.creator.fullName}
              creatorUserName={poll.creator.userName}
              userHasVoted={poll.userHasVoted || false}
              isPollClose={poll.closed || false}
              createdAt={poll.createdAt || false}
            />
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Bookmarks;
