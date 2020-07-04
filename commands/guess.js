const Discord = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const villagers = require("../villagers.json");
const { getVillagerPicture } = require('./villager.js');

exports.run = (client, message, args) => {
	if (message.author.bot) return;
	let showName = false;
	let randInt = Math.floor(Math.random() * 392);
	let villagerName = villagers[randInt].toLowerCase();
	getVillagerPicture(villagerName, showName, message);
	const collector = new Discord.MessageCollector(message.channel, m => (m.author.id === message.author.id) || (m.author.id !== message.author.id));
    console.log(args[0], villagerName)
    collector.on('collect', message => {
    	console.log("msg", message)
        if (message.content.toLowerCase() === villagerName) {
            message.channel.send("that's correct! :partying_face: :partying_face:");
            return collector.stop();
        } else {
            if (message.content !== "" && !message.author.bot) {
                message.channel.send("that's incorrect! try again");
            }
        }
    });
}

