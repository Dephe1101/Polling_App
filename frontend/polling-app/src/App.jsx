import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./pages/Auth/LoginForm";
import SignUpForm from "./pages/Auth/SignUpForm";
import Home from "./pages/Dashboard/Home";
import MyPoll from "./pages/Dashboard/MyPoll";
import VotePolls from "./pages/Dashboard/VotePolls";
import Bookmarks from "./pages/Dashboard/Bookmarks";
import CreatePoll from "./pages/Dashboard/CreatePoll";
import UserProvider from "./context/UserContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signUp" element={<SignUpForm />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/create-poll" element={<CreatePoll />} />
            <Route path="/my-polls" element={<MyPoll />} />
            <Route path="/vote-polls" element={<VotePolls />} />
            <Route path="/bookmarked-polls" element={<Bookmarks />} />
          </Routes>
        </Router>
        <Toaster
          toastOptions={{
            className: "",
            style: { fontSize: "13px" },
          }}
        />
      </UserProvider>
    </div>
  );
};

export default App;

//! Định nghĩa Root components

const Root = () => {
  //! kiểm tra token còn ở trong LS hay không ???
  const isAuthenticated = !!localStorage.getItem("token");

  //! chuyển hướng đến dashboard nếu token tồn tại, ngc lại chuyển hướng login

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
