import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import UserProfile from "./components/UserProfile";
import { useState } from "react";
import PostListProvider from "./store/post-list-store";
import SearchProvider from "./store/SearchContext";
import UserProfileProvider from "./store/UserProfileContext";
import { ToastProvider } from "./components/Toast";

function App() {
  const [selectedTab, setSelectedTab] = useState("Home");

  return (
    <PostListProvider>
      <UserProfileProvider>
        <SearchProvider>
          <ToastProvider>
            <div className="app-container">
              {/* Left Column: Navigation Sidebar */}
              <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

              {/* Center + Right Content Area */}
              <div className="content">
                <Header setSelectedTab={setSelectedTab} />

                <div className="app-main-layout">
                  {/* Center Column: Feed, Create Post Form, or User Profile */}
                  <main className="main-feed-column">
                    {selectedTab === "Home" ? (
                      <PostList />
                    ) : selectedTab === "Create Post" ? (
                      <CreatePost setSelectedTab={setSelectedTab} />
                    ) : selectedTab === "Profile" ? (
                      <UserProfile setSelectedTab={setSelectedTab} />
                    ) : (
                      <PostList />
                    )}
                  </main>

                  {/* Right Column: Widgets, Trends, Creators (visible on feed & profile) */}
                  {(selectedTab === "Home" || selectedTab === "Profile") && (
                    <div className="right-widgets-column">
                      <RightSidebar />
                    </div>
                  )}
                </div>

                <Footer />
              </div>
            </div>
          </ToastProvider>
        </SearchProvider>
      </UserProfileProvider>
    </PostListProvider>
  );
}

export default App;
