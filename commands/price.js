const Discord = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');

// finds the price of an item.
// example: !price zebra turkeyfish
// example: !price sea bass
// example: !price wood
exports.run = (client, message, args) => {
	if (message.author.bot) return;
	const itemNameArr = args.map(x => x.toLowerCase());
	const itemName = itemNameArr.join(' ');
	const itemNameDash = itemNameArr.join('-')
	const itemNameUrl = `https://villagerdb.com/item/${itemNameDash}`;
	getPrice(itemName, itemNameUrl, message);
}

// todo: ensure we're getting the new horizons price not new leaf?
function getPrice(name, url, message) {
	let priceEmbed = new Discord.MessageEmbed().setTitle(`Sell price of ${name}`);
	request(url, (err, res, body) => {
		const $ = cheerio.load(body);
		// console.log($('.list-unstyled li').length)
		// for (var i=0; i < $('.list-unstyled li').length; i++) {
		// 	console.log($('.list-unstyled li').get(i))
		// }
		for (var i = 0; i < 5; i++) {
			if ($('.list-unstyled li').get(i).children[1] && $('.list-unstyled li').get(i).children[1].data && $('.list-unstyled li').get(i).children[1].data.search("bells") !== -1) {
				const price = $('.list-unstyled li').get(i).children[1].data;
				priceEmbed.setDescription(price);
				return message.channel.send(priceEmbed);
			}
		}
		return message.channel.send("That item cannot be found! Did you spell its name right?");
	});
}