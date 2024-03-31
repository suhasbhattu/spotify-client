declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: any;
    Spotify: any;
  }
}

const HomeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <div className="homeLayout h-screen">{children}</div>;
};

export default HomeLayout;
