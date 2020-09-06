#!/bin/bash

set -x

dnf install -y nodejs nginx git
cd /opt/
git clone https://github.com/wicaksana/alibaba-demo.git
rm -f /etc/nginx/nginx.conf && cp /opt/alibaba-demo/nginx/nginx.conf /etc/nginx/nginx.conf
systemctl enable nginx && systemctl start nginx
cd /opt/alibaba-demo/nodejs/ && npm install && npm install pm2 -g
sed -i 's/{PASSWORD}/password/' server.js
pm2 start server.js