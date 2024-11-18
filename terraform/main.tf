# VPC
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
}

# Subnet (Public - Bastion Host)
# resource "aws_subnet" "public" {
#   vpc_id                  = aws_vpc.main.id
#   cidr_block              = "172.31.0.128/25"
#   availability_zone       = "us-west-2a"
#   map_public_ip_on_launch = true
# }
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index + 2)
  availability_zone       = var.azs[count.index]
  map_public_ip_on_launch = true
}


# Subnet (Private)
# resource "aws_subnet" "private" {
#   vpc_id                  = aws_vpc.main.id
#   cidr_block              = "172.31.0.0/25"
#   availability_zone       = "us-west-2a"
#   map_public_ip_on_launch = false
# }
resource "aws_subnet" "private" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = var.azs[count.index]
  map_public_ip_on_launch = false
}

# Internet gateway (Public Subnet)
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
}

# Route Table (Public Subnet)
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
}

# Route (인터넷을 향해 트래픽 보내기)
resource "aws_route" "internet_access" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.main.id
}

# Connect to route table
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public[0].id
  route_table_id = aws_route_table.public.id
}

# Bastion Host용 EC2 인스턴스 (Public Subnet)
resource "aws_instance" "bastion" {
  ami           = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2 AMI (다른 AMI로 바꾸세요)
  instance_type = var.instance_type
  subnet_id     = aws_subnet.public.id
  key_name      = "your-key-pair"  # 실제 키 페어를 설정하세요.
  associate_public_ip_address = true
  security_groups = [aws_security_group.bastion-sg.id]
}

# Bastion Host - Security Group
resource "aws_security_group" "bastion-sg" {
  name        = "bastion-sg"
  description = "Security group for Bastion host"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
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

# MySQL RDS instance (Active-Standby 구성)
resource "aws_db_instance" "primary_db" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = var.db_instance_class
  name                 = var.db_name
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "default.mysql8.0"
  db_subnet_group_name = aws_db_subnet_group.main.id
  multi_az             = true
  publicly_accessible  = false
  skip_final_snapshot  = true
}

# RDS Subnet group
# resource "aws_db_subnet_group" "main" {
#   name        = "my-db-subnet-group"
#   subnet_ids  = [aws_subnet.private.id]
#   description = "My DB subnet group"
# }
resource "aws_db_subnet_group" "main" {
  name        = "my-db-subnet-group"
  subnet_ids  = aws_subnet.private[*].id
  description = "My DB subnet group"
}

# Load balancer (Web server)
resource "aws_lb" "web_lb" {
  name               = "web-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.web_sg.id]
  subnets = aws_subnet.public[*].id

  enable_deletion_protection = false
  idle_timeout {
    minutes = 60
  }

  enable_cross_zone_load_balancing = true
}

# Web server - Security Group
resource "aws_security_group" "web_sg" {
  name        = "web-sg"
  description = "Security group for web servers"
  vpc_id      = aws_vpc.main.id

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

# EC2 Web server - 웹 서버가 Private Subnet에 배치되도록 수정.
# resource "aws_instance" "web_server" {
#   ami           = "ami-0c55b159cbfafe1f0" 
#   instance_type = var.instance_type
#   subnet_id     = aws_subnet.private.id
#   security_groups = [aws_security_group.web_sg.id]

#   tags = {
#     Name = "Web Server"
#   }
# }

resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0" # Amazon Linux 2 AMI (다른 AMI로 바꾸기!!)
  instance_type = var.instance_type
  subnet_id     = aws_subnet.private[0].id
  security_groups = [aws_security_group.web_sg.id]

  user_data = <<-EOT
    #!/bin/bash
    sudo yum update -y
    sudo yum install -y httpd
    echo "Hello from Web Server!" > /var/www/html/index.html
    sudo systemctl start httpd
    sudo systemctl enable httpd
  EOT
}

# Load balancer listener
resource "aws_lb_listener" "web_listener" {
  load_balancer_arn = aws_lb.web_lb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "fixed-response"
    fixed_response {
      status_code = 200
      content_type = "text/plain"
      message_body = "Hello from Load Balancer!"
    }
  }
}
