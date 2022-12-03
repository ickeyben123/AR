FROM node:14-alpine


WORKDIR /opt/app-root/src


COPY package.json /opt/app-root/src
RUN npm install --only=prod
COPY server /opt/app-root/src/server
ENV SERVER_PORT 3000
EXPOSE 3000


WORKDIR /opt/app-root/src/AR-app

COPY clientApps/AR-app/rollup.config.js ./
COPY clientApps/AR-app/package*.json ./


COPY clientApps/AR-app/src ./src
COPY  clientApps/AR-app/public ./public

RUN npm install
RUN npm run-script build


#ENV PORT 8080
#EXPOSE 8080
#ENV HOST=0.0.0.0
ENV PORT 8080
EXPOSE 8080

COPY wrapper_script.sh /opt/app-root/src
#COPY frontend_process.sh /opt/app-root/src/AR-app
COPY backend_process.sh /opt/app-root/src

#CMD ["npm","start"]
CMD ["/bin/sh", "/opt/app-root/src/wrapper_script.sh"]

