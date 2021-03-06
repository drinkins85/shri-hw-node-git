FROM node:carbon

WORKDIR /usr/src/app

RUN apt-get update

RUN apt-get install -y git
RUN git clone --bare https://github.com/drinkins85/shri-hw-node-git.git _repo

COPY package*.json ./

RUN npm install

ENV PORT=3000

COPY . .

EXPOSE ${PORT}

CMD [ "npm", "start" ]

