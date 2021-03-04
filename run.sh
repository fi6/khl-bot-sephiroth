#!/bin/bash
NOW=$(date +"%H-%M-%S")
DATE=$(date +"%m-%d-%y")

PID=$(cat run.pid)
PID_EXIST=$(ps aux | awk '{print $2}'| grep -w $PID)
if ps -p $PID > /dev/null
then
   echo "$PID is running"
   kill $PID
   echo "$PID killed"
   # Do something knowing the pid exists, i.e. the process with $PID is running
fi

mkdir -p logs/$DATE

nohup node --nolazy -r ts-node/register -r tsconfig-paths/register src/index.ts &> logs/$DATE/$NOW.log & echo $! > run.pid
echo "run at pid $(cat run.pid)"

unset -v latest

for file in logs/*/*; do
  [[ $file -nt $latest ]] && latest=$file
done
tail -vf -n 30 $file

