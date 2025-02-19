import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import useUserAuth from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import PollCard from "../../components/PollCards/PollCard";
import InfiniteScroll from "react-infinite-scroll-component";
import VOTE_ICON from "../../assets/fountain-pen.png";
import EmptyCard from "../../components/cards/EmptyCard";

const PAGE_SIZE = 10;

const VotePolls = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [votedPolls, setVotedPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.VOTED_POLLS}?page=${overridePage}&limit=${PAGE_SIZE}`
      );

      if (response.data?.polls?.length > 0) {
        setVotedPolls((prevPolls) =>
          overridePage === 1
            ? response.data.polls
            : [...prevPolls, ...response.data.polls]
        );
        setHasMore(response.data.polls.length === PAGE_SIZE);
      } else {
        setHasMore(false);
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
  }, [page]);

  return (
    <DashboardLayout activeMenu="Voted Polls">
      <div className="my-5 mx-auto">
        <h2 className="text-xl font-medium text-slate-800">Voted Polls</h2>

        {votedPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={VOTE_ICON}
            message="You have not voted on any polls yet! Start exploring and share your opinion by voting on polls now"
            btnText="Explore"
            onClick={() => navigate("/dashboard")}
          />
        )}

        {/* //! Lest Implement Infinite Scroll Pagination */}

        <InfiniteScroll
          dataLength={votedPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className="info-text">Loading...</h4>}
          endMessage={<p className="info-text">No more polls to display</p>}>
          {votedPolls.map((poll) => {
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
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default VotePolls;
