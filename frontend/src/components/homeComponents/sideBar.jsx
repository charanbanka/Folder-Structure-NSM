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

function GetFolderBar({ folder, isOpen, children, ml }) {
  const { foldersData, isFolderOpenState, updateFolderOpenState } =
    useContext(FolderContext);
  return (
    <div className="divider-vertical" style={{ marginLeft: `${ml}px` }}>
      <div
        key={folder.id}
        className={`folder-item ${isOpen && "active"}`}
        onClick={() => {
          updateFolderOpenState(folder.id, !isOpen);
        }}
      >
        <div className="folder-info">
          <FaRegFolder size={"18px"} />
          <span>{folder.name}</span>
        </div>
        <FaPlusCircle
          className="options-icon"
          color={isOpen ? "rgb(234, 211, 11)" : "grey"}
          size={"16px"}
        />
      </div>
      {isOpen &&
        children &&
        children?.map((item) => {
          const isChildOpen = isFolderOpenState?.[item.id] || false;
          return item.isFolder ? (
            <GetFolderBar
              key={item.id}
              isOpen={isChildOpen}
              folder={item}
              children={foldersData?.[item.id]}
              ml={ml + 5}
            />
          ) : (
            <GetFileBar key={item.id} file={item} ml={ml + 5} />
          );
        })}
    </div>
  );
}

function GetFileBar({ file, ml }) {
  const { foldersData, getIconByFileIcon } = useContext(FolderContext);

  return (
    <div
      key={file.id}
      className={`file-item`}
      style={{ marginLeft: `${ml}px` }}
    >
      <div className="file-info">
        {getIconByFileIcon(file.extension)}
        {file.name}
      </div>
      <FaPlusCircle className="options-icon" color="grey" size={"16px"} />
    </div>
  );
}

function DisplayFoldersOrFiles() {
  const { foldersData, isFolderOpenState } = useContext(FolderContext);
  return (
    <div className="sidebar-folder-list">
      {!foldersData?.parent?.length && (
        <div className="mt-10 ml-10 text-danger">
          No Folder or Document Found. Plaese Create or Upload.
        </div>
      )}
      {foldersData?.parent?.map((folder) => {
        const isOpen = isFolderOpenState[folder.id] || false;

        return (
          <GetFolderBar
            key={folder.id}
            folder={folder}
            isOpen={isOpen}
            children={foldersData?.[folder.id]}
            ml={0}
          />
        );
      })}
    </div>
  );
}

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
            <div className="divider-vertical"></div>
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

        <DisplayFoldersOrFiles />
      </div>
    </>
  );
}
