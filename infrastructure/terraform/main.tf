terraform {
  required_providers {
    aws = {
      source = "aws"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = "eu-west-1"
}

resource "aws_s3_bucket" "mybucket_test" {
  bucket = "it.bz.noi.community-test"
  acl    = "public-read"
  policy = file("test/policy.json")

  website {
    index_document = "index.html"
  }
}

resource "aws_s3_bucket" "mybucket_prod" {
  bucket = "it.bz.noi.community-prod"
  acl    = "public-read"
  policy = file("prod/policy.json")

  website {
    index_document = "index.html"
  }
}
