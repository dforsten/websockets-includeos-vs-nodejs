FROM node:6.11.2

# Install git
RUN apt-get install -y git

ARG WORK_DIR=/usr/src/app

# Create app directory and frontend directory
RUN mkdir -p ${WORK_DIR}
WORKDIR ${WORK_DIR}

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY . ${WORK_DIR}
RUN npm install && npm cache clean && npm run build-production

EXPOSE 8080
CMD [ "npm", "run", "start-production" ]

