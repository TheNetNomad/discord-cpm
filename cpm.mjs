console.log("Initializing...");

import { Client, GatewayIntentBits, PermissionsBitField, AttachmentBuilder } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });

import fetch from 'node-fetch';

import child_process from 'child_process';

const BOT_CHANNEL_ID = 0; //change to ID of channel to serve as terminal
const BOT_TOKEN = 0; //change to discord bot token
const PROGRAM_NAME = 'ZORK1.COM' //change to name of CP/M application

var genbotsChannel = false;
var outBuffer = "";
var child = [];
var lastRead = 0;
var attachment = "";

client.once('ready', c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
        client.channels.cache.forEach(channel => {
                if (channel.permissionsFor(client.user) == null){
                        //NOP
                }
                else if (channel.permissionsFor(client.user).has(PermissionsBitField.Flags.ViewChannel) & (channel.id == BOT_CHANNEL_ID)) {
                        genbotsChannel = channel;
                }
        })

        if(genbotsChannel){
                child = child_process.spawn("unbuffer", ['-p','iz-cpm',PROGRAM_NAME], {stdio: ["pipe","pipe","pipe"], shell: true});

                child.stdout.on('data',
                        function (data) {
                                outBuffer += data;
                                lastRead = new Date().getTime() + 500;
                        }
                );
                setInterval(function() {second()},500);
                child.stdout.on('end',
                        function () {
                                if(outBuffer.length > 1900){
                                        while(outBuffer.length > 0){
                                                genbotsChannel.send(("** **" + outBuffer.subString(0,1899)).trim());
                                                outBuffer = outBuffer.subString(1900);
                                        }
                                }
                                else if(outBuffer.length > 0){
                                        genbotsChannel.send(("** **" + outBuffer).trim());
                                        console.log(outBuffer);
                                        outBuffer = "";
                                }
                        }
                );
        }
});


client.on("messageCreate", async (message) => {
        if(message.content.toUpperCase() == "ESC"){
                genbotsChannel.send(">ESC ACKNOWLEDGED");
                child.stdin.cork();
                child.stdin.write(String.fromCharCode(27));
                child.stdin.uncork();
        }

        attachment = "";
        let attachmentUrl = message.attachments.first()?.url;
        if(attachmentUrl){
                if(attachmentUrl.toUpperCase().endsWith(".TXT") | attachmentUrl.toUpperCase().endsWith(".BAS")){
                        try{
                                let attachmentStream = await fetch(attachmentUrl);
                                attachment = await attachmentStream.text();
                        }
                        catch{
                                console.log(error)
                        }
                }
        }

        let input = message.content + attachment;

        if(message.channel == genbotsChannel && message.author.id != client.id){
                console.log(message.author.username + ": " + message.content);
                for(let line of input.split(/\r\n|\r|\n/)){
                        console.log(line);
                        if(line.charAt(0) != "*"){
                                child.stdin.cork();
                                child.stdin.write(line.toUpperCase() + "\r\n");
                                child.stdin.uncork();
                        }
                        else{
                                genbotsChannel.send(">NICE TRY");
                        }
                }

        }

});

function second(){
        let timerTest = lastRead < new Date().getTime()

        if(timerTest && outBuffer.length > 1){
                outBuffer = outBuffer.replaceAll('\r\r\n','\n');
                if(outBuffer.length > 1900){
                        genbotsChannel.send((outBuffer.substring(0,1900)).trim());
                        outBuffer = outBuffer.substring(1900);
                        while(outBuffer.length > 0){
                                genbotsChannel.send(("** **" + outBuffer.substring(0,1900)).trim());
                                outBuffer = outBuffer.substring(1900);
                        }
                }
                else{
                        genbotsChannel.send((outBuffer).trim());
                        console.log(outBuffer);
                        outBuffer = ">";
                }
        }
        else if(outBuffer.length > 1){
                genbotsChannel.sendTyping();
        }
}

async function readBuffer(stream) {
   const chunks = [];
   for await (const chunk of stream) chunks.push(chunk);
   return Buffer.concat(chunks).toString('utf8');
 }

console.log("Connecting...");
client.on('debug', console.log);
client.on('error', console.error);
client.on('warning', console.warn);
client.login("'" + BOT_TOKEN + "'");
