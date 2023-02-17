FROM node:14-alpine

#Expose ports
ENV SERVER_PORT 3000
EXPOSE 3000

#ENV PORT 8080
#EXPOSE 8080
#ENV HOST=0.0.0.0
ENV PORT 4000
EXPOSE 4000

RUN cd /tmp && mkdir frontend && mkdir backend

## Cache backend package.json and install dependencies
WORKDIR /opt/app-root/src

ADD package.json /tmp/backend/package.json
RUN cd /tmp/backend && npm install

#Copy node modules into backend
RUN cp -a /tmp/backend/node_modules /opt/app-root/src

## Cache frontend package.json and install dependencies
WORKDIR /opt/app-root/src/AR-app

ADD clientApps/AR-app/package.json /tmp/frontend/package.json

# Install dependencies for frontend
RUN cd /tmp/frontend && npm install

# Copy node modules into frontned
RUN cp -a /tmp/frontend/node_modules /opt/app-root/src/AR-app

#Load Frontend Application in

COPY clientApps/AR-app/rollup.config.js ./
COPY clientApps/AR-app/package.json ./
COPY clientApps/AR-app/src ./src
COPY  clientApps/AR-app/public ./public

RUN npm run-script build

WORKDIR /opt/app-root/src

#Load Backend Application in

ADD backend_process.sh /opt/app-root/src/backend_process.sh

COPY package.json ./
COPY server /opt/app-root/src/server

RUN chmod +x /opt/app-root/src/backend_process.sh

#RUN ./wrapper_script.sh
#CMD ["/bin/sh", "-c", "npm run start&;cd /AR-app;npm start"]
#ENTRYPOINT ["/bin/sh"]
ENTRYPOINT ["/bin/sh","/opt/app-root/src/backend_process.sh"]


