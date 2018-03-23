#!/bin/bash
docker build -t connector-tmd-warn . && docker run -d --net=host connector-tmd-warn
