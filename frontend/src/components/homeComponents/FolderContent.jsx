import React, { useContext } from "react";
import { FaRegFolder, FaImage, FaCaretRight } from "react-icons/fa";
import { IoDocumentSharp } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { formatDate } from "../../common/utils";
import { SiGoogledocs } from "react-icons/si";
import { FaRegFilePdf } from "react-icons/fa";
import FolderContext from "../context/folderContext";
import { MdCreateNewFolder, MdDelete, MdEdit } from "react-icons/md";
import { RiFolderUploadFill } from "react-icons/ri";
import MyIframeComponent from "../FileViewer";
import config from "../../common/config";
import useModal from "../popup-model/use-model";
import ModalDialog from "../popup-model";

function FolderRow({ item, isOpen, onToggle, children, ml }) {
  const { formState, setFormState, editState, updateEditState, toggle } =
    useContext(FolderContext);
  let editObject = editState?.[item?.id];
  return (
    <div>
      <div
        className={`menu-folder-row ${isOpen ? "active" : ""}`}
        onClick={onToggle}
        style={{ marginLeft: `${ml}px` }}
      >
        <div className="d-flex gap-05 align-items-center">
          {isOpen && <FaCaretRight size="28px" />}
          <div className="icon-with-badge">
            <FaRegFolder size="28px" />

            <span className="badge">
              {parseInt(item.doc_count) + parseInt(item.subfolder_count) || 0}
            </span>
          </div>
          <span>{item.name}</span>
        </div>

        <span className="">{item.description}</span>
        <span className="f">{formatDate(item.created_at)}</span>
        <span className="t">{formatDate(item.updated_at)}</span>

        <div className="dropdown-container">
          <CiMenuKebab
            className="data-menu-icon"
            color="black"
            onClick={(e) => {
              e.stopPropagation();
              updateEditState({
                isOpen: !editObject?.isOpen,
                id: item.id,
                isFolder: true,
                ...item,
              });
            }}
          />

          {editObject?.isOpen && editObject?.id === item.id && (
            <div className="dropdown-menu" style={{ minWidth: "170px" }}>
              <span
                className="d-item d-flex align-items-center gap-05"
                onClick={(e) => {
                  e.stopPropagation();
                  setFormState((prev) => {
                    return {
                      ...prev,
                      type: "folder",
                      isNew: false,
                      parent_id: item.id,
                      name: item.name,
                      description: item.description,
                    };
                  });
                  toggle();
                }}
              >
                <MdEdit className="" size={"24px"} /> Edit
              </span>
              <div className="divider"></div>
              <span
                className="d-item d-flex align-items-center gap-05"
                onClick={(e) => {
                  e.stopPropagation();

                  setFormState((prev) => {
                    return {
                      ...prev,
                      type: "folder",
                      isDelete: true,
                      parent_id: item.id,
                    };
                  });
                  toggle();
                }}
              >
                <MdDelete className="" size={"24px"} /> Delete
              </span>
              <div className="divider"></div>
              <span
                className="d-item d-flex align-items-center gap-05"
                onClick={(e) => {
                  e.stopPropagation();

                  setFormState((prev) => {
                    return {
                      ...prev,
                      type: "folder",
                      isNew: true,
                      parent_id: item.id,
                    };
                  });
                  toggle();
                }}
              >
                <MdCreateNewFolder className="" size={"24px"} /> Create Folder
              </span>
              <div className="divider"></div>
              <span
                className="d-item d-flex align-items-center gap-05"
                onClick={(e) => {
                  e.stopPropagation();

                  setFormState((prev) => {
                    return {
                      ...prev,
                      type: "file",
                      isNew: true,
                      parent_id: item.id,
                    };
                  });
                  toggle();
                }}
              >
                <RiFolderUploadFill className="" size={"24px"} /> Upload
                Document
              </span>
            </div>
          )}
        </div>
      </div>
      {isOpen && children && (
        <div
          className="divider"
          style={{ padding: "0", margin: "0", marginLeft: `${ml}px` }}
        />
      )}
      {isOpen &&
        children &&
        children?.map((child) => {
          return <GetRows key={child.id} item={child} ml={ml + 10} />;
        })}
    </div>
  );
}

