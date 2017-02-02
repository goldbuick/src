#!/bin/bash

npm run build
docker build -t exculta.space/badassruckus .
docker push exculta.space/badassruckus
