FROM mhart/alpine-node:latest

ENV TZ=Europe/Helsinki

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir /src

RUN npm install nodemon -g

WORKDIR /src

ADD config.js /src/config.js

ADD howlong.js /src/howlong.js

ADD package.json /src/package.json

RUN npm install

EXPOSE 8080

CMD npm start
