# 📁 Folder & Document Management System

## 🚀 Overview
This project is a **full-stack folder & document management system** built using **React.js, Node.js (Express.js), and PostgreSQL**. It allows users to create folders, upload documents, and manage them efficiently with a hierarchical structure.

---

## 🏗️ Architecture Decisions

### **1. Tech Stack**
- **Frontend:** React.js (Vite for fast build times)
- **Backend:** Node.js with Express.js
- **Database:** PostgreSQL (Using Sequelize ORM)
- **Authentication:** JWT-based authentication
- **API Documentation:** Swagger & Postman

### **2. Folder Structure**
```
/backend
  ├── models/         # Sequelize models
  ├── controllers/    # Business logic & API handlers
  ├── routes/         # API endpoints
  ├── middlewares/    # Custom middleware (auth, logging, etc.)
  ├── config/         # Database & env configurations

/frontend
  ├── src/components  # Reusable UI components
  ├── src/pages       # Page views
  ├── src/store       # Global state management
```

### **3. Database Schema**
The system follows a **folder-document hierarchy**:
- **Folders**: Can contain subfolders and documents (self-referencing table).
- **Documents**: Each document belongs to a folder.

### **4. API Design**
- **RESTful API** with `/api/folders` and `/api/documents`.
- **Proper HTTP status codes** (`200 OK`, `201 Created`, `400 Bad Request`).
- **Validation** using middleware.

### **5. Security Considerations**
- **JWT-based authentication** for API access.
- **Helmet & CORS middleware** for security.

### **6. File Upload Strategy**
- Using **Multer** for handling file uploads.
- Uploaded files are stored on **AWS S3** for scalability.

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
- **Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **Postman Collection**: [Add Postman collection link here]

---

## 🔗 Contributing
If you’d like to contribute, please **fork** the repository and create a pull request with your changes.

---

## ⚡ License
This project is **open-source** under the [MIT License](LICENSE).



## Architecture Decisions

### 1. Tech Stack
- **Frontend:** React.js (19 version) and used useContext for state managemnet
- **Backend:** Node.js with Express.js
- **Database:** PostgreSQL (Using Sequelize ORM)
- **API Documentation:** Swagger & Postman

### 2. Folder Structure
- **Backend**: server.js is starting poiint for server
- /models
- /routes
- /controllers
- /services
- /common/db, /common/config, /common/consts, /common/utils
- **Frontend**:
- /src/pages
- /src/common/config
- /src/common/utils/
- /src/common/consts
- /src/components/
- /src/components/homeComponents
- /src/components/context
- /src/components/FileUpload
- /src/components/use-model

### 3. Database Schema
The system follows a **folder-document hierarchy**:
- **Folders**: Can contain subfolders and documents (self-referencing table).
- **Documents**: Each document belongs to a folder.
- ER DIAGRAM
- ![Screenshot (3)](https://github.com/user-attachments/assets/743d9917-b6d8-4d15-8f7e-83e2dd880da3)

### 4. API Design
- **RESTful API** with `/srv/folder` and `/srv/file`.
- **Proper HTTP status codes** (`200 OK`, `201 Created`, `400 Bad Request`).
- **Validation** using middleware. CORS

### 5. Security Considerations
- **JWT-based authentication** for API access.
- **Helmet & CORS middleware** for security.

### 6. File Upload Strategy
- Uploaded files are stored on **Local path** using fileUpload package from express for scalability.

### 7. Steps 

Steps to follow for the setup 

1. git clone url
2. cd backend && npm i
3. please include .env file by refering envtemplate file
4. and run npm start for backend server
5. cd frontend && npm i && npm start


   

   

