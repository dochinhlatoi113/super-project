const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="main-layout">
      {/* You can add header, sidebar, footer here */}
      <header className="header">Header Content</header>
      <aside className="sidebar">Sidebar Content</aside>
      <main className="content">{children}</main>
      <footer className="footer">Footer Content</footer>
    </div>
  );
};
export default MainLayout;
