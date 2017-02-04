#!/bin/bash

npm run build
docker build -t exculta.space/seraphim .
docker push exculta.space/seraphim
