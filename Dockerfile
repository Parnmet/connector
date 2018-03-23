FROM node:8.10.0-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Set timezone 
ENV TZ=Asia/Bangkok 
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set localhost 
# RUN echo '127.0.0.1   localhost localhost.localdomain' >> /etc/hosts

EXPOSE 80

CMD [ "node" ,"app.js" ]
