import DiscordJS, { GuildMember, Intents } from 'discord.js'
import dotenv from 'dotenv'
import { createBrotliDecompress } from 'zlib'

dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

const https = require('https')

client.on('ready', () => {
    console.log('running ...');
})

client.on('messageCreate', (message) => {
    if (message.content === '!updaterank' || message.content === '!ur') {

        let tagExists = false

        message.member!.roles.cache.forEach(r => {

            if (r.name.includes('#')) {

                tagExists = true

                var url = 'https://api.henrikdev.xyz/valorant/v1/mmr/eu/' + r.name.replace('#', '/')

                https.get(url, function(res) {
                
                let ranks: string[] = ['Iron 1', 'Iron 2', 'Iron 3', 'Bronze 1', 'Bronze 2', 'Bronze 3', 'Silver 1', 'Silver 2', 'Silver 3', 'Gold 1', 'Gold 2', 'Gold 3', 'Platinum 1', 'Platinum 2', 'Platinum 3', 'Diamond 1', 'Diamond 2', 'Diamond 3', 'Immortal 1', 'Immortal 2', 'Immortal 3', 'Radiant']; 

                var body = '';

                res.on('data', function(chunk){
                    body += chunk;
                });

                res.on('end', function(){
                    var apiResponse = JSON.parse(body);
                    let role = message.guild!.roles.cache.find(r => r.name === apiResponse.data.currenttierpatched)

                    message.member!.roles.cache.forEach(r => {

                        for (let entry of ranks) {
                            if (r.name === entry) {
                                message.member!.roles.remove(r)
                            }
                        }

                    })

                    message.member!.roles.add(role!).catch(console.error)
                    message.reply('Your current rank is: ' + role!.name)

                });

                }).on('error', function(e){
                    console.log("beep boop an error occured :/")
                });

            }

        })

        if (!tagExists) {
            console.log("beep boop an error occured :/ (check if you set your valorant tag corrently)")
        }

    } else if (message.content.startsWith('!tag ')) {
        
        let tag = message.content.substr("!tag ".length);

        if (tag.includes('#') && tag.length < 25) {

            if (!message.guild!.roles.cache.find(r => r.name == tag)) {
                message.guild!.roles.create({
                    name: tag
                }).then(() => {(
                    message.member!.roles.cache.forEach(r => {
                        if (r.name.includes('#')) {
                            message.member!.roles.remove(r)
                        }
                    }),
                    message.member!.roles.add(message.guild!.roles.cache.find(r => r.name === tag)!).catch(console.error)
                )})
            } else {
                message.member!.roles.cache.forEach(r => {
                    if (r.name.includes('#')) {
                        message.member!.roles.remove(r)
                    }
                })
                message.member!.roles.add(message.guild!.roles.cache.find(r => r.name === tag)!).catch(console.error)
            }

        } else {
            console.log("beep boop an error occured :/")
        }

    }
})

client.login(process.env.TOKEN)
