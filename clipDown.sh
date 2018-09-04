#!/bin/bash

#Author: Nimeshka Srimal
#Date/Time: 05 Sep 2018 12:45 AM
#Description: Download one or more files from the URL copied to clipboard.

while IFS= read -ra ADDR
do
	echo $ADDR
	wget $ADDR
done <<< "$(xclip -o)"
