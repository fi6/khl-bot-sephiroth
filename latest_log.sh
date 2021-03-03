unset -v latest

for file in logs/*/*; do
  [[ $file -nt $latest ]] && latest=$file
done
tail -vf -n 30 $file