const Discord = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');

// example: !villager maple
exports.run = (client, message, args) => {
	if (message.author.bot) return;
	const villagerName = args[0];
	let showName = true;
	getVillagerPicture(villagerName, showName, message);
}

function getVillagerPicture(villagerName, showName, message){
	let villagerEmbed = new Discord.MessageEmbed()
	if (showName) {
		villagerEmbed.setTitle(villagerName);
	} else {
		villagerEmbed.setTitle('??');
	}
	const link = villagerName.toLowerCase() === "sally" ? `https://villagerdb.com/villager/${villagerName}2` : `https://villagerdb.com/villager/${villagerName}`;
	console.log(link)
	request(link, (err, res, body) => {
		if (err) {
			return message.channel.send(`There was an error getting info on ${villagerName}!`);
		}
		const $ = cheerio.load(body);
		if (!$('img').get(1)) {
			return message.channel.send(`No picture of ${villagerName}!`);
		} else {
			const villagerImgSrcRaw = $('img').get(1).attribs.src;
			const villagerImgSrc = `https://villagerdb.com${villagerImgSrcRaw}`;
			villagerEmbed.setThumbnail(villagerImgSrc);
			message.channel.send(villagerEmbed);
		}
	});
}

exports.getVillagerPicture = getVillagerPicture;

