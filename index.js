const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const prefix = config.prefix;

client.once('ready', () => {
	console.log('Ready!');
});

client.on("message", message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(' ');
	const command = args.shift().toLowerCase();
	if (command === "villager") {
		message.channel.send("hi");
	}
});

client.login(config.token);