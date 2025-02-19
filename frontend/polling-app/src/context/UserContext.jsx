import React, { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //! Function to up date user data

  const updateUser = (userData) => {
    setUser(userData);
  };

  //! Function to clear user data (e.g, on logout)

  const clearUser = () => {
    setUser(null);
  };

  //! Update user stats

  const updateUserStats = (key, value) => {
    setUser((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  //! Update totalPollVotes count locally
  const onUserVoted = () => {
    const totalPollVotes = user.totalPollVotes || 0;
    updateUserStats("totalPollVotes", totalPollVotes + 1);
  };

  //! Update totalPollsCreated count locally

  const onPollCreateOrDelete = (type = "create") => {
    const totalPollsCreated = user.totalPollsCreated || 0;
    updateUserStats(
      "totalPollsCreated",
      type == "create" ? totalPollsCreated + 1 : totalPollsCreated - 1
    );
  };

  //! Add or remove poll id from bookmarkedPolls
  const toggleBookmarkId = (id) => {
    const bookmarks = user.bookmarkedPolls || [];
    console.log(id);
    const index = bookmarks.indexOf(id);
    console.log(index);
    console.log(bookmarks);

    if (index === -1) {
      //! Add the ID if it's not in the array
      setUser((prev) => ({
        ...prev,
        bookmarkedPolls: [...bookmarks, id],
        totalPollsBookmarked: prev.totalPollsBookmarked + 1,
      }));
    } else {
      //! Remove the ID if it's already in the array
      setUser((prev) => ({
        ...prev,
        bookmarkedPolls: bookmarks.filter((item) => item != id),
        totalPollsBookmarked: prev.totalPollsBookmarked - 1,
      }));
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        clearUser,
        onPollCreateOrDelete,
        onUserVoted,
        toggleBookmarkId,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
