# Aggregator

## Usage

### Using npm

1. npm install
2. npm run start

Server will be run on port: 8080
### Using Docker

#### 1. Using [Docker](https://www.docker.com/)

First you have to build the image
```
docker build -t aggregator .
```

And then you can run the server
```
docker run -d --rm --name my-server -p 8080:8080 aggregator
```

