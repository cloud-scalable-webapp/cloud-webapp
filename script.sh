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
Environment=NODE_PORT=8000
Type=simple
User=ec2-user
ExecStart=/usr/bin/node /home/ec2-user/webapp/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target' >> /lib/systemd/system/webapp.service"
sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl status webapp