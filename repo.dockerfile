FROM node:14.16.1

RUN apt-get update && apt-get install -y git
RUN git clone https://github.com/isaacguibson/pixpay-back.git

WORKDIR /pixpay-back
ENV SECRET=MEUSECRET
RUN npm install

EXPOSE 3000

CMD [ "node", "index.js" ]