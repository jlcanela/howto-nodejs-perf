#!/bin/bash

cpulimit -c 1 --pid=$1 -s SIGTERM -l 10