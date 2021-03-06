#!/bin/bash
git fetch
git remote prune origin

git branch -r | awk '{print $1}' | egrep -v -f /dev/fd/0 <(git branch -vv | grep origin) | awk '{print $1}' | xargs git branch -d
or
git branch --merged master | grep -v '^[ *]*master$' | xargs git branch -d
