const Discord = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const villagers = require("../villagers.json")

exports.run = (client, message, args) => {
	if (message.author.bot) return;
	let showName = false;
	let randInt = Math.floor(Math.random() * 392);
	let villagerName = villagers[randInt].toLowerCase();
	getVillagerPicture(villagerName, showName, message);
	const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
    console.log(args[0], villagerName)
    collector.on('collect', message => {
    	console.log("msg", message)
        if (message.content.toLowerCase() === villagerName) {
            message.channel.send("that's correct! :partying_face: :partying_face:");
            return collector.stop();
        } else {
            message.channel.send("that's incorrect! try again");
        }
    });

}

function getVillagerPicture(villagerName, showName, message){
	let picExists = false;
	let villagerImgSrc;
	// let villagerEmbed = new Discord.MessageEmbed().setTitle(villagerName);
	let villagerEmbed = new Discord.MessageEmbed().setTitle('??');
	const link2 = `https://animalcrossing.fandom.com/wiki/${villagerName}_(villager)`;
	request(link2, (err, res, body) => {
		if (err) {
			return message.channel.send(`There was an error getting info on ${villagerName}!`);
		}
		const $ = cheerio.load(body);
		const villagerImgSrcRaw = $('figure').first().find('img').attr('src');
		console.log("first", villagerImgSrcRaw)
		if (villagerImgSrcRaw === undefined) {
			return;
		} else {
			picExists = true;
			villagerImgSrc = villagerImgSrcRaw.split('/').slice(0, 8).join('/');
			villagerEmbed = villagerEmbed.setThumbnail(villagerImgSrc);
			// console.log($('figure').first().find('img').attr('src'))
			message.channel.send(villagerEmbed);
		}
	});
	const link = `https://animalcrossing.fandom.com/wiki/${villagerName}`;
	request(link, (err, res, body) => {
		if (err) {
			return message.channel.send(`There was an error getting info on ${villagerName}!`);
		}
		const $ = cheerio.load(body);
		const villagerImgSrcRaw = $('figure').first().find('img').attr('src');
		console.log("second", villagerImgSrcRaw)
		if (villagerImgSrcRaw === undefined && !picExists) {
			return message.channel.send(`No picture of ${villagerName}!`);
		} else if (picExists) {
			return;
		} else {
			picExists = true;
			villagerImgSrc = villagerImgSrcRaw.split('/').slice(0, 8).join('/');
			console.log(villagerImgSrc)
			villagerEmbed = villagerEmbed.setThumbnail(villagerImgSrc);
			message.channel.send(villagerEmbed);
		}
	});
}

