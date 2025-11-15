#!/bin/bash
cd /home/kavia/workspace/code-generation/tv-fitness-timer-and-workout-guide-40396-40412/fitness_timer_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

