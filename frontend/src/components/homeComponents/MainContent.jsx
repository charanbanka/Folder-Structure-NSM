import React, { useContext, useState } from "react";
import { BsFilterSquareFill, BsPlusSquareFill } from "react-icons/bs";
import FolderContent from "./FolderContent";
import config from "../../common/config";
import serviceRequest from "../../common/utils/serviceRequest";
import consts from "../../common/consts";
import useModal from "../popup-model/use-model";
import ModalDialog from "../popup-model";
import FolderContext from "../context/folderContext";
import { RxCross2 } from "react-icons/rx";

const FOLDER_URL = `${config.apigatewayurl}/folder`;
const FILE_URL = `${config.apigatewayurl}/file`;

export function MainContent() {
  const [isOpenState, setIsOpenState] = useState({ filter: false, add: false });
  // const [formState, setFormState] = useState({ type: "" });
  const [errors, setErrors] = useState({});
  const {
    foldersData,
    fetchFoldersData,
    fetchChildrenDataByFolderId,
    isFolderOpenState,
    setIsFolderOpenState,
    formState,
    setFormState,
    currentFolder,
    setCurrentFolder,
    isShowing,
    toggle,
    hide,
    show,
    editState,
    updateEditState,
  } = useContext(FolderContext);

  const toggleDropdown = (key) => {
    setIsOpenState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error for the updated field
  };

  function handleClear() {
    hide();
    setFormState({ type: "" });
    setErrors({});
    updateEditState({});
    setIsOpenState({});
  }

  const validateForm = () => {
    const newErrors = {};
    if (formState.type === "folder") {
      if (!formState.name?.trim()) newErrors.name = "Name is required";
      if (!formState.description?.trim())
        newErrors.description = "Description is required";
    } else if (formState.type === "file") {
      if (!formState.file) newErrors.file = "Please select a file to upload";
      if (!currentFolder?.id)
        newErrors.file = "Please select a folder to upload";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrUpdateFolder = async (data) => {
    console.log("dat", data);
    try {
      let url = data.isNew
        ? `${FOLDER_URL}/add`
        : `${FOLDER_URL}/update/${data.folder_id}`;
      const response = await serviceRequest({
        url,
        method: "post",
        data,
      });
      if (response.status === consts.SERVICE_SUCCESS) {
        handleClear();
        if (data.isNew && !data.folder_parent_id) await fetchFoldersData();
        else if (!data.isNew && data.folder_parent_id)
          await fetchChildrenDataByFolderId(data.folder_parent_id);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const deleteFolder = async (id, parent_id) => {
    try {
      let url = `${FOLDER_URL}/delete/${id}`;
      const response = await serviceRequest({
        url,
        method: "get",
      });
      if (response.status === consts.SERVICE_SUCCESS) {
        handleClear();
        // await fetchFoldersData();
        await fetchChildrenDataByFolderId(parent_id);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const deleteFile = async (id, parent_id) => {
    try {
      let url = `${FILE_URL}/delete/${id}`;
      const response = await serviceRequest({
        url,
      });
      if (response.status === consts.SERVICE_SUCCESS) {
        handleClear();
        // await fetchFoldersData();
        await fetchChildrenDataByFolderId(parent_id);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const uploadFile = async (data) => {
    try {
      let formData = new FormData();
      formData.append("file", data.file);
      formData.append("folder_id", data.folder_id);

      const response = await serviceRequest({
        url: `${FILE_URL}/add`,
        method: "post",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("File uploaded:", response);
      fetchChildrenDataByFolderId(data.folder_id);
      handleClear();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const UpdateFile = async (data) => {
    try {
      let url = `${FILE_URL}/update/${data.file_id}`;
      const response = await serviceRequest({
        url,
        method: "post",
        data,
      });
      if (response.status === consts.SERVICE_SUCCESS) {
        handleClear();
        if (data.folder_parent_id)
          fetchChildrenDataByFolderId(data.folder_parent_id);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formState.isDelete) {
      if (formState.type == "folder")
        deleteFolder(
          formState.parent_id,
          editState?.[formState?.parent_id]?.parent_id
        );
      else
        deleteFile(
          formState.parent_id,
          editState?.[formState?.parent_id]?.parent_id
        );

      return;
    }

    if (!validateForm()) return;

    let folder_id = null;
    let file_id = null;

    if (editState?.[formState.parent_id]?.id) {
      if (formState.type == "folder" || formState.isNew)
        folder_id = editState?.[formState.parent_id]?.id;
      else file_id = editState?.[formState.parent_id]?.id;
    } else {
      folder_id = currentFolder.id;
    }

    const data = {
      name: formState.name,
      description: formState.description,
      file: formState.file,
      folder_id: folder_id,
      parent_id: folder_id,
      file_id,
      isNew: formState?.isNew,
      folder_parent_id: editState?.[formState?.parent_id]?.parent_id,
    };

    console.log("dataa", data);

    try {
      if (formState.type === "folder") await createOrUpdateFolder(data);
      else if (formState.type === "file") {
        if (data.isNew) await uploadFile(data);
        else await UpdateFile(data);
      }

      handleClear();
    } catch (error) {
      console.error("API error:", error);
      setErrors({ api: "Failed to submit. Please try again." });
    }
  };

  const onClose = () => {
    handleClear();
  };

  return (
    <div className="content-wrapper">
      {/* Header */}
      <div className="content-header">
        <span className="content-title">NSM {`>`} Folders & Documents</span>
        <div className="actions">
          <div className="dropdown-container">
            <BsFilterSquareFill
              className="icon-btn"
              size={35}
              onClick={() => toggleDropdown("filter")}
            />
            {isOpenState.filter && (
              <div
                className="dropdown-menu"
                style={{ width: "350px", padding: "10px" }}
              >
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{ padding: "10px 0" }}
                >
                  <span className="" style={{ fontSize: "18px" }}>
                    Filter
                  </span>
                  <div className="d-flex flex-row justify-content-between align-items-center gap-10">
                    <span
                      className="text-underline text-danger cursor-pointer"
                      style={{ fontSize: "20px" }}
                    >
                      clear
                    </span>
                    {/* <button className="modal-clos" onClick={{}} title="Close"> */}
                    <RxCross2 className="cursor-pointer" size={"24px"} />
                    {/* </button> */}
                  </div>
                </div>
                <div className="horizontal-line-lite" />
                <div
                  className="d-flex flex-column gap-10"
                  style={{ padding: "10px" }}
                >
                  <div className="d-flex flex-column gap-10">
                    <label>Name</label>
                    <input
                      name="name"
                      placeholder="Folder name"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex flex-column gap-10">
                    <label>Description</label>
                    <input
                      name="description"
                      placeholder="Folder description"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex flex-column gap-10">
                    <label>Date</label>
                    <input
                      name="date"
                      placeholder="DD-MM-YYYY"
                      type="date"
                      required
                      onChange={handleChange}
                    />
                  </div>

                  <div className="horizontal-line-lite" />
                  <div className="d-flex flex-end align-center gap-10">
                    <button className="btn" onClick={handleClear}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="dropdown-container">
            <BsPlusSquareFill
              className="icon-btn"
              size={35}
              onClick={() => toggleDropdown("add")}
            />
            {isOpenState.add && (
              <div className="dropdown-menu">
                <span
                  className="d-item"
                  onClick={() => {
                    setFormState({ type: "folder", isNew: true });
                    toggle();
                  }}
                >
                  Create Folder
                </span>
                <div className="divider"></div>
                <span
                  className="d-item"
                  onClick={() => {
                    setFormState({ type: "file", isnew: true });
                    toggle();
                  }}
                >
                  Upload Document
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalDialog
        show={isShowing}
        onClose={onClose}
        popupTitle={
          formState.type === "file"
            ? formState.isDelete
              ? "Delete Document"
              : formState?.isNew
              ? "Upload Document"
              : "Edit Document"
            : formState.isDelete
            ? "Delete Folder"
            : formState?.isNew
            ? "Create Folder"
            : "Edit Folder"
        }
      >
        <form className="d-flex flex-column gap-15" onSubmit={handleSubmit}>
          {formState.isDelete ? (
            <div className="text-danger">Are You sure You Want to Delete ?</div>
          ) : formState.type === "file" ? (
            <div className="d-flex flex-column gap-10">
              <label>
                Browse Documents <strong className="text-danger">*</strong>{" "}
              </label>
              <input
                name="file"
                type="file"
                accept=".pdf,.txt,.png,.svg"
                required
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
          ) : (
            <>
              <div className="d-flex flex-column gap-10">
                <label>
                  Name <strong className="text-danger">*</strong>{" "}
                </label>
                <input
                  name="name"
                  placeholder="Folder name"
                  required
                  onChange={handleChange}
                  autoComplete="off"
                  value={formState?.name}
                />
              </div>
              <div className="d-flex flex-column gap-10">
                <label>
                  Description <strong className="text-danger">*</strong>{" "}
                </label>
                <input
                  name="description"
                  placeholder="Folder description"
                  required
                  onChange={handleChange}
                  autoComplete="off"
                  value={formState?.description}
                />
              </div>
            </>
          )}
          <div className="divider" />
          <div className="d-flex flex-end align-center gap-10">
            <button className="btn" onClick={handleClear}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {formState?.isDelete
                ? "Delete"
                : formState.type === "file"
                ? "Upload"
                : "Submit"}
            </button>
          </div>
        </form>
      </ModalDialog>

      {/* Folder Content */}
      <FolderContent />
    </div>
  );
}
