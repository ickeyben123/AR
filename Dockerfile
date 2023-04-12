FROM node:18-alpine

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

# RUN cp -a clientApps/AR-app/ /tmp/frontend/
COPY clientApps/AR-app/package.json /tmp/frontend/
COPY clientApps/AR-app/playwright.config.js /tmp/frontend/
COPY clientApps/AR-app/svelte.config.js /tmp/frontend/
COPY clientApps/AR-app/vite.config.js /tmp/frontend/
COPY clientApps/AR-app/jsconfig.json /tmp/frontend/

# Install dependencies for frontend
RUN cd /tmp/frontend && npm install

# Copy node modules into frontned
RUN cp -a /tmp/frontend/node_modules /opt/app-root/src/AR-app
RUN cp -a /tmp/frontend/.svelte-kit /opt/app-root/src/AR-app

#Load Frontend Application in

COPY clientApps/AR-app/playwright.config.js ./
COPY clientApps/AR-app/svelte.config.js ./
COPY clientApps/AR-app/vite.config.js ./
COPY clientApps/AR-app/jsconfig.json ./
COPY clientApps/AR-app/package.json ./
COPY clientApps/AR-app/src ./src
COPY clientApps/AR-app/static ./static

RUN npm run build

WORKDIR /opt/app-root/src

#Load Backend Application in

COPY package.json ./
COPY server /opt/app-root/src/server

#This runs both node servers. I cannot separate them into .sh files as windows WSL seems to mess with permissions.
ENTRYPOINT ["/bin/sh", "-c" , "npm run dev & cd /opt/app-root/src/AR-app && npm run dev & wait -n && echo $?"]
