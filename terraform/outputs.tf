# RDS Endpoint
output "rds_endpoint" {
  value = aws_db_instance.primary_db.endpoint
}

# load balancer URL
output "web_lb_url" {
  value = aws_lb.web_lb.dns_name
}
