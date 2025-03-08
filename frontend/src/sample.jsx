import { FaRegFolder, FaFolderOpen } from "react-icons/fa"; // For open/close folder icons
import { CiMenuKebab } from "react-icons/ci"; // Kebab menu icon

const folders = [
  {
    id: 1,
    name: "Mission Logs",
    documents: 5,
    description: "This file includes the most dangerous...",
    isFolder: true,
    createdAt: "17/03/2025 23:30",
    updatedAt: "17/03/2025 23:30",
  },
  {
    id: 2,
    name: "Satellite Data",
    documents: 2,
    isFolder: true,
    description: "This file includes the most dangerous...",
    createdAt: "17/03/2025 23:30",
    updatedAt: "17/03/2025 23:30",
  },
  {
    id: 3,
    name: "Open Source Tools",
    documents: 3,
    isFolder: true,
    description: "This file includes the most dangerous...",
    createdAt: "17/03/2025 23:30",
    updatedAt: "17/03/2025 23:30",
  },
  {
    id: 4,
    name: "Cybersecurity Reports",
    documents: 5,
    isFolder: true,
    description: "This file includes the most dangerous...",
    createdAt: "17/03/2025 23:30",
    updatedAt: "17/03/2025 23:30",
    children: [
      {
        id: 5,
        name: "Operating Systems",
        documents: 1,
        isFolder: false,
        files: ["note1.docx"],
        description: "This file includes the most dangerous...",
        createdAt: "17/03/2025 23:30",
        updatedAt: "17/03/2025 23:30",
      },
      {
        id: 6,
        name: "Networking Protocols",
        isFolder: true,
        documents: 2,
        description: "This file includes the most dangerous...",
        createdAt: "17/03/2025 23:30",
        updatedAt: "17/03/2025 23:30",
      },
    ],
  },
];

function MyComponent({ isFolderOpenState, updateFolderOpenState }) {
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
          {folders?.map((item) => (
            <GetRows
              key={item.id}
              item={item}
              isFolderOpenState={isFolderOpenState}
              updateFolderOpenState={updateFolderOpenState}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getFolderRow(item, isOpen, onToggle) {
  return (
    <tr className="folder-row" key={item.id} onClick={onToggle}>
      <td className="d-flex gap-10 align-center">
        {isOpen ? (
          <FaFolderOpen size={"28px"} />
        ) : (
          <FaRegFolder size={"28px"} />
        )}
        <span>{item.name}</span>
      </td>
      <td>{item.description}</td>
      <td>
        {item.createdAt} <strong>23:30</strong>
      </td>
      <td>
        {item.updatedAt} <strong>23:30</strong>
      </td>
      <td>
        <CiMenuKebab className="data-menu-icon" color="black" />
      </td>
    </tr>
  );
}

function getFileRow(item) {
  return (
    <tr className="file-row" key={item.id}>
      <td className="d-flex gap-10 align-center">
        <FaRegFile size={"28px"} /> {/* Using FaRegFile for files */}
        <span>{item.name}</span>
      </td>
      <td>{item.description}</td>
      <td>
        {item.createdAt} <strong>23:30</strong>
      </td>
      <td>
        {item.updatedAt} <strong>23:30</strong>
      </td>
      <td></td>
    </tr>
  );
}

function GetRows({ item, isFolderOpenState, updateFolderOpenState }) {
  const isOpen = isFolderOpenState?.[item.id] || false;

  if (item.isFolder) {
    return (
      <>
        {getFolderRow(item, isOpen, () =>
          updateFolderOpenState(item.id, !isOpen)
        )}
        {isOpen && item?.children && (
          <tr>
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

export default MyComponent;