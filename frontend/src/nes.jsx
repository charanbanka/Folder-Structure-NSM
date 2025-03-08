import React, { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FaRegFolder } from "react-icons/fa";
import { IoDocumentSharp } from "react-icons/io5";
import { FaLessThan } from "react-icons/fa";
import { BsPlusSquareFill } from "react-icons/bs";
import { BsFilterSquareFill } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";
import { CiMenuKebab } from "react-icons/ci";
import { formatDate } from "../../common/utils";

function getFolderRow(item, isOpen, onToggle) {
  return (
    <tr className="folder-row" key={item.id} onClick={onToggle}>
      <td className="d-flex gap-10 align-center">
        <div className="icon-with-badge">
          {isOpen ? (
            <FaRegFolder size={"28px"} />
          ) : (
            <FaRegFolder size={"28px"} />
          )}
          {/* Display the documents count as a badge */}
          <span className="badge">{item.documents || 0}</span>
        </div>{" "}
        <span>{item.name}</span>
      </td>

      <td>{item.description}</td>
      <td>{formatDate(item.created_at)}</td>
      <td>{formatDate(item.updated_at)}</td>
      <td>
        <CiMenuKebab className="data-menu-icon" color="black" />
      </td>
    </tr>
  );
}

function getFileRow(item) {
  console.log("item", item);
  return (
    <tr className="file-row" key={item.id}>
      <td className="d-flex gap-10 align-center">
        <FaRegFolder size={"28px"} /> {/* Using FaRegFile for files */}
        <span>{item.name}</span>
      </td>
      <td>{item.description}</td>

      <td>{formatDate(item.created_at)}</td>
      <td>{formatDate(item.updated_at)}</td>

      <td></td>
    </tr>
  );
}

function GetRows({
  item,
  isFolderOpenState,
  updateFolderOpenState,
  currentFolder,
  setCurrentFolder,
}) {
  const isOpen = isFolderOpenState?.[item.id] || false;

  if (true) {
    return (
      <>
        {getFolderRow(item, isOpen, () =>
          updateFolderOpenState(item.id, !isOpen)
        )}
        {isOpen && item?.children && (
          <tr style={{}}>
            <td colSpan="5">
              <div className="nested-content">
                {item.children.map((child) => (
                  <GetRows
                    key={child.id}
                    item={child}
                    isFolderOpenState={isFolderOpenState}
                    updateFolderOpenState={updateFolderOpenState}
                  />
                ))}
              </div>
            </td>
          </tr>
        )}
      </>
    );
  }

  if (!item.isFolder) {
    return getFileRow(item);
  }
}

function FolderContent({
  isFolderOpenState,
  updateFolderOpenState,
  data,
  currentFolder,
  setCurrentFolder,
}) {
  return (
    <div className="table-container">
      <table className="right-side-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <GetRows
              key={item.id}
              item={item}
              isFolderOpenState={isFolderOpenState}
              updateFolderOpenState={updateFolderOpenState}
              currentFolder={currentFolder}
              setCurrentFolder={setCurrentFolder}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FolderContent;
