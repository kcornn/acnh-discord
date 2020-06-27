const Discord = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');

// example: !fish zebra turkeyfish
exports.run = (client, message, args) => {
	if (message.author.bot) return;
	const fishNameArr = args.map(x => x.toLowerCase());
	const fishName = fishNameArr.join(' ');
	const fishNameDash = fishNameArr.join('-')
	const fishNameUrl = `https://villagerdb.com/item/${fishNameDash}`;
	console.log()
	getPrice(fishName, fishNameUrl, message);
}

function getPrice(name, url, message) {
	let priceEmbed = new Discord.MessageEmbed().setTitle(`Sell price of ${name}`);
	request(url, (err, res, body) => {
		const $ = cheerio.load(body);
		const price = $('.list-unstyled li').get(4).children[1].data
		priceEmbed.setDescription(price);
		message.channel.send(priceEmbed)
	});
}