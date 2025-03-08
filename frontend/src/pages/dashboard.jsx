import React, { useEffect, useState } from "react";
import ProfileBar from "../components/homeComponents/ProfileBar";
import SideBar from "../components/homeComponents/sideBar";
import { MainContent } from "../components/homeComponents/MainContent";
import config from "../common/config";
import serviceRequest from "../common/utils/serviceRequest";
import consts from "../common/consts";
import FolderContext from "../components/context/folderContext";
import ModalDialog from "../components/popup-model";
import MyIframeComponent from "../components/FileViewer";
import useModal from "../components/popup-model/use-model";

const FOLDER_URL = `${config.apigatewayurl}/folder`;

export default function Dashboard() {
  const [foldersData, setFoldersData] = useState([]);

  const [isFolderOpenState, setIsFolderOpenState] = useState({});
  const [currentFolder, setCurrentFolder] = useState({});
  const [formState, setFormState] = useState({ type: "" });
  const [editState, setEditState] = useState({});
  const { isShowing, toggle, hide, show } = useModal();

  useEffect(() => {
    fetchFoldersData();
  }, []);

  useEffect(() => {
    if (currentFolder?.id) fetchChildrenDataByFolderId();
  }, [currentFolder?.id]);

  function updateFolderOpenState(name, value) {
    setIsFolderOpenState((prev) => ({ ...prev, [name]: value }));
    setCurrentFolder(value ? { id: name } : {});
  }

  async function fetchChildrenDataByFolderId(id = currentFolder.id) {
    try {
      let resp = await serviceRequest({
        url: `${FOLDER_URL}/fetchbyparent/${id}`,
        method: "get",
      });

      console.log("fetchChildrenDataByFolderId", resp);
      setFoldersData((prev) => {
        return { ...prev, [id]: resp?.data };
      });
    } catch (error) {
      console.log("error", error.message);
    }
  }

  async function fetchFoldersData() {
    try {
      let resp = await serviceRequest({
        url: `${FOLDER_URL}/parentfolders`,
        method: "get",
      });
      console.log("resp", resp);
      let newState = resp?.data?.map((item) => {
        return { ...item, isFolder: true };
      });
      setFoldersData((prev) => {
        return { ...prev, parent: newState };
      });
    } catch (error) {
      console.log("error", error.message);
    }
  }

  const updateEditState = (newState) => {
    setEditState({ [newState.id]: newState });
  };

  console.log("data", editState, formState);
  return (
    <FolderContext.Provider
      value={{
        foldersData,
        fetchFoldersData,
        fetchChildrenDataByFolderId,
        isFolderOpenState,
        setIsFolderOpenState,
        currentFolder,
        setCurrentFolder,
        updateFolderOpenState,
        isShowing,
        toggle,
        hide,
        show,
        formState,
        setFormState,
        editState,
        updateEditState,
      }}
    >
      <div className="dashboard-container">
        {/* Profile Bar */}
        <ProfileBar />

        {/* Sidebar */}
        <SideBar />

        {/* Main Content (Handles Folders, Files, and Modal) */}
        <MainContent />
      </div>
    </FolderContext.Provider>
  );
}
