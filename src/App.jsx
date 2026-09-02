import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import { useState } from "react";
import PostListProvider from "./store/post-list-store";
import SearchProvider from "./store/SearchContext";
import { ToastProvider } from "./components/Toast";

function App() {
  const [selectedTab, setSelectedTab] = useState("Home");

  return (
    <PostListProvider>
      <SearchProvider>
        <ToastProvider>
          <div className="app-container">
            {/* Left Column: Navigation Sidebar */}
            <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

            {/* Center + Right Content Area */}
            <div className="content">
              <Header />

              <div className="app-main-layout">
                {/* Center Column: Feed or Create Post Form */}
                <main className="main-feed-column">
                  {selectedTab === "Home" ? (
                    <PostList />
                  ) : (
                    <CreatePost setSelectedTab={setSelectedTab} />
                  )}
                </main>

                {/* Right Column: Widgets, Trends, Creators (visible on feed) */}
                {selectedTab === "Home" && (
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
    </PostListProvider>
  );
}

export default App;
