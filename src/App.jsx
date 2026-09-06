import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import UserProfile from "./components/UserProfile";
import MessagesView from "./components/MessagesView";
import FloatingChatDrawer from "./components/FloatingChatDrawer";
import { useState } from "react";
import PostListProvider from "./store/post-list-store";
import SearchProvider from "./store/SearchContext";
import UserProfileProvider from "./store/UserProfileContext";
import { ChatProvider } from "./store/ChatContext";
import { StoriesProvider } from "./store/StoriesContext";
import { ToastProvider } from "./components/Toast";
import StoryViewerModal from "./components/StoryViewerModal";
import CreateStoryModal from "./components/CreateStoryModal";

function App() {
  const [selectedTab, setSelectedTab] = useState("Home");

  return (
    <PostListProvider>
      <UserProfileProvider>
        <SearchProvider>
          <ChatProvider>
            <StoriesProvider>
              <ToastProvider>
                <div className="app-container">
                {/* Left Column: Navigation Sidebar */}
                <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

                {/* Center + Right Content Area */}
                <div className="content">
                  <Header setSelectedTab={setSelectedTab} />

                  <div className={`app-main-layout ${selectedTab === "Messages" ? "messages-layout-active" : ""}`}>
                    {/* Center Column: Feed, Create Post Form, User Profile, or Messages */}
                    <main className={`main-feed-column ${selectedTab === "Messages" ? "main-messages-expanded" : ""}`}>
                      {selectedTab === "Home" ? (
                        <PostList />
                      ) : selectedTab === "Create Post" ? (
                        <CreatePost setSelectedTab={setSelectedTab} />
                      ) : selectedTab === "Profile" ? (
                        <UserProfile setSelectedTab={setSelectedTab} />
                      ) : selectedTab === "Messages" ? (
                        <MessagesView />
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

                {/* Global Dockable Floating Messenger Drawer */}
                <FloatingChatDrawer setSelectedTab={setSelectedTab} />

                {/* Global Interactive Stories Viewer & Creator Modals */}
                <StoryViewerModal />
                <CreateStoryModal />
              </div>
            </ToastProvider>
          </StoriesProvider>
        </ChatProvider>
      </SearchProvider>
    </UserProfileProvider>
  </PostListProvider>
);
}

export default App;
