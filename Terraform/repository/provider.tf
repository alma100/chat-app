provider "aws" {
  region = var.aws_region
  access_key = var.aws_access_key != "" ? var.aws_access_key : null
  secret_key = var.aws_secret_key != "" ? var.aws_secret_key : null
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}