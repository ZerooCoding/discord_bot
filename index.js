const { Client, MessageEmbed } = require('discord.js');
const urban = module.require('urban');
const fetch = require('node-fetch');

const bot = new Client();
const prefix = '!';

const token = 'your_bot_client_secret_goes_here';

var count = 0;
var limit = 10;

bot.on('ready', () => {
    console.log('This bot is online!');
});

bot.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    
    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'sw') {
        if (!args.length) {
            return msg.reply('command is empty, give me some context.');
        }
        else if (args.join(" ") == 'hello there') {
            return msg.reply('General Kenobi.');  
        }
        else if (args.join(" ") == 'bot?') {
            return msg.reply("I'm just a simple man trying to make my way in the universe.");
        }
        else {
            return msg.reply('I have no idea what that means.');
        }
    }

    if (command === 'help') {
        if (!args.length) {
            const infoEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Commands you can use: ')
            .setDescription('1) !help\n2) !sw hello there\n3) !sw bot?\n4) !urban\n5) !covid\n6) !covid countryName\n6) !reddit subredditName')
            .setFooter('More cmds will be available in future.');
            return msg.channel.send(infoEmbed);
        }
        else {
            return msg.reply('I have no idea what that means.');
        }
    }

    if (command === 'urban') {
        if (!args.length) {
            return msg.reply('!urban is just a cmd, enter a word after it. Example: !urban discord');
        }
        let word = args.join(" ");
        urban(word).first(json => {
            if (!json) return msg.channel.send('No results found for this word.');
            let def = (json.definition).replace(/[\[\]]/g, '');
            const urbanEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(json.word)
            .setDescription(def)
            .addField('Upvotes', json.thumbs_up, true)
            .addField('Downvotes', json.thumbs_down, true)
            .setFooter(`written by ${json.author}`);
            return msg.channel.send(urbanEmbed);
        });
    }

    if (command === 'covid') {
        if (!args.length) {
            fetch('https://corona.lmao.ninja/v2/all')
            .then(res => res.json())
            .then(data => {
                const covidEmbed = new MessageEmbed()
                .setColor('ff0000')
                .setTitle('COVID-19 Pandemic Data: Worldwide')
                .addFields(
                    {name: 'Total Cases:', value: data.cases},
                    {name: 'Total Deaths:', value: data.deaths},
                    {name: 'Recovered:', value: data.recovered},
                    {name: 'Active:', value: data.active},
                    {name: 'New Cases:', value: data.todayCases},
                    {name: 'New Deaths:', value: data.todayDeaths},
                    {name: 'Affected Countries:', value: data.affectedCountries},
                    {name: 'Tests:', value: data.tests},
                );
                return msg.channel.send(covidEmbed);
            });
        }

        else {
            let country = args.join(" ");
            fetch(`https://corona.lmao.ninja/v2/countries/${country}`)
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    return msg.reply(`${country} is not a country.`);
                }
                else {
                    const countryEmbed = new MessageEmbed()
                    .setColor('ff0000')
                    .setTitle(`COVID-19 Pandemic Data: ${data.country}`)
                    .setThumbnail(data.countryInfo.flag)
                    .addFields(
                        {name: 'Total Cases:', value: data.cases},
                        {name: 'Total Deaths:', value: data.deaths},
                        {name: 'Recovered:', value: data.recovered},
                        {name: 'Active:', value: data.active},
                        {name: 'New Cases:', value: data.todayCases},
                        {name: 'New Deaths:', value: data.todayDeaths},
                        {name: 'Tests:', value: data.tests},
                    );
                    return msg.channel.send(countryEmbed);
                }
            });
        }
    }

    if (command === 'reddit') {
        if (!args.length) {
            return msg.reply('You forgot to mention a subreddit after the cmd. Example: !reddit wholesomememes');
        }
        fetch(`https://www.reddit.com/r/${args.join()}/new.json?limit=${limit}`)
        .then(res => res.json())
        .then(data => {
            if (data.data.children[0] != null) {
                const memeEmbed = new MessageEmbed()
                .setColor('#BF91FF')
                .setImage(data.data.children[count].data.url);
                if (count === limit-1) {
                    count = 0;
                }
                else {
                    count++;
                }
                return msg.channel.send(memeEmbed);
            }
            else {
                return msg.reply(`${args} is not a subreddit.`);
            }
        });
    }
});

bot.login(token);