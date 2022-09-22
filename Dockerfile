FROM node:16.17

WORKDIR /usr/src/smart-brain-api

COPY package*.json ./
RUN npm install
COPY ./ ./

EXPOSE 3000

CMD ["/bin/bash"]