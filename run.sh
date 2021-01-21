#!/bin/bash
NOW=$(date +"%H-%M-%S")
DATE=$(date +"%m-%d-%y")
mkdir -p logs/$DATE
nohup ts-node -r tsconfig-paths/register src/index.ts &> logs/$DATE/$NOW.log & echo $! > run.pid
echo "run at pid $(cat run.pid)"