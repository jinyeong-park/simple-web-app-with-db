# **Simple Web App with Database**

A straightforward and efficient **To-Do List Application** built with a modern tech stack to manage tasks effectively.

---

## **Tech Stack**
- **Frontend:** React  
- **Backend:** Node.js  
- **Database:** MySQL  

---

## **Features**
- Add, edit, and delete tasks seamlessly.
- Persistent data storage powered by MySQL.
- Intuitive and responsive user interface built with React.

---

## **Getting Started**

### **1. Prerequisites**
Ensure the following are installed on your machine:
- [Node.js](https://nodejs.org/)  
- [MySQL](https://www.mysql.com/)

### **2. Installation**
Clone this repository and navigate to the project folder:
```bash
git clone <repository_url>
cd simple-web-app-with-db

npm install
```

### **3. Database Setup**
1. Create a MySQL database.

2. Update the database credentials in the .env file:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=todolist
```
3. Run database migrations (if applicable).

4. Start the Application
Run the development server:

```bash
npm run dev
```
The app will be available at http://localhost:3000.