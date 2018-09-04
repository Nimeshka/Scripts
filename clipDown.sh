#!/bin/bash

while IFS= read -ra ADDR
do
	echo $ADDR
	wget $ADDR
done <<< "$(xclip -o)"
