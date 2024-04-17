import React, { ReactNode } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import RightBar from "./rightBar";

interface MainLayoutProps {
  headerTitle: string;
  headerActions: ReactNode;
  mainContent: ReactNode;
  rightContent: ReactNode;
  children?: ReactNode; 
}

function MainLayout({
  headerTitle,
  headerActions,
  mainContent,
  rightContent,
  children, 
}: MainLayoutProps) {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-area">

      <Header title={headerTitle} actions={headerActions} />
      <div className="content-area">
        <div className="main-content">{mainContent}</div>
        <RightBar content={rightContent} />
      </div>
      {children}
      </div>
    </div>
  );
}

export default MainLayout;
