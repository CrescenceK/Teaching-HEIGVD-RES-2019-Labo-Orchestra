FROM node:4.3.1
MAINTAINER Olivier Liechti <olivier.liechti@heig-vd.ch>

RUN npm install

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY src /opt/app/

WORKDIR /opt/app/

ENTRYPOINT ["node", "/opt/app/app.js"]
