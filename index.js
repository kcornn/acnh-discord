const Discord = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');
const client = new Discord.Client();
const config = require('./config.json');
const prefix = config.prefix;
const fs = require('fs');
let villagerList = [];
let villagerName;
let guessOn = false;

client.once('ready', () => {
	console.log('Ready!');

	const link = `https://animalcrossing.fandom.com/wiki/Villager_list_(New_Horizons)`;
	request(link, (err, res, body) => {
		if (err) {
			return message.channel.send(`There was an error getting info on ${villagerName}!`);
		}
		const $ = cheerio.load(body);

		$('b').each(function (i, elem) {
			villagerList[i] = $(this).text();
		});

		villagerList.shift();
		console.log(villagerList.length);

	});
});

//get random villager
function getRandomVillager(){
	randInt = Math.floor(Math.random() * 392);
	return villagerList[randInt];
}

//get villager picture

function getVillagerPicture(villagerName, showName, message){
	let picExists = false;
	let villagerImgSrc;
	let villagerEmbed;
	if(showName){
		villagerEmbed = new Discord.MessageEmbed().setTitle(villagerName);
	}
	else{
		villagerEmbed = new Discord.MessageEmbed().setTitle('??');
	}
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



client.on("message", message => {

	if (guessOn) {
		if(wrongAnswer){
			if (message.author.bot) return;
			const args = message.content;
			userInput = args.toLowerCase();
			console.log(userInput);
			if (userInput){
				console.log(villagerName);
				if (userInput === villagerName) {
					message.channel.send("that's correct! :partying_face: :partying_face:");
					wrongAnswer = false;
					guessOn = false;
				}
				else{
					message.channel.send("that's incorrect! try again");
				}
			}
	
		}
	}
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(' ');
	const command = args.shift().toLowerCase();
	console.log(args, command)

	
	

//command villager, ex !villager maple
	if (command === "villager") {
		const villagerName = args[0];
		let showName = true
		getVillagerPicture(villagerName, showName, message);
	}

	
//villager list 
	if(command === "guess"){
		console.log(args[0])
		villagerName = getRandomVillager().toLowerCase();
		wrongAnswer = true;
		console.log("Here")
		console.log(villagerName);
		let showName = false
		getVillagerPicture(villagerName, showName, message);
		guessOn = true;
		
		// while(wrongAnswer){
		// 	if (args[0].toLowerCase() === villagerName){
		// 		message.channel.send("that's correct!");
		// 		wrongAnswer = false;
		// 	}

		// }

		


	}


});

client.login(config.token);