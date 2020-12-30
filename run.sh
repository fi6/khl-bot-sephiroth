#!/bin/bash
NOW=$(date +"%T")
DATE=$(date +"%m_%d_%y")
mkdir -p logs/$DATE
nohup node index.js &> logs/$DATE/$NOW.log & echo $! > run.pid
echo "run at pid $(cat run.pid)"