## Prerequisites

1. jq (https://stedolan.github.io/jq/download/)

## Gitflow

There are 5 branches:

1. master
2. Development
  - root: for environment changes, like docker compose, microservice configuration, devops.. etc.
  - prerender: only for prerender microservice purposes
  - gateway: only for gateway microservice purposes

#### Conventions

There are 3 types of changes (lets call it as tchange)
1. feature: used to create a features
2. bugfix: used to resolve bugs
3. release: used to create a new version

##### Branch Naming

[tchange]/[microservice-name]/[issue]/[little-description]

for example:
root/feature/1/updating-readme

##### Issue namming

[tchange]/[microservice-name] [title]

for example
bug/prerender the headers is not properly seted at response

#### Releaseing

On each branch you must updating the RELEASE.md file