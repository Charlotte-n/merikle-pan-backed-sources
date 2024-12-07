FROM node:22-alpine
RUN mkdir -p /usr/src/pan/app
WORKDIR /usr/src/pan/app
COPY package.json pnpm-lock.yaml /usr/src/pan/app
RUN corepack enable
RUN --mount=id=pnpm-store,target=/root/.pnpm-store \
    pnpm install  
COPY . /usr/src/pan/app
RUN npm run build
EXPOSE 7005
CMD npm run start:prod