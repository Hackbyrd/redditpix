#!/bin/bash

date > /home/hackbyrd/webapps/redditpix/myproject/temp-log.txt
/usr/local/bin/python2.7 /home/hackbyrd/webapps/redditpix/myproject/scrapeposts.py >> /home/hackbyrd/webapps/redditpix/myproject/temp-log.txt
date >> /home/hackbyrd/webapps/redditpix/myproject/temp-log.txt