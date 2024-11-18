# Web Application with Database: AWS High Availability Architecture 

A **To-Do List Application** built with a modern tech stack to manage tasks effectively.
This app features a simple yet powerful user interface for adding, updating, deleting, and viewing to-dos, with data stored in a MySQL RDS database.

The application is designed for **High Availability (HA)**, deployed on AWS infrastructure, and includes features like load balancing, active-standby database configuration, and private subnet setup with a Bastion host for secure access.



## **Project Structure**
The project is organized into the following directories:

- backend/: Contains the API and server code (Node.js with Express).
- frontend/: Contains the React.js frontend application.
- terraform/: Terraform configuration files to provision the AWS infrastructure.

## **Tech Stack**
- **Frontend:** React  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL (RDS on AWS)  
- **Infrastructure**: AWS (VPC, EC2, RDS, Load Balancer, Bastion Host)
- **Deployment**: Terraform for Infrastructure as Code (IaC)


## **Features**
- CRUD Operations: Add, update, and delete to-do items.
- High Availability: AWS infrastructure setup with multiple Availability Zones (AZs) for fault tolerance.
- Load Balancing: Traffic is distributed across multiple EC2 instances for better performance and availability.
- Private Subnet Setup: Web and database instances are placed in private subnets for enhanced security.
- Bastion Host: A secure Bastion host is used to access the private subnet and manage the application securely.


## AWS Architecture
The infrastructure consists of the following components:

- **VPC** with multiple Availability Zones (AZs) for **high availability**.
- **EC2 Instances** running the backend application, distributed via a **Load Balancer** for better availability and scaling.
- **RDS (MySQL)** with an **Active-Standby** configuration for high availability and data redundancy.
- **Private Subnets**: Web and database resources are in private subnets to ensure they aren’t directly accessible from the public internet.
- **Bastion Host**: A Bastion host is set up in a public subnet to allow secure access to private resources.

## Accessing the Application
- **Frontend (React)**: The frontend application will be accessible through the Load Balancer's public URL once deployed.
- **Backend (Node.js)**: The backend will be running in private subnets, accessible only through the EC2 instances behind the load balancer.
- **Database**: The MySQL RDS instance will not be publicly accessible and can only be accessed from the backend EC2 instances.

#### Access the Bastion Host:
To manage the infrastructure or perform any updates to the application, connect to the Bastion host, which acts as the secure gateway to the private subnets.

## **Getting Started**

### **1. Prerequisites**
Ensure the following are installed on your machine:
- [React]: Install react.js 
- [Node.js]: Install node.js 
- [MySQL]: Install mysql2
- [Terraform]: Install Terraform

### **2. Installation**
Clone this repository and navigate to the project folder:
```bash
git clone <repository_url>
cd simple-web-app-with-db
```

#### Frontend setup
```
cd frontend
npm install
npm run build  //prepare the application for production 
```


#### Backend setup
```
cd backend
npm install
node server.js
```


#### Database Setup
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

#### Terraform Setup
```
cd terraform
terraform init
terraform plan
terraform apply
```


##### Destroy the infrastructure
```
terraform destroy
```

##### Terraform folder structure
terraform/                  # Terraform code directory
├── main.tf                 # Defines the main infrastructure resources (EC2, RDS, VPC, etc.)
├── provider.tf             # AWS provider configuration (connects to AWS resources)
├── variables.tf            # Defines input variables (e.g., instance size, region, etc.)
└── outputs.tf              # Output values (e.g., DB URL, load balancer URL, etc.)



#### Useful Resources for Terraform
- [Terraform doc for AWS - Prerequisites](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/aws-build)
- [Terraform registry AWS](https://registry.terraform.io/providers/hashicorp/aws/latest)

<!-- 시간 되면.... 밑의 구조로 수정 -->
<!-- terraform/                         # Terraform code for provisioning AWS resources
    ├── modules/                   # Reusable Terraform modules
    │   ├── vpc/                   # VPC and subnet configuration
    │   │   ├── main.tf            # VPC, subnets, route tables
    │   │   └── variables.tf       # VPC variables
    │   ├── ec2/                   # EC2 instance module (Bastion Host)
    │   │   ├── main.tf            # Bastion Host and security groups
    │   │   └── variables.tf       # EC2 variables
    │   ├── rds/                   # RDS (Active-Standby) module
    │   │   ├── main.tf            # RDS setup for Active-Standby
    │   │   └── variables.tf       # RDS variables
    │   └── alb/                   # Application Load Balancer (ALB) module
    │       ├── main.tf            # ALB setup (load balancing)
    │       └── variables.tf       # ALB variables
    ├── main.tf                    # Main entry point, tying everything together
    ├── provider.tf                # AWS provider configuration
    ├── variables.tf               # Variables (e.g., region, instance types)
    ├── outputs.tf                 # Outputs (e.g., DB endpoint, ALB URL)
    └── terraform_backend.tf       # Backend configuration (optional, for remote state management) -->
