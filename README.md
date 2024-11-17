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

3. mysql commands
```
- Log in as the root user (or any other user): 
mysql -u root -p

- List all databases:
SHOW DATABASES;

- Use a specific database
USE database_name;

- Show all tables in the current db
SHOW TABLES;

- Display the structure of a table
DESCRIBE table_name;

- Create a database
CREATE DATABASE database_name;

- Create a table
USE todolist;

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false
);

- Insert data into the table
INSERT INTO todos (title, completed) VALUES ('Finish Homework', false);

INSERT INTO todos (title, completed) 
VALUES 
    ('Buy groceries', false),
    ('Clean the house', false),
    ('Pay bills', true),
    ('Complete project report', false);

- Update the data
UPDATE todos SET completed = true WHERE title = 'Clean the house';


- Check the Data
SELECT * FROM todos;


- Delete a db/table
DROP DATABASE database_name;
DROP TABLE table_name;

- Exit MySQL
EXIT;
```

3. Run database migrations (if applicable).

4. Start the Application
Run the development server:

```bash
npm run dev
```
The app will be available at http://localhost:3000.