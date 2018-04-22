# TPP Website
[![Docker hub](https://img.shields.io/badge/Docker%20Hub-tpportugal/tpp%5F_website-0db7ed.svg)](https://hub.docker.com/r/tpportugal/tpp_website/)
This repository holds the project of the TPP's Website. It's a containerized project and docker is used for serving it.

## Getting started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
This are the things you need to install to run this project.
```
docker (https://github.com/docker/docker-install)
```

### Running
For running the project first of all you need to build the docker image of this project. For that just run this script:
```
./build.sh
```
Now the image has been created but is not yet running. To run it, just execute this script:
```
./run.sh
```
Now everything is up and running! The service should be running on port **8001**.
Visit http://localhost:8001 and the website should appear!

### Reporting issues
If you have detected some problem on our website or you want to share an idea with us, please create an issue at: https://github.com/tpportugal/tpp/issues tagging the title with [Website]
**Example:**
Pedro noticed that the Download button is not working. So he went to https://github.com/tpportugal/tpp/issues and created an Issue with the following title: `[Website] Download button is not working`

### Contributing Guidelines

Please read our general [Contributing Guideline file](https://github.com/tpportugal/tpp/blob/master/CODE_OF_CONDUCT_EN.md) for all repositories.

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details