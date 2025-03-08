import React, { useContext, useState } from "react";
import { FaRegFolder, FaFolderOpen } from "react-icons/fa";
import { IoDocumentSharp, IoFileTray } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { FaCaretRight } from "react-icons/fa";
import { formatDate } from "../../common/utils";
import { SiGoogledocs } from "react-icons/si";
import { FaRegFilePdf } from "react-icons/fa";
import {
  MdCreateNewFolder,
  MdDelete,
  MdEdit,
  MdUploadFile,
} from "react-icons/md";
import { RiFolderUploadFill } from "react-icons/ri";

import FolderContext from "../context/folderContext";
import ModalDialog from "../popup-model";
import MyIframeComponent from "../FileViewer";
import useModal from "../popup-model/use-model";
import config from "../../common/config";

function FolderRow({ item, children, isOpen, onToggle }) {
  const { formState, setFormState, editState, updateEditState, toggle } =
    useContext(FolderContext);
  let editObject = editState?.[item?.id];

  return (
    <>
      <tr className={`folder-row ${isOpen && "active"}`} onClick={onToggle}>
        <td className="d-flex align-center folder-row-name">
          {isOpen && <FaCaretRight size="28px" />}

          <div className="icon-with-badge">
            <FaRegFolder size="28px" />

            <span className="badge">
              {parseInt(item.file_count) + parseInt(item.subfolder_count) || 0}
            </span>
          </div>
          <span>{item.name}</span>
        </td>
        <td className="folder-row-desc">{item.description}</td>
        <td>{formatDate(item.created_at)}</td>
        <td>{formatDate(item.updated_at)}</td>
        <td>
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
        </td>
      </tr>
      {isOpen && children?.length > 0 && (
        <tr className="ml-15">
          <td colSpan={5}>
            <div className="">
              {children?.map((child) => (
                <GetRows key={child.id} item={child} />
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function getIconByFileIcon(extension) {
  if (extension.includes("doc"))
    return <SiGoogledocs size="22px" color="blue" />;
  else if (extension.includes("pdf"))
    return <FaRegFilePdf size="22px" color="red" />;
}

function FileRow({ item }) {
  const {
    isShowing: iframeShowing,
    show: iframeShow,
    toggle: iframeToggle,
  } = useModal();
  const { formState, setFormState, editState, updateEditState, toggle } =
    useContext(FolderContext);

  let editObject = editState?.[item?.id];
  return (
    <tr className="file-row" key={item.id}>
      <td
        className="d-flex align-center"
        colSpan={2}
        style={{ textOverflow: "none" }}
      >
        {/* <SiGoogledocs size="22px" color="blue" /> */}
        {/* <GetIconByFileIcon extension={item.extension}/> */}
        {getIconByFileIcon(item.extension)}
        <span
          onClick={(e) => {
            e.stopPropagation();
            iframeShow();
          }}
        >
          {item.name}
        </span>
      </td>
      {/* <td></td> */}
      <td>{formatDate(item.created_at)}</td>
      <td>{formatDate(item.updated_at)}</td>

      <td>
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
      </td>
      <ModalDialog show={iframeShowing} onClose={iframeToggle}>
        <MyIframeComponent
          link={`${config.apigatewayurl}/file/fetchdatabyid/${item.id}`}
        />
      </ModalDialog>
    </tr>
  );
}

function GetRows({ item, isEdit, updateIsEdit }) {
  const {
    foldersData,
    isFolderOpenState,
    setIsFolderOpenState,
    currentFolder,
    setCurrentFolder,
    updateFolderOpenState,
  } = useContext(FolderContext);
  const isOpen = isFolderOpenState[item.id] || false;

  if (item.isFolder)
    return (
      <FolderRow
        item={item}
        isOpen={isOpen}
        onToggle={() => updateFolderOpenState(item.id, !isOpen)}
        children={foldersData[item.id] || null}
      />
    );
  // <FileRow key={item.id} item={item} isEdit={isEdit} updateIsEdit={updateIsEdit} />
  else return <FileRow key={item.id} item={item} />;
}

function FolderContent({ isEdit, updateIsEdit }) {
  const { foldersData, fetchFoldersData, updateFolderOpenState } =
    useContext(FolderContext);
  return (
    <div className="table-container">
      <table className="file-folder-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {foldersData?.parent?.map((item) => (
            <GetRows
              key={item.id}
              item={item}
              isEdit={isEdit}
              updateIsEdit={updateIsEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FolderContent;
