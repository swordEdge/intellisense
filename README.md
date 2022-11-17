# Aggregator

## Usage

### Using npm

To install the node package and its dependencies
```
npm install
```

To run tests
```
npm test
```

To run the server
```
npm start
```

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

