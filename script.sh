sudo yum install amazon-cloudwatch-agent -y
sudo mv /tmp/amazon-cloudwatch-agent.json /opt/amazon-cloudwatch-agent.json
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/amazon-cloudwatch-agent.json -s
pwd
ls -la
cd /home/ec2-user/webapp
pwd
ls -la
npm install
sudo sh -c "echo '[Unit]
Description=webapp
After=network.target

[Service]
EnvironmentFile=/etc/environment
Type=simple
User=ec2-user
ExecStart=/usr/bin/node /home/ec2-user/webapp/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target' >> /lib/systemd/system/webapp.service"
sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl status webapp
echo "AMI Build Complete"