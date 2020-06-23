const Discord = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');

// example: !villager maple
exports.run = (client, message, args) => {
	if (message.author.bot) return;
	const villagerName = args[0];
	const command = args.shift().toLowerCase();
	console.log(args, command)
	getVillagerPicture(villagerName, showName, message);
}

function getVillagerPicture(villagerName, showName, message){
	let picExists = false;
	let villagerImgSrc;
	let villagerEmbed = new Discord.MessageEmbed().setTitle(villagerName);
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

