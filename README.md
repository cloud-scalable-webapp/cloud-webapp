# CSYE6225 webapp
## Technology Stack

* Backend Technology - NodeJS
* Framework : Express
* Database : MySQL

## Prerequisites 

Install:
* Git
* Visual Studio Code
* Postman
* MySQL 

## Build Instructions
* Clone the repo using the command "git clone"
* Go into the webapp directory in Visual Studio Code
* Open terminal in Visual Studio Code and run the command "npm install"

## Deployment Instructions
* Run application by using "npm run start"
* The application runs in localhost on port 8000
* Test API endpoints using Postman

## To create a user, enter the following fields in Postman:
* first_name
* last_name
* username (must be unique for each user)
* password

## To create a product, enter the following fields in Postman:
* name
* description
* sku (must be unique for each product)
* manufacturer
* quantity (between 0 and 100)

## To add an image to a product, select the image in Postman

## Endpoints:
* Health check: GET: /healthz or /check
* Create a user account: POST: /v1/user
* Get user information: GET: /v1/user/userID
* Update user information: PUT: /v1/user/userID
* Add a product: POST: /v1/product
* Get product information: /v1/product/productID
* Update product information: PUT/PATH: /v1/product/productID
* Delete a product: DELETE: /v1/product/productID
* Add an image to a product: POST: /v1/product/productID/image
* Get all images associated with a product: GET: /v1/product/productID/image
* Get a specific image: GET: /v1/product/productID/image/imageID
* Delete an image: DELETE: /v1/product/productID/image/imageID

## Running Tests
* To run test, use "npm run test" command

## Building AMI using Packer and deploying the webapp globally:
* Install Packer on your local system
* Run the following commands:
1. packer init
2. packer validate ami.pkr.hcl
3. packer build ami.pkr.hcl

Once packer build command is run, an AMI will be created in dev account and shared with demo account using the default variables.

In order to create an AMI using self-defined variables,  you may customize the command mentioned below and run it:

packer build -var 'name=csye' -var 'instance_type=t2.micro' -var 'region=us-east-1' -var 'profile=dev' -var 'source_ami=ami-0dfcb1ef8550277af' -var 'ami_regions=["us-east-1"]' -var 'ssh_username=ec2-user' ami.pkr.hcl

Once packer AMI has been built and shared with dev/demo accounts, you can create an EC2 instance via AWS console or Terraform using the custom AMI which will install the prerequisite softwares, make the necessary configuration changes, upload application files and make the webapp available globally.

Note that the AMI is specific to a region. If you want to deploy the AMI to multiple regions, pass the region names as a variable using ami_regions.

## Application Logs & Metrics
Once the application has been deployed:
* Application logs (collected using CloudWatch Agent) can be accessed from AWS->CloudWatch->Log Groups->csye6225->webapp
* Application metrics (collected using StatsD) can be accessed from AWS->CloudWatch->All Metrics->CWAgent

## CI/CD
The application includes Github workflows which upon merge with main, will automatically create a new AMI, update the launch template, autoscaling group and refresh the existing EC2 instances to use the new AMI

## Libraries Used:

* 1. Nodemon
* 2. Bcrypt 
* 3. Express
* 4. Joi
* 5. MySQL
* 6. Sequelize
* 7. sqlite3
* 8. chai
* 9. supertest