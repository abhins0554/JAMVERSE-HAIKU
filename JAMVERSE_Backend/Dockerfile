FROM node:21.6.1-alpine

# Install dependencies
WORKDIR /src/

COPY package*.json ./

RUN npm install

RUN npm install nodemon -g
RUN node -v
RUN nodemon -v







ENV IS_DEBUGGING="true"
ENV IS_SERVER="false"
ENV PORT="5000"
ENV SESSION_SECRET="fhoasghfosadr4876230hdfdf_()*(*^&%*$%%^h)"

#  MONGO_URI = mongodb://localhost:27017/my_jim_jam_prod
ENV MONGO_URI="mongodb+srv://abhins0554Jamverse:WeJM0AehAjeIJw9Y@initialdb.jzhpxe6.mongodb.net/jim_jam_prod"
ENV CRYPTO_PASSWORD="d%_eQHBl]{E(/TYe>/h#tKe.#_Ah^Q15"
ENV JWT_EXPIRY_SECONDS="7d"
ENV JWT_EXPIRY="7d"
ENV JWT_ACCESS_TOKEN_SECRET="d%_eQHBl]{E(/TYe>/h#tKe.#_Ah^Q1hd%_eQHBl]{E(/TYe>/h#tKe.#_Ah^Q1hd%_eQHBl]{E(/TYe>/h#tKe.#_Ah^Q1h"
ENV AWS_ID="AKIA5F54ZY2DFTCPCFU4"
ENV AWS_SECRET="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"
ENV AWS_BUCKET_NAME="jamverse"

ENV MAILER_HOST_URL="smtp.mail.us-east-1.awsapps.com"
ENV MAILER_USER="admin@jamverse.in"
ENV MAILER_PASSWORD="NU~HhayJu8~yC.dAb#i"
ENV SUPPORT_EMAIL="admin@jamverse.in"

ENV PRODUCT_NAME="JAMVERSE"

# Expose the app port
EXPOSE 5000


CMD ["npx", "nodemon", "jamIndex.js"]