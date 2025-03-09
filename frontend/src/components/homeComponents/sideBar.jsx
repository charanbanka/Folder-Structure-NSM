import React, { useContext, useEffect, useState } from "react";
import {
  FaRegFolder,
  FaPlusCircle,
  FaBars,
  FaTimes,
  FaRegFile,
} from "react-icons/fa";
import { IoDocumentSharp } from "react-icons/io5";
import FolderContext from "../context/folderContext";
import config from "../../common/config";
import serviceRequest from "../../common/utils/serviceRequest";

const FOLDER_URL = `${config.apigatewayurl}/folder`;

export default function SideBar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [countState, setCountState] = useState({});

  const { foldersData } = useContext(FolderContext);

  useEffect(() => {
    fetchFoldersData();
  }, []);

  async function fetchFoldersData() {
    try {
      let url = `${FOLDER_URL}/fetchfolderanddocs/count`;

      let resp = await serviceRequest({
        url,
        method: "get",
      });
      setCountState(resp?.data);
    } catch (error) {
      console.log("error", error.message);
    }
  }

  const getCountMessage = (val) => {
    if (val >= 200) return "200+";
    else if (val > 100) return "100+";
    return val;
  };

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
                <FaRegFolder size={"24px"} color="red" />
              </span>
              <span className="stat-name">Folders</span>
              <span className="stat-value">
                {getCountMessage(countState?.folders_count)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">
                <FaRegFile size={"24px"} color="red" />
              </span>
              <span className="stat-name">Documents</span>
              <span className="stat-value">
                {getCountMessage(countState?.docs_count)}
              </span>
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
