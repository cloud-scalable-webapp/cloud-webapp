packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.1"
      source  = "github.com/hashicorp/amazon"
    }
  }
}
variable "name" {
  type    = string
  default = "csye6225"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "region" {
  type        = string
  default     = "us-east-1"
  description = "Region where EC2 should be deployed"
}

variable "profile" {
  type    = string
  default = "dev"
}

variable "source_ami" {
  type    = string
  default = "ami-0dfcb1ef8550277af" # Amazon Linux 2
}

variable "ssh_username" {
  type    = string
  default = "ec2-user"
}

variable "ami_regions" {
  type        = list(string)
  default     = ["us-east-1"]
  description = "Regions where AMI should be copied"
}

# https://www.packer.io/plugins/builders/amazon/ebs
source "amazon-ebs" "webapp" {
  profile               = var.profile
  ami_name              = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description       = "AMI for CSYE 6225"
  region                = var.region
  ami_users             = ${{secrets.AWS_AMI_USERS}}
  force_deregister      = true
  force_delete_snapshot = true
  ami_regions           = var.ami_regions

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = var.instance_type
  source_ami    = var.source_ami
  ssh_username  = var.ssh_username

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
  tags = {
    Name = var.name
  }
}

build {
  sources = ["source.amazon-ebs.webapp"]

  provisioner "shell" {
    environment_vars = [
      "CHECKPOINT_DISABLE=1"
    ]
    scripts = [
      "packer_init.sh"
    ]
  }

  provisioner "file" {
    source      = "./"
    destination = "/home/ec2-user/webapp"
  }

  provisioner "shell" {
    environment_vars = [
      "CHECKPOINT_DISABLE=1"
    ]
    scripts = [
      "script.sh"
    ]
  }
}