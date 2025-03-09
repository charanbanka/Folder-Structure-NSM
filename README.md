# 📁 Folder & Document Management System

## 🚀 Overview
This project is a **full-stack folder & document management system** built using **React.js, Node.js (Express.js), and PostgreSQL**. It allows users to create folders, upload documents, and manage them efficiently with a hierarchical structure.

---

## 🏗️ Architecture Decisions

### **1. Tech Stack**
- **Frontend:** React.js (19 version) and used useContext for state managemnet
- **Backend:** Node.js with Express.js
- **Database:** PostgreSQL (Using Sequelize ORM)
- **API Documentation:** Swagger & Postman

### **2. Folder Structure**
```
/backend
  ├── models/         # Sequelize models
  ├── controllers/    # Business logic & API handlers
  ├── routes/         # API endpoints
  ├── services/    # Custom middleware (auth, logging, etc.)
  ├── /common/db         # Database & env configurations
  ├── /common/config     # configurations
  ├── /common/consts     # constants configurations
  ├── /common/utils     # serviceRequests and utils
  ├── /common/         # Database & env configurations

/frontend
  ├── src/components  # Reusable UI components
  ├── src/pages       # Page views
  ├── src/common       # configs, constants and utils management
```

### **3. Database Schema**
The system follows a **folder-document hierarchy**:
- **Folders**: Can contain subfolders and documents (self-referencing table).
- **Documents**: Each document belongs to a folder.
- **ER DIAGRAM**
- ![nsm](https://github.com/user-attachments/assets/eed4c68c-e488-4b7e-b810-16a7db48da74)


### **4. API Design**
- **RESTful API** with `/srv/folder` and `/srv/file`.
- **Proper HTTP status codes** (`200 OK`, `201 Created`, `400 Bad Request`).
- **Validation** using middleware. CORS

### **5. Security Considerations**
- **Helmet & CORS middleware** for security.

### **6. File Upload Strategy**
- Using **fileUpload** package from express for handling file uploads.
- Uploaded files are stored on **Local**.

---

## ✅ Steps to Run the Project

### **1️⃣ Clone the Repository**
```sh
git clone <repository-url>
cd <project-folder>
```

### **2️⃣ Backend Setup**
```sh
cd backend
npm install
```

- Create a `.env` file in the backend by referring to the `env.template` file.
- Run the backend server:
```sh
npm start
```

### **3️⃣ Frontend Setup**
```sh
cd frontend
npm install
npm start
```

---

## 📖 API Documentation
The API documentation is available in **Postman** and **Swagger**:
- **Postman Collection**: [Paste the generated public Postman link here]
- Please use the below document link to access the API data:
- [Google Docs API Reference](https://docs.google.com/document/d/1JQ_5S_pOqMQ7yRsCQ2DWY6uIheStOvisf1E24cuYoDA/edit?tab=t.0)


---

