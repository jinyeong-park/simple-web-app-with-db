terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.76.0"
    }
  }
}
resource "aws_db_instance" "myrds" {
  engine               = "mysql"
  engine_version       = "8.0.39"
  allocated_storage    = 20
  storage_type         = "gp3"
  identifier           = "todolist-db"
  db_name             = "todolist"
  instance_class      = "db.t3.micro"
  username            = "admin"
  password            = "Password123!"  # Changed to meet minimum requirements
  publicly_accessible = false
  multi_az            = true
  
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.my_db_subnet_group.name

  tags = {
    Name = "my-rds"
  }
  # Ensure this is set for a final snapshot when deleting the instance
  skip_final_snapshot   = false
  final_snapshot_identifier = "todolist-db-final-snapshot"
}
########################################
# Local Variables
########################################
locals {
  name        = "cluster"
  region      = "us-east-1"

  vpc_cidr    = "172.31.0.0/24"
  azs         = ["us-east-1a", "us-east-1b"]

  public_subnet    = "172.31.0.0/26"
  private_subnet_1 = "172.31.0.64/26"
  private_subnet_2 = "172.31.0.128/26"
  reserved_subnet  = "172.31.0.192/26"
}

provider "aws" {
  region = local.region
}

########################################
# VPC Module
# VPC Module already create and associate route table and internet gateway
# -> so just focus on Security
########################################
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name                = "my-vpc"
  cidr                = local.vpc_cidr
  azs                 = local.azs
  public_subnets      = [local.public_subnet]
  private_subnets     = [local.private_subnet_1, local.private_subnet_2]

  enable_nat_gateway   = false  # Changed to true to allow private subnet access to internet
  # single_nat_gateway   = true  # Use single NAT Gateway to save costs
  enable_dns_hostnames = true
  enable_dns_support   = true
}

########################################
# Security Groups
########################################
resource "aws_security_group" "bastion_sg" {
  name        = "bastion-sg"
  description = "Allow SSH access"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Consider restricting to your IP
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "web_sg" {
  name        = "web-server-sg"
  description = "Allow HTTP traffic"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "rds-sg"
  description = "Allow MySQL traffic"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.web_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

########################################
# EC2
########################################
resource "aws_instance" "bastion" {
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "t2.micro"

  subnet_id                   = module.vpc.public_subnets[0]
  vpc_security_group_ids      = [aws_security_group.bastion_sg.id]
  associate_public_ip_address = true

  tags = {
    Name = "Bastion Host"
  }
}

resource "aws_launch_template" "web-server" {
  name          = "web-launch-template"
  image_id      = "ami-0c02fb55956c7d316"
  instance_type = "t2.micro"

  network_interfaces {
    security_groups = [aws_security_group.web_sg.id]
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "web-server"
    }
  }
}

########################################
# Auto Scaling
########################################
resource "aws_autoscaling_group" "web" {
  desired_capacity    = 2
  max_size           = 5
  min_size           = 2
  vpc_zone_identifier = module.vpc.private_subnets
  
  launch_template {
    id      = aws_launch_template.web-server.id
    version = "$Latest"
  }
  
  health_check_type         = "EC2"
  health_check_grace_period = 300
}

########################################
# RDS
########################################
resource "aws_db_subnet_group" "my_db_subnet_group" {
  name        = "my-db-subnet-group"
  description = "My DB Subnet Group for private subnets"
  subnet_ids  = module.vpc.private_subnets

  tags = {
    Name = "my-db-subnet-group"
  }
}

resource "aws_db_instance" "myrds" {
  engine               = "mysql"
  engine_version       = "8.0.39"
  allocated_storage    = 20
  storage_type         = "gp3"
  identifier           = "todolist-db"
  db_name             = "todolist"
  instance_class      = "db.t3.micro"
  username            = "admin"
  password            = "Password123!"  # Changed to meet minimum requirements
  publicly_accessible = false
  multi_az            = true
  
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.my_db_subnet_group.name

  tags = {
    Name = "my-rds"
  }
  # Ensure this is set for a final snapshot when deleting the instance
  skip_final_snapshot   = false
  final_snapshot_identifier = "todolist-db-final-snapshot"
}