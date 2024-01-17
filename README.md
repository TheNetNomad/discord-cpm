# Discord iz-cpm Wrapper

Have you ever wanted to run a CP/M program in a Discord server? I think everyone has had this urge once or twice in their life. [iz-cpm] is an awesome emulator allowing you to run CP/M programs in your terminal. Discord iz-cpm Wrapper is a Discord bot that kicks off iz-cpm as a child process and lets you use a Discord channel as your terminal. Just update BOT_CHANNEL_ID, BOT_CLIENT_ID, and PROGRAM_NAME and you're off to the races!

## Dependencies
- iz-cpm
- unbuffer (if not already bundled with your server distro)
- node
  - discord.js
  - child_process
  - node-fetch

## Disclaimers 
- This project not associated with the creators of iz80 or iz80-cpm
- This is a trimmed-down and cleaned-up version of what I'm running, and some issues may have been introduced in that process. If something doesn't work right for you, let me know as it's likely my fault.
- This was originally written for BBC BASIC and as such prevents quitting that program and returning to the CP/M shell, but other programs may behave differently- use at your own risk.
- It's been a hot minute since I wrote this but I believe it won't work on Windows as-is but will if you change line 32 to
  `child = child_process.spawn("iz-cpm", [PROGRAM_NAME], {stdio: ["pipe","pipe","pipe"], shell: true});`
