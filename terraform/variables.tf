# Region
variable "aws_region" {
  description = "AWS region to deploy resources"
  default     = "us-west-1" 
}

variable "azs" {
  description = "List of availability zones"
  default     = ["us-west-1a", "us-west-1b"]
}


# VPC & Subnet CIDR
variable "vpc_cidr" {
  default = "172.31.0.0/24"
}

# Instance size
variable "instance_type" {
  default = "t3.micro"
}

# DB instance size
variable "db_instance_class" {
  default = "db.t3.micro"
}

# AWS RDS MySQL 설정
variable "db_username" {
  default = "admin"
}

variable "db_password" {
  sensitive = true
  default = "your_secure_password"
}

variable "db_name" {
  default = "todolist"
}
