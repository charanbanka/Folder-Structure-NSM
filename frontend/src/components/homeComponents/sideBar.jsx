import React, { useContext, useState } from "react";
import { FaRegFolder, FaPlusCircle, FaBars, FaTimes } from "react-icons/fa";
import { IoDocumentSharp } from "react-icons/io5";
import FolderContext from "../context/folderContext";

export default function SideBar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { foldersData } = useContext(FolderContext);

  return (
    <>
      {/* Toggle button for mobile */}
      {/* <div className="menu-toggle" onClick={() => setSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div> */}

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <span className="sidebar-title">Folders & Documents</span>
          <div className="sidebar-stats">
            <div className="stat-item">
              <span className="stat-icon">
                <FaRegFolder size={"24px"} />
              </span>
              <span className="stat-name">Folders</span>
              <span className="stat-value">200+</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">
                <IoDocumentSharp size={"24px"} />
              </span>
              <span className="stat-name">Documents</span>
              <span className="stat-value">200+</span>
            </div>
          </div>
        </div>

        {/* Folder List */}
        <div className="sidebar-folder-list">
          {foldersData?.parent?.map((folder) => (
            <div key={folder.id} className="folder-item">
              <div className="folder-info">
                <FaRegFolder size={"18px"} />
                {folder.name}
              </div>
              <FaPlusCircle
                className="options-icon"
                color="grey"
                size={"16px"}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
