import React, { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FaRegFolder } from "react-icons/fa";
import { IoDocumentSharp } from "react-icons/io5";
import { FaLessThan } from "react-icons/fa";
import { BsPlusSquareFill } from "react-icons/bs";
import { BsFilterSquareFill } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";
import FolderContent from "../components/homeComponents/FolderContent";
import ModalDialog from "../components/popup-model";
import useModal from "../components/popup-model/use-model";
import config from "../common/config";
import serviceRequest from "../common/utils/serviceRequest";
import consts from "../common/consts";
import ProfileBar from "../components/homeComponents/ProfileBar";
import SideBar from "../components/homeComponents/sideBar";
import { MainContent } from "../components/homeComponents/MainContent";

const FOLDER_URL = `${config.apigatewayurl}/folder`;
const FILE_URL = `${config.apigatewayurl}/file`;

export default function Dashboard() {
  const [foldersData, setFoldersData] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const [isOpenState, setIsOpenState] = useState({});
  const [isFolderOpenState, setIsFolderOpenState] = useState({});
  const [formState, setFormState] = useState({ type: "" });
  const [errors, setErrors] = useState({});
  const [currentFolder, setCurrentFolder] = useState({});
  const { isShowing, show, hide, toggle } = useModal();

  useEffect(() => {
    fetchFoldersData();
  }, []);

  async function fetchFoldersData() {
    try {
      let resp = await serviceRequest({
        url: `${FOLDER_URL}/parentfolders`,
        method: "get",
      });

      console.log("resp", resp);
      setFoldersData(resp.data);
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
      setFoldersData(resp.data);
    } catch (error) {
      console.log("error", error.message);
    }
  }

  function updateOpenState(name, value) {
    setIsOpenState((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function updateFolderOpenState(name, value) {
    setIsFolderOpenState((prev) => {
      return { ...prev, [name]: value };
    });
    if (value)
      setCurrentFolder({
        id: name,
      });
    else setCurrentFolder({});
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    // Clear error for the field being updated
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  function handleClear() {
    hide();
    setFormState({});
    setErrors({});
  }

  const validateForm = () => {
    const newErrors = {};
    if (formState?.type == "folder") {
      // Validate name
      if (!formState.name.trim()) {
        newErrors.name = "Name is required";
      }

      // Validate description (optional, but let’s say it’s required for this example)
      if (!formState.description.trim()) {
        newErrors.description = "Description is required";
      }
    } else {
      // Validate file if type is "file"
      if (formState.type === "file" && !formState.file) {
        newErrors.file = "Please select a file to upload";
      }

      if (!currentFolder?.id) {
        newErrors.file = "Please select any one folder to upload";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Mock API functions (replace with real API calls)
  const createFolder = async (data) => {
    try {
      const response = await serviceRequest({
        url: `${FOLDER_URL}/add`,
        method: "post",
        data,
      });
      console.log("Folder created:", response);
      if (response.status == consts.SERVICE_SUCCESS) {
        handleClear();
        fetchFoldersData();
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const uploadFile = async (data) => {
    try {
      let formData = new FormData();
      formData.append("file", data.file); // Ensure file is a File object
      formData.append("folder_id", data.folder_id);

      console.log("FormData content:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await serviceRequest({
        url: `${FILE_URL}/add`,
        method: "post",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" }, // Let the browser set boundary
      });

      console.log("File uploaded:", response);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      console.log("Validation errors:", errors);
      return;
    }

    // Prepare data for API call
    const data = {
      name: formState.name,
      description: formState.description,
      file: formState.file,
      folder_id: currentFolder?.id,
    };

    // API call based on type
    try {
      if (formState.type === "folder") {
        await createFolder(data);
        // alert("Folder created successfully!");
      } else if (formState.type === "file") {
        await uploadFile(data);
      }
      // Reset form and close
      setFormState({ name: "", description: "", type: "folder", file: null });
      setErrors({});
      handleClear(); // Close the form after successful submission
    } catch (error) {
      console.error("API error:", error);
      setErrors({ api: "Failed to submit. Please try again." });
    }
  };

  console.log("d", currentFolder, errors);

  return (
    <div className="dashboard-container">
      {/* profilebar */}
      <ProfileBar />

      {/* SideBar Section */}
      <SideBar foldersData={foldersData} />

      <MainContent
        isFolderOpenState={isFolderOpenState}
        updateFolderOpenState={updateFolderOpenState}
        data={foldersData}
        currentFolder={currentFolder}
        setCurrentFolder={setCurrentFolder}
      />
      {/* Right Section */}
      {/* <div className="content-panel">
        <div className="content-header">
          <span className="content-title">NSM {`>`} Folders & Documents</span>
          <div className="create-folder">
            <div className="filter-panel cf-icon">
              <BsFilterSquareFill
                className="cursor-pointer"
                size={"35px"}
                onClick={() => updateOpenState("filter", !isOpenState?.filter)}
              />
              <div
                className={`cf-add ${
                  isOpenState?.filter ? "d-flex" : "d-none"
                }`}
              >
                <span>Create Folder</span>
                <div className="horizontal-line"></div>
                <span>Upload Document</span>
              </div>
            </div>

            <div className="plus-panel cf-icon">
              <BsPlusSquareFill
                className="cursor-pointer"
                size={"35px"}
                onClick={() => updateOpenState("add", !isOpenState?.add)}
              />

              <div
                className={`cf-add ${isOpenState?.add ? "d-flex" : "d-none"}`}
              >
                <span
                  onClick={() => {
                    handleChange({ target: { name: "type", value: "folder" } });
                    toggle();
                  }}
                >
                  Create Folder
                </span>
                <div className="horizontal-line"></div>
                <span
                  onClick={() => {
                    handleChange({ target: { name: "type", value: "file" } });
                    toggle();
                  }}
                >
                  Upload Document
                </span>
              </div>
            </div>
          </div>
        </div>
        <ModalDialog
          show={isShowing}
          onClose={hide}
          popupTitle={
            formState?.type == "file" ? "Upload Document" : "Create Folder"
          }
        >
          <form className="d-flex flex-column gap-15" onSubmit={handleSubmit}>
            {formState?.type == "file" ? (
              <div className="d-flex flex-column gap-05">
                <label className="d-flex gap-05">
                  Browse document
                  <strong className="txt-error">*</strong>
                </label>
                <input
                  name="file"
                  type="file"
                  multiple={false}
                  accept=".pdf,.doc,.docx,.txt"
                  required={true}
                  onChange={(e) =>
                    handleChange({
                      target: { name: e.target.name, value: e.target.files[0] },
                    })
                  }
                ></input>
                {errors?.file && (
                  <span className="txt-error">{errors?.file}</span>
                )}
              </div>
            ) : (
              <>
                <div className="d-flex flex-column gap-05">
                  <label>
                    Name
                    <strong className="txt-error">*</strong>
                  </label>
                  <input
                    name="name"
                    value={formState?.name}
                    placeholder="Folder name"
                    required={true}
                    onChange={handleChange}
                    autoComplete="off"
                  ></input>
                </div>
                <div className="d-flex flex-column gap-05">
                  <label>
                    Description
                    <strong className="txt-error">*</strong>
                  </label>

                  <input
                    name="description"
                    value={formState?.description}
                    placeholder="Folder description"
                    required={true}
                    onChange={handleChange}
                    autoComplete="off"
                  ></input>
                </div>
              </>
            )}
            <div className="horizontal-line-lite"></div>
            <div className="d-flex flex-end align-center gap-10">
              <button className="btn" onClick={handleClear}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                // onSubmit={formOnSumbit}
              >
                {formState?.type == "file" ? "Upload" : "Submit"}
              </button>
            </div>
          </form>
        </ModalDialog>
        <div className="main-content">
          <FolderContent
            isFolderOpenState={isFolderOpenState}
            updateFolderOpenState={updateFolderOpenState}
            data={foldersData}
            currentFolder={currentFolder}
            setCurrentFolder={setCurrentFolder}
          />
        </div>
      </div> */}
    </div>
  );
}
