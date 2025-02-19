import React, { useContext } from "react";
import NavBar from "./NavBar";
import SideMenu from "./SideMenu";
import { UserContext } from "../../context/UserContext";
import UserDetailsCard from "../cards/UserDeatilsCard";
import TrendingPolls from "./TrendingPolls";

const DashboardLayout = ({ children, activeMenu, stats, showStats }) => {
  const { user } = useContext(UserContext);
  return (
    <div>
      <NavBar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="grow mx-5">{children}</div>
          <div className="hidden md:block mr-5">
            <UserDetailsCard
              profileImageUrl={user && user.profileImageUrl}
              fullName={user && user.fullName}
              userName={user && user.userName}
              totalPollsVotes={user && user.totalPollVotes}
              totalPollsCreated={user && user.totalPollsCreated}
              totalPollBookmarked={user && user.totalPollsBookmarked}
            />
            {showStats && stats?.length > 0 && <TrendingPolls stats={stats} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
