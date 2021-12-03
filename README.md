# Turtlifier
CSV to Turtl RDF triples

# Getting Started

This project is separated into two folders:
- turtlifier: Python server run and managed using poetry
- tutlifier-front: React web client for the application. The build version of this project is automatically served by the python project.


# Installation
## Automatic Installation
Execute the installation script from the root folder.
```
./installation-script
```
 If you encounter any problems, follow the manual installation instructions.

## Manual installation
### Install React Front-end dependencies
```
cd ./turtl-front/turtl-front/ && npm i -f && cd ../../
```


### Build the React Front-end
```
cd ./turtl-front/turtl-front/ && npm run build && cd ../../
```


### Install the Poetry packages
```
cd ./turtlifier && poetry install
```

### Run the project
```
poetry run start
```