function FileRow({ item, ml }) {
  const {
    isShowing: iframeShowing,
    show: iframeShow,
    toggle: iframeToggle,
  } = useModal();
  const {
    formState,
    setFormState,
    editState,
    updateEditState,
    toggle,
    getIconByFileIcon,
  } = useContext(FolderContext);

  let editObject = editState?.[item?.id];
  return (
    <>
      {" "}
      {ml > 0 && (
        <div
          className="divider"
          style={{ padding: 0, margin: 0, marginLeft: `${ml}px` }}
        ></div>
      )}
      <div className="menu-file-row" style={{ marginLeft: `${ml}px` }}>
        <div className="d-flex gap-10">
          {getIconByFileIcon(item.extension)}
          <span
            onClick={(e) => {
              e.stopPropagation();
              iframeShow();
            }}
          >
            {item.name}
          </span>
        </div>
        <span>...</span>
        <span>{formatDate(item.created_at)}</span>
        <span>{formatDate(item.updated_at)}</span>
        <div className="dropdown-container">
          <CiMenuKebab
            className="data-menu-icon"
            color="black"
            onClick={(e) => {
              e.stopPropagation();
              updateEditState({
                isOpen: !editObject?.isOpen,
                id: item.id,
                isFolder: false,
              });
            }}
          />

          {editObject?.isOpen && editObject?.id === item.id && (
            <div className="dropdown-menu" style={{ minWidth: "170px" }}>
              {/* <span
                      className="d-item d-flex align-items-center gap-05"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormState((prev) => {
                          return {
                            ...prev,
                            type: "file",
                            isNew: false,
                            parent_id: item.id,
                          };
                        });
                        toggle();
                      }}
                    >
                      <MdEdit className="" size={"24px"} /> Edit
                    </span>
                    <div className="divider"></div> */}
              <span
                className="d-item d-flex align-items-center gap-05"
                onClick={(e) => {
                  e.stopPropagation();
                  setFormState((prev) => {
                    return {
                      ...prev,
                      type: "file",
                      isDelete: true,
                      parent_id: item.id,
                    };
                  });
                  toggle();
                }}
              >
                <MdDelete className="" size={"24px"} /> Delete
              </span>
            </div>
          )}
        </div>

        <ModalDialog show={iframeShowing} onClose={iframeToggle}>
          <MyIframeComponent
            link={`${config.apigatewayurl}/file/fetchdatabyid/${item.id}`}
          />
        </ModalDialog>
      </div>
    </>
  );
}

function GetRows({ item, ml }) {
  const { foldersData, isFolderOpenState, updateFolderOpenState } =
    useContext(FolderContext);
  const isOpen = isFolderOpenState[item.id] || false;

  if (item.isFolder) {
    return (
      <FolderRow
        item={item}
        isOpen={isOpen}
        onToggle={() => updateFolderOpenState(item.id, !isOpen)}
        ml={ml}
        children={foldersData[item.id] || null}
      />
    );
  } else {
    return <FileRow key={item.id} item={item} ml={ml} />;
  }
}

function FolderContent() {
  const { foldersData } = useContext(FolderContext);
  return (
    <div className="d-flex flex-column gap-20">
      <div className="menu-header pl-20 pt-20 pb-10 pr-10">
        <span>Name</span>
        <span>Description</span>
        <span>Craeted At</span>
        <span>Updated At</span>
        <span></span>
      </div>
      <div className="menu-container">
        {!foldersData?.parent?.length && (
          <div className="mt-10 ml-10 text-danger">
            No Folder or Document Found. Plaese Create or Upload.
          </div>
        )}
        {foldersData?.parent?.map((item) => (
          <GetRows key={item.id} item={item} ml={0} />
        ))}
      </div>
    </div>
  );
}

export default FolderContent;
