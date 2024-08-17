terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "tf-bucket455454353453345" 
    region = "us-west-1"                   
    key    = "terraform.tfstate"
  }
}


provider "aws" {
  region = "us-east-1"
}

resource "aws_dynamodb_table" "questions" {
  name           = "questions"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}