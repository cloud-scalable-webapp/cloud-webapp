#!/bin/sh

echo_info () {
    echo $1
}

# Updating packages
echo_info UPDATES-BEING-INSTALLED
sudo yum -y update

# Setting up the cli
echo_info PATH-SET-LINUX
PATH=/usr/bin:/usr/local/sbin:/sbin:/bin:/usr/sbin:/usr/local/bin:/opt/aws/bin:/root/bin

#Installing node server
sudo yum -y install curl
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo -E bash - &&\
sudo yum -y install nodejs

#Installing MySQL server
# sudo amazon-linux-extras install epel -y 
# sudo yum install https://dev.mysql.com/get/mysql80-community-release-el7-5.noarch.rpm -y
# sudo yum install mysql-community-server -y
# sudo systemctl enable mysqld
# sudo systemctl start mysqld
# passwords=$(sudo grep 'temporary password' /var/log/mysqld.log | awk {'print $13'})
# mysql --connect-expired-password -u root -p$passwords -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'P@ssword123';"
# sudo systemctl status mysqld

#Installing MySQL Client
sudo amazon-linux-extras install epel -y
sudo yum -y install mysql

#Creating webapp directory
mkdir /home/ec2-user/webapp
chown ec2-user:ec2-user /home/ec2-user/webapp