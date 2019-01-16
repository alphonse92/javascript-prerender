# Javascript prerender microservice ecosystem


# Prerequisites

1. docker
2. docker-compose

# Configuration

For configuration topics please read the next links

1. Prerender microservice readme : https://github.com/alphonse92/javascript-prerender/
2. Gateway microservice readme: 


# Run 

1. docker-compose build
2. docker-compose run

3. love to programing <3


# Gitflow

There are 5 branches:

1. master
2. Development
  - root: for environment changes, like docker compose, microservice configuration, devops.. etc.
  - prerender: only for prerender microservice purposes
  - gateway: only for gateway microservice purposes

### Conventions

There are 3 types of changes (lets call it as tchange)
1. feature: used to create a features
2. bugfix: used to resolve bugs
3. release: used to create a new version

#### Branch Naming

[tchange]/[microservice-name]/[issue]/[little-description]

for example:
root/feature/1/updating-readme

### Issue namming

[tchange]/[microservice-name] [title]

for example
bug/prerender the headers is not properly seted at response

### Releaseing

On each branch you must updating the RELEASE.md file


