import { createContext, useContext, useState, useEffect } from "react";

export const DEFAULT_USER_PROFILE = {
  name: "Shubham Sharma",
  username: "shubham",
  handle: "@shubham",
  bio: "Full-Stack Engineer & Design Systems enthusiast. Crafting fluid interfaces with React 19 & modern web architectures. Building the future of social software. 🚀✨",
  avatarSeed: "Shubham",
  avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Shubham",
  bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
  location: "San Francisco, CA",
  website: "https://github.com/shubhamax7",
  joinedDate: "Joined January 2024",
  followers: 892,
  following: 148,
  isVerified: true,
  isPro: true,
};

export const AVATAR_PRESETS = [
  { name: "Cosmic", seed: "Shubham" },
  { name: "Alex", seed: "AlexR" },
  { name: "Sarah", seed: "SarahJ" },
  { name: "Elena", seed: "ElenaV" },
  { name: "Marcus", seed: "MarcusD" },
  { name: "Luna", seed: "LunaStar" },
  { name: "Felix", seed: "FelixCat" },
  { name: "Cyber", seed: "CyberDev" },
];

export const BANNER_PRESETS = [
  { name: "Glass Aurora", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80" },
  { name: "Neon Cyber", url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80" },
  { name: "Deep Space", url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80" },
  { name: "Abstract Mesh", url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1600&q=80" },
];

const UserProfileContext = createContext({
  profile: DEFAULT_USER_PROFILE,
  updateProfile: () => {},
  resetProfile: () => {},
});

export const useUserProfile = () => useContext(UserProfileContext);

export const UserProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("socialsphere_user_profile");
      if (saved) {
        return { ...DEFAULT_USER_PROFILE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error("Failed to read user profile from localStorage", e);
    }
    return DEFAULT_USER_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem("socialsphere_user_profile", JSON.stringify(profile));
    } catch (e) {
      console.error("Failed to write user profile to localStorage", e);
    }
  }, [profile]);

  const updateProfile = (updates) => {
    setProfile((prev) => {
      const updatedSeed = updates.avatarSeed || prev.avatarSeed;
      const avatarUrl = updates.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${updatedSeed}`;
      return {
        ...prev,
        ...updates,
        avatarSeed: updatedSeed,
        avatarUrl,
        username: updates.username || prev.username,
        handle: updates.username ? `@${updates.username}` : prev.handle,
      };
    });
  };

  const resetProfile = () => {
    setProfile(DEFAULT_USER_PROFILE);
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, resetProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export default UserProfileProvider;
