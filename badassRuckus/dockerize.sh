#!/bin/bash

npm run build
docker build -t goldbuick/badassruckus .
docker push goldbuick/badassruckus
