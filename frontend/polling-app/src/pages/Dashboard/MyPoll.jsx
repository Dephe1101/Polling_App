import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import useUserAuth from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import { axiosInstance } from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import PollCard from "../../components/PollCards/PollCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserContext } from "../../context/UserContext";
import EmptyCard from "../../components/cards/EmptyCard";
import POLLING_ICON from "../../assets/polling.png";
const PAGE_SIZE = 10;

const MyPoll = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState([]);
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filterType, setFilterType] = useState([]);

  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}&creatorId=${user._id}`
      );

      if (response.data?.polls?.length > 0) {
        setAllPolls((prevPolls) =>
          overridePage === 1
            ? response.data.polls
            : [...prevPolls, ...response.data.polls]
        );

        setStats(response.data?.stats || []);
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
    if (user) {
      setPage(1);
      fetchAllPolls(1);
      return () => {};
    }
  }, [filterType, user]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls();
    }
    return () => {};
  }, [page]);

  return (
    <DashboardLayout activeMenu="My Polls">
      <div className="my-5 mx-auto">
        <HeaderWithFilter
          title="My Polls"
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {allPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={POLLING_ICON}
            message="You're the new user of the system, and there are no polls yet. Start by creating the first poll"
            btnText="Create Poll"
            onClick={() => navigate("/create-poll")}
          />
        )}

        {/* //! Lest Implement Infinite Scroll Pagination */}

        <InfiniteScroll
          dataLength={allPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className="info-text">Loading...</h4>}
          endMessage={<p className="info-text">No more polls to display</p>}>
          {allPolls.map((poll) => {
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
                isMyPoll
              />
            );
          })}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default MyPoll;
