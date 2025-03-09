import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import FileViewer from "./components/FileViewer";

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<FileViewer />} />
      </Routes>
    </div>
  );
}

export default App;
