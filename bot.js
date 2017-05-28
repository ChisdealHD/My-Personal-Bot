/*jshint esversion: 6 */
/*
 * Chis's Music Bot
 * Developed by ChisdealHD & Bacon_Space
 * Visit https://discord.gg/QWuVhAD for more information.
 */
var errorlog = require("./data/errors.json")

const Discord = require("discord.js")
const started = Date()
const admins = config.admins;
const bot = new Discord.Client()
const os = require('os')
const prefix = config.prefix;
const client_id = config.client_id;
const twitchkey = config.twitch_api_key;
const twitchusername = config.twitchusername;
const serverport = config.server_port;
const rb = "```"
const sbl = require("./data/blservers.json")
const ubl = require("./data/blusers.json")
const fs = require("fs")
const warns = require("./data/warns.json")
const queues = {}
const embedColor = 0x9900FF;
const request = require('request')
const cheerio = require('cheerio')
const markdown = require( "markdown" ).markdown;
const startTime = Date.now();
const invite = "My OAuth URL: " + `https://discordapp.com/oauth2/authorize?permissions=1341643849&scope=bot&client_id=${config.client_id}`;
var l = require('stringformat');

function secondsToString(seconds) {
    try {
        var numyears = Math.floor(seconds / 31536000);
        var numdays = Math.floor((seconds % 31536000) / 86400);
        var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
        var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
        var numseconds = Math.round((((seconds % 31536000) % 86400) % 3600) % 60);

        var str = "";
        if (numyears > 0) {
            str += numyears + " year" + (numyears == 1 ? "" : "s") + " ";
        }
        if (numdays > 0) {
            str += numdays + " day" + (numdays == 1 ? "" : "s") + " ";
        }
        if (numhours > 0) {
            str += numhours + " hour" + (numhours == 1 ? "" : "s") + " ";
        }
        if (numminutes > 0) {
            str += numminutes + " minute" + (numminutes == 1 ? "" : "s") + " ";
        }
        if (numseconds > 0) {
            str += numseconds + " second" + (numseconds == 1 ? "" : "s") + " ";
        }
        return str;
    } catch (err) {
        console.log("Could not get time")
        return 'Could not get time';
    }
}

function isCommander(id) {
	if(id === config.owner_id) {
		return true;
	}
	for(var i = 0; i < admins.length; i++){
		if(admins[i] == id) {
			return true;
		}
	}
	return false;
}

bot.on("guildMemberAdd", member => {
    let guild = member.guild;
    var guildID = member.guild.id;
    var guildGeneral = member.guild.defaultChannel.id;
    //console.log(guildGeneral);
    //console.log(guildID);
    if (guildID == "250354580926365697") { //Meme M8s Guild ID
        member.addRole(guild.roles.find('name', 'Lil Meme'));
        //client.channels.get(guildGeneral).sendMessage("Hey " + member.displayName + ", welcome to the **Chill Spot**! You are now a Lil Meme. Please read #welcome and enjoy your stay!");
    }
    if (guildID == "169960109072449536") { //Innovative Studios Guild ID
        member.addRole(guild.roles.find('name', 'Citizens of Townsville'));
    }
});

bot.on("guildCreate", guild => {
    console.log("I just joined a new server called " + guild.name)
    guild.defaultChannel.createInvite({
        maxAge: 0
    }).then(result => fs.writeFile("./servers/" + guild.name + ".txt", "Invite Code - " + result))
    guild.defaultChannel.sendMessage("Hey guys and gals! I\'m M8 Bot! Its great to meet you all, and I hope you enjoy me :P\nA list of my commands can be found by useing \"!help m8bot\".\nIf you encounter any issues, you can type \"!m8bug\" to recive links to submit issues!")

});

bot.on("guildDelete", guild => {


});

bot.on('ready', function() {
    try {
        config.client_id = client_id;
//        bot.user.setGame('Do '+prefix+'help for more | made by ChisdealHD | '+bot.guilds.size+' Connected Servers ' +prefix+ 'invite for invite bot','https://twitch.tv/chisdealhd')
        var msg = `
------------------------------------------------------
> Do 'git pull' periodically to keep your bot updated!
> Logging in...
------------------------------------------------------
Logged in as ${bot.user.username} [ID ${bot.user.id}]
On ${bot.guilds.size} servers!
${bot.channels.size} channels and ${bot.users.size} users cached!
Bot is logged in and ready to play some tunes!
LET'S GO!
------------------------------------------------------`

        console.log(msg)
        var errsize = Number(fs.statSync("./data/errors.json")["size"])
        console.log("Current error log size is " + errsize + " Bytes")
        if (errsize > 5000) {
            errorlog = {}
            fs.writeFile("./data/errors.json", JSON.stringify(errorlog), function(err) {
                if (err) return console.log("Uh oh we couldn't wipe the error log");
                console.log("Just to say, we have wiped the error log on your system as its size was too large")
            })
        }
        console.log("------------------------------------------------------")
    } catch (err) {
        console.log("WELL LADS LOOKS LIKE SOMETHING WENT WRONG! Visit MusicBot server for support (https://discord.gg/EX642f8) and quote this error:\n\n\n" + err.stack)
        errorlog[String(Object.keys(errorlog).length)] = {
            "code": err.code,
            "error": err,
            "stack": err.stack
        }
        fs.writeFile("./data/errors.json", JSON.stringify(errorlog), function(err) {
            if (err) return console.log("Even worse we couldn't write to our error log file! Make sure data/errors.json still exists!");
        })

    }
})

bot.on("message", function(message) {
    try {
        if (message.author.bot) return
		if (message.channel.type === "dm") return;
        if (message.author === bot.user)
            if (message.guild === undefined) {
                message.channel.sendMessage("The bot only works in servers!")

                return;
            }
        if (sbl.indexOf(message.guild.id) != -1 && message.content.startsWith(prefix)) {
            message.channel.sendMessage("This server is blacklisted Congratz on Blacklist Unit!")
            return
        }
        if (ubl.indexOf(message.author.id) != -1 && message.content.startsWith(prefix)) {
            message.reply(" you are blacklisted and can not use the bot!")
            return
        }

        if (message.content.startsWith(prefix + "ping")) {
            var before = Date.now()
            message.channel.sendMessage("Pong!").then(function(msg) {
                var after = Date.now()
                msg.edit("Pong! **" + (after - before) + "**ms")

            })
        }
     if (message.content === prefix + 'help') {
    message.channel.sendMessage("", {embed: {
  color: 2590000,
  author: {
    name: bot.user.username,
    icon_url: bot.user.avatarURL
  },
  title: 'Commands',
  url: 'https://docs.google.com/spreadsheets/d/1FIdXM5jG7QauYyiS3y92a-UCRapRmq8yl1axNzQZyN4/edit#gid=0',
  description: 'Where all commands Kept at.',
  fields: [
    {
      name: 'Running on:',
      value: process.release.name + ' version ' + process.version.slice(1)
    },
    {
      name: ' Created in Discord.js',
	  value: ' Version: ' + Discord.version + ' [DiscordJS](https://github.com/hydrabolt/discord.js/).'
    }
    ],
      timestamp: new Date(),
  footer: {
    icon_url: bot.user.avatarURL,
    text: '© ' + bot.user.username
  }
}});
  }
        if (message.content === prefix + 'uptime') {
            message.channel.sendMessage("I have been up for `" + secondsToString(process.uptime()) + "` - My process was started at this time --> `" + started + "`")
        }

        if (message.content.startsWith(prefix + 'sys')) {
            message.channel.sendMessage("```xl\nSystem info: " + process.platform + "-" + process.arch + " with " + process.release.name + " version " + process.version.slice(1) + "\nProcess info: PID " + process.pid + " at " + process.cwd() + "\nProcess memory usage: " + Math.ceil(process.memoryUsage().heapTotal / 1000000) + " MB\nSystem memory usage: " + Math.ceil((os.totalmem() - os.freemem()) / 1000000) + " of " + Math.ceil(os.totalmem() / 1000000) + " MB\nBot info: ID " + bot.user.id + " #" + bot.user.discriminator + "\n```");
        }
        if (message.content.startsWith(prefix + "serverblacklist")) {
            if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                let c = message.content.split(" ").splice(1).join(" ")
                let args = c.split(" ")
                console.log("[DEVELOPER DEBUG] Blacklist args were: " + args)
                if (args[0] === "remove") {
                    sbl.splice(sbl.indexOf(args[1]))
                    fs.writeFile("./data/blservers.json", JSON.stringify(sbl))
                } else if (args[0] === "add") {
                    sbl.push(args[1])
                    fs.writeFile("./data/blservers.json", JSON.stringify(sbl))
                } else {
                    message.channel.sendMessage(`You need to specify what to do! ${prefix}serverblacklist <add/remove> <server id>`)
                }
            } else {
                message.channel.sendMessage("Sorry, this command is for the owner only.")
            }

        }
        if (message.content.startsWith(prefix + 'note')) {
            if (notes[message.author.id] === undefined) {
                notes[message.author.id] = {
                    'notes': []
                }
            }
            notes[message.author.id].notes[notes[message.author.id].notes.length] = {
                'content': message.cleanContent.split(" ").splice(1).join(" "),
                'time': Date()
            }
            fs.writeFile('./data/notes.json', JSON.stringify(notes), function(err) {
                if (err) return;
                message.channel.sendMessage('Added to notes! Type `' + prefix + 'mynotes` to see all your notes')
            })
        }
        if (message.content === prefix + 'mynotes') {
            var nutes = 'Here are your notes:\n\n```'
            for (var i = 0; i < notes[message.author.id].notes.length; i++) {
                nutes += `${i + 1}) '${notes[message.author.id].notes[i].content}' - Added ${notes[message.author.id].notes[i].time}\n`
            }

            nutes += "```"
            message.channel.sendMessage(nutes)
        }

        if (message.content.startsWith(prefix + "userblacklist")) {
            if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                let c = message.content.split(" ").splice(1).join(" ")
                let args = c.split(" ")
                console.log("[DEVELOPER DEBUG] Blacklist args were: " + args)
                if (args[0] === "remove") {
                    ubl.splice(ubl.indexOf(args[1]))
                    fs.writeFile("./data/blusers.json", JSON.stringify(ubl))
                } else if (args[0] === "add") {
                    ubl.push(args[1])
                    fs.writeFile("./data/blusers.json", JSON.stringify(sbl))
                } else {
                    message.channel.sendMessage(`You need to specify what to do! ${prefix}serverblacklist <add/remove> <server id>`)
                }
            } else {
                message.channel.sendMessage("Sorry, this command is for the owner only.")
            }

        }

        if (message.content.startsWith(prefix + "lookupwarn")) {
            if (message.guild.owner.id == message.author.id || message.author.id == config.owner_id || config.admins.indexOf(message.author.id) != -1 || message.channel.permissionsFor(message.member).hasPermission('MANAGE_SERVER')) {
                let user = message.mentions.users.array()[0];
                if (!user) return message.channel.sendMessage("You need to mention the user");
                let list = Object.keys(warns);
                let found = '';
                let foundCounter = 0;
                let warnCase;
                //looking for the case id
                for (let i = 0; i < list.length; i++) {
                    if (warns[list[i]].user.id == user.id) {
                        foundCounter++;
                        found += `${(foundCounter)}. Username: ${warns[list[i]].user.name}\nAdmin: ${warns[list[i]].admin.name}\nServer: ${warns[list[i]].server.name}\nReason: ${warns[list[i]].reason}\n`;
                    }
                }
                if (foundCounter == 0) return message.channel.sendMessage("No warns recorded for that user")
                message.channel.sendMessage(`Found ${foundCounter} warns\n ${found}`);
            } else {
                message.channel.sendMessage('Only the admins can do this command');
            }
        }

        if (message.content.startsWith(prefix + "deletewarn")) {
            if (message.channel.permissionsFor(message.member).hasPermission("KICK_MEMBERS") || message.channel.permissionsFor(message.member).hasPermission("BAN_MEMBERS") || message.guild.owner.id == message.author.id || message.author.id == config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                let user = message.mentions.users.array()[0];
                if (!user) return message.channel.sendMessage("You need to mention the user");
                let list = Object.keys(warns);
                let found;
                //looking for the case id
                for (let i = 0; i < list.length; i++) {
                    if (warns[list[i]].user.id == user.id) {
                        found = list[i];
                        break;
                    }
                }
                if (!found) return message.channel.sendMessage('Nothing found for this user');
                message.channel.sendMessage(`Delete the case of ${warns[found].user.name}\nReason: ${warns[found].reason}`);
                delete warns[found];
                fs.writeFile("./data/warns.json", JSON.stringify(warns))
            } else {
                message.channel.sendMessage("You have to be able to kick/ban members to use this command")
            }
        }

        if (message.content.startsWith(prefix + 'shutdown')) {
            if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                message.channel.sendMessage("**Shutdown has been initiated**.\nShutting down...")
                setTimeout(function() {
                    bot.destroy()
                }, 1000)
                setTimeout(function() {
                    process.exit()
                }, 2000)
            }
        }
	    
	if (message.content == prefix + "server") {
        message.delete(1000);
        if (message.guild.available = true) {
            console.log("Nice Meme")
            if (message.guild.iconURL = null) {
                var iconURL = "https://newagesoldier.com/wp-content/uploads/2016/12/masbot.png";
            } else {
                var iconURL = message.guild.iconURL;
            }
            const serverEmbed = new Discord.RichEmbed()
                .setTitle(message.guild.name)
                .setColor(embedColor)
                .setFooter("ChisdealHD.XYZ", "http://chisdealhd.xyz/images/Avatar_chis.png")
                .setThumbnail(iconURL)
                .setTimestamp()
                .addField("Server ID", message.guild.id, true)
                .addField("Region", message.guild.region, true)
                .addField("Owner", message.guild.owner, true)
                .addField("Members", message.guild.memberCount, true)
                .addField("Roles", message.guild.roles.size, true)
                .addField("Channels", message.guild.channels.size, true)
                .addField("Created At", message.guild.createdAt)
                .addField("Joined Server At", message.guild.joinedAt)
            message.channel.sendEmbed(serverEmbed);
            //msg.channel.sendMessage();
        } else {
            message.reply
        }
    }
        if (message.content.startsWith(prefix + 'warn')) {
            if (message.channel.permissionsFor(message.author).hasPermission("KICK_MEMBERS") || message.channel.permissionsFor(message.author).hasPermission("BAN_MEMBERS")) {
                let c = message.content
                let usr = message.mentions.users.array()[0]
                if (!usr) return message.channel.sendMessage("You need to mention the user");
                let rsn = c.split(" ").splice(1).join(" ").replace(usr, "").replace("<@!" + usr.id + ">", "")
                let caseid = genToken(20)

                function genToken(length) {
                    let key = ""
                    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

                    for (let i = 0; i < length; i++) {
                        key += possible.charAt(Math.floor(Math.random() * possible.length))
                    }

                    return key
                }

                warns[caseid] = {
                    "admin": {
                        "name": message.author.username,
                        "discrim": message.author.discriminator,
                        "id": message.author.id
                    },
                    "user": {
                        "name": usr.username,
                        "discrim": usr.discriminator,
                        "id": usr.id
                    },
                    "server": {
                        "name": message.guild.name,
                        "id": message.guild.id,
                        "channel": message.channel.name,
                        "channel_id": message.channel.id
                    },
                    "reason": rsn
                }
                message.channel.sendMessage(usr + " was warned for `" + rsn + "`, check logs for more info")
                fs.writeFile("./data/warns.json", JSON.stringify(warns))
            } else {
                message.channel.sendMessage("You have to be able to kick/ban members to use this command!")
            }
        }

        if (message.content.startsWith(prefix + 'say')) {
            if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                var say = message.content.split(" ").splice(1).join(" ")
                message.delete();
                message.channel.sendMessage(say)
            }
        }

        if (message.content.startsWith(prefix + 'eval')) {
            if (isCommander(message.author.id)) {
                try {
                    let code = message.content.split(" ").splice(1).join(" ")
                    let result = eval(code)
                    message.channel.sendMessage("```diff\n+ " + result + "```")
                } catch (err) {
                    message.channel.sendMessage("```diff\n- " + err + "```")
                }
            } else {
                message.channel.sendMessage("Sorry, you do not have permissisons to use this command, **" + message.author.username + "**.")
            }
        }

    if (message.content.startsWith(prefix + 'invite')) {
            message.channel.sendMessage("My OAuth URL: " + `: https://discordapp.com/oauth2/authorize?permissions=1341643849&scope=bot&client_id=${config.client_id}`)
    }
    if (message.content.startsWith(prefix + 'git')) {
            message.channel.sendMessage("GitHub URL: **https://github.com/ChisdealHD/TalentRecordzBot**")
    }
	if (message.content === ":kappa") {
        message.channel.sendFile("./images/emotes/kappa.png")
    }
	if (message.content === ":beam") {
        message.channel.sendFile("./images/emotes/beam.png")
    }
	if (message.content === ":cactus") {
        message.channel.sendFile("./images/emotes/cactus.png")
    }
	if (message.content === ":cat") {
        message.channel.sendFile("./images/emotes/cat.png")
    }
	if (message.content === ":chicken") {
        message.channel.sendFile("./images/emotes/chicken.png")
    }
	if (message.content === ":dog") {
        message.channel.sendFile("./images/emotes/dog.png")
    }
	if (message.content === ":facepalm") {
        message.channel.sendFile("./images/emotes/facepalm.png")
    }
	if (message.content === ":fish") {
        message.channel.sendFile("./images/emotes/fish.png")
    }
	if (message.content === ":mappa") {
        message.channel.sendFile("./images/emotes/mappa.png")
    }
	if (message.content === ":salute") {
        message.channel.sendFile("./images/emotes/salute.png")
    }
	if (message.content === ":sloth") {
        message.channel.sendFile("./images/emotes/sloth.png")
    }
	if (message.content === ":swag") {
        message.channel.sendFile("./images/emotes/swag.png")
    }
	if (message.content === ":termital") {
        message.channel.sendFile("./images/emotes/termital.png")
    }
	if (message.content === ":whoappa") {
        message.channel.sendFile("./images/emotes/whoappa.png")
    }
	if (message.content === ":yolo") {
        message.channel.sendFile("./images/emotes/yolo.png")
    }
	if (message.content === ":heyguys") {
        message.channel.sendFile("./images/emotes/heyguys.png")
    }
	if (message.content === ":doorstop") {
        message.channel.sendFile("./images/emotes/doorstop.png")
    }
	if (message.content === ":elegiggle") {
        message.channel.sendFile("./images/emotes/elegiggle.png")
    }
	if (message.content === ":failfish") {
        message.channel.sendFile("./images/emotes/failfish.png")
    }
	if (message.content === ":feelsbadman") {
        message.channel.sendFile("./images/emotes/feelsbadman.png")
    }
	if (message.content === ":kappaclaus") {
        message.channel.sendFile("./images/emotes/kappaclaus.png")
    }
	if (message.content === ":kappapride") {
        message.channel.sendFile("./images/emotes/kappapride.png")
    }
	if (message.content === ":kappaross") {
        message.channel.sendFile("./images/emotes/kappaross.png")
    }
	if (message.content === ":kappawealth") {
        message.channel.sendFile("./images/emotes/kappawealth.png")
    }
	if (message.content === ":minglee") {
        message.channel.sendFile("./images/emotes/minglee.png")
    }
	if (message.content === ":nootnoot") {
        message.channel.sendFile("./images/emotes/nootnoot.png")
    }
	if (message.content === ":seemsgood") {
        message.channel.sendFile("./images/emotes/seemsgood.png")
    }
	if (message.content === ":swiftrage") {
        message.channel.sendFile("./images/emotes/swiftrage.png")
    }
	if (message.content === ":wutface") {
        message.channel.sendFile("./images/emotes/wutface.png")
    }
	if (message.content === ":getgranted") {
        message.channel.sendFile("./images/emotes/getgranted.png")
    }
	if (message.content === ":adults") {
        message.channel.sendFile("./images/emotes/adults.png")
    }
	if (message.content === ":android") {
        message.channel.sendFile("./images/emotes/android.png")
    }
	if (message.content === ":anonymous") {
        message.channel.sendFile("./images/emotes/anonymous.png")
    }
	if (message.content === ":deathstar") {
        message.channel.sendFile("./images/emotes/deathstar.png")
    }
	if (message.content === ":feelsgoodman") {
        message.channel.sendFile("./images/emotes/feelsgoodman.png")
    }
    if (message.content === ":thecreedsclan") {
        message.channel.sendFile("./images/emotes/LOGO.png")
    }
    if (message.content === ":ampenergycherry") {
        message.channel.sendFile("./images/emotes/AMPEnergyCherry.png")
    }
    if (message.content === ":argieb8") {
        message.channel.sendFile("./images/emotes/ArgieB8.png")
    }
    if (message.content === ":biblethump") {
        message.channel.sendFile("./images/emotes/biblethump.png")
    }
    if (message.content === ":biersderp") {
        message.channel.sendFile("./images/emotes/biersderp.png")
    }
    if (message.content === ":kapow") {
        message.channel.sendFile("./images/emotes/kapow.png")
    }
    if (message.content === ":lirik") {
        message.channel.sendFile("./images/emotes/lirik.png")
    }
    if (message.content === ":mau5") {
        message.channel.sendFile("./images/emotes/Mau5.png")
    }
    if (message.content === ":mcat") {
        message.channel.sendFile("./images/emotes/mcaT.png")
    }
    if (message.content === ":pjsalt") {
        message.channel.sendFile("./images/emotes/PJSalt.png")
    }
    if (message.content === ":pjsugar") {
        message.channel.sendFile("./images/emotes/PJSugar.png")
    }
    if (message.content === ":twitchRaid") {
        message.channel.sendFile("./images/emotes/twitchraid.png")
    }
	if (message.content === ":gaben") {
        message.channel.sendFile("./images/emotes/gaben.png")
    }
	if (message.content === ":twitch") {
        message.channel.sendFile("./images/emotes/twitch.png")
    }
    if (message.content === ":Illuminati") {
        message.channel.sendFile("./images/emotes/Illuminati.png")
    }
	if (message.content === ":dableft") {
        message.channel.sendFile("./images/emotes/dableft.png")
    }
	if (message.content === ":dabright") {
        message.channel.sendFile("./images/emotes/dabright.png")
    }
    if (message.content === prefix + "donate"){
        message.channel.sendMessage("Donate  HERE! show some LOVE <3 https://streamjar.tv/tip/chisdealhd")
    }

if (message.content.startsWith(prefix+"Mixer ")) {
        message.delete(1000)
        var Mixer = message.content.replace(prefix+"Mixer ", "")
        request("https://Mixer.com/api/v1/channels/" + Mixer, function(error, response, body) { //set info for the streamer in JSON
            if (!error && response.statusCode == 200) { //if there is no error checking
                var MixerInfo = JSON.parse(body); //setting a var for the JSON info
                const MixerStuff = new Discord.RichEmbed()
                    .setColor(embedColor)
                    .setTitle(MixerInfo.token)
                    .setFooter("ChisdealHD.XYZ", "http://chisdealhd.xyz/images/Avatar_chis.png")
                    .setTimestamp()
                    .setThumbnail(MixerInfo.user.avatarUrl)
                    .setURL("http://mixer.com/" + Mixer)
                    .addField("Online", MixerInfo.online, true)
		            .addField("Title", MixerInfo.name, true)
                    .addField("Followers", MixerInfo.numFollowers, true)
                    .addField("Mixer Level", MixerInfo.user.level, true)
		            .addField("Watching", MixerInfo.viewersCurrent, true)
                    .addField("Total Views", MixerInfo.viewersTotal, true)
                    .addField("Joined Mixer", MixerInfo.createdAt, true)
                    .addField("Audience", MixerInfo.audience, true)
                    .addField("Partnered", MixerInfo.partnered, true)
		            .addField("Player.me", MixerInfo.user.social.player, true)
		            .addField("Youtube", MixerInfo.user.social.youtube, true)
		            .addField("Twitter", MixerInfo.user.social.twitter, true)
		            .addField("Facebook", MixerInfo.user.social.facebook, true)
		            .addField("Instagram", MixerInfo.user.social.instagram, true)
		            .addField("Steam", MixerInfo.user.social.steam, true)
		            .addField("Discord", MixerInfo.user.social.discord, true)
                    message.channel.sendEmbed(MixerStuff)
            }
            else{
                    message.reply("error finding that streamer, are you sure that was the correct name?")
            }
        });
    }

	if (message.content.startsWith(prefix+"MCserverchecker ")) {
    message.delete(1000)
		var MC = message.content.replace(prefix+"MCserverchecker ", "")
		request("https://eu.mc-api.net/v3/server/info/"+suffix+"/json",) { //set info for the MC Server in JSON
            if (!error && response.statusCode == 200) { //if there is no error checking
                var MCInfo = JSON.parse(body); //setting a var for the JSON info
                const MCStuff = new Discord.RichEmbed()
                    .setColor(embedColor)
                    .setTitle(suffix + "is ONLINE!")
                    .setFooter("ChisdealHD.XYZ", "http://chisdealhd.xyz/images/Avatar_chis.png")
                    .setTimestamp()
                    .setThumbnail(MCInfo.favicon)
					.addField("Online: ", MCInfo.online, true)
                    .addField("Online Players: ", MCInfo.players.online, true)
		            .addField("MAX Players: ", MCInfo.players.max, true)
					.addField("Version: ", MCInfo.version.name, true)
                    message.channel.sendEmbed(MCStuff)
            }
            else{
                    message.reply("error finding that server IP, are you sure that was the correct IP:PORT?")
            }
        });
    }
	 if (message.content.startsWith(prefix+"arkserverchecker ")) {
    message.delete(1000)
		var Mixer = message.content.replace(prefix+"arkserverchecker ", "")
		request("http://arkservers.net/api/query/"+suffix+"/json",) { //set info for the MC Server in JSON
            if (!error && response.statusCode == 200) { //if there is no error checking
                var ARKInfo = JSON.parse(body); //setting a var for the JSON info
                const ARKStuff = new Discord.RichEmbed()
                    .setColor(embedColor)
                    .setTitle(suffix + "is ONLINE!")
                    .setFooter("ChisdealHD.XYZ", "http://chisdealhd.xyz/images/Avatar_chis.png")
                    .setTimestamp()
                    .setThumbnail(ARKInfo.favicon)
					.addField("NAME: ", ARKInfo.info.HostName, true)
                    .addField("Online Players: ", ARKInfo.info.Players, true)
		            .addField("MAX Players: ", ARKInfo.info.MaxPlayers, true)
					.addField("MAP: ", ARKInfo.info.Map, true)
                    message.channel.sendEmbed(ARKStuff)
            }
            else{
                    message.reply("error finding that server IP, are you sure that was the correct IP:PORT?")
            }
        });
    }
	if (message.content.startsWith(prefix + "dance")) {
        fs.readFile('./dance.txt', 'utf8', function(err, data) {
        var updates = data.toString().split('\n')
        message.channel.sendMessage(updates);
            console.log(updates)
            if (err) {
                message.channel.sendMessage("This Command Doesnt WORK!, Please try AGAIN!");
            }

        });
    }
	if (message.content.startsWith(prefix + "google")) {
    var searchQuery = encodeURI(message.content.substring(8))
    var url = "https://www.google.com/search?q=" + searchQuery;
    message.channel.sendMessage(url + "\n Here Is Your Search!");
    }
	if (message.content.startsWith(prefix + "8ball")) {
		var suffix = message.content.split(" ").slice(1).join(" ");
      if(suffix == "" || suffix == null) return message.channel.sendMessage("Do " + prefix1 + "8ball <Question?> for your Awser!");
		var mes = ["It is certain", "It is decidedly so" , "Without a doubt" , "Yes, definitely" , "You may rely on it" , "As I see it, yes" , "Most likely" , "Outlook good" , "Yes" , "Signs point to yes" , "Reply hazy try again" , "Ask again later" , "Better not tell you now" , "Cannot predict now" , "Concentrate and ask again" , "Don't count on it" , "My reply is no" , "The stars say no" , "Outlook not so good" , "Very doubtful"];
		message.channel.sendMessage(mes[Math.floor(Math.random() * mes.length)])
	}
	if (message.content.startsWith(prefix + "beam me up")) {
		var mes = ["Aye, aye, Captain.", "Sorry, captain. i need more power!", "Right away, captain."];
		message.channel.sendMessage(mes[Math.floor(Math.random() * mes.length)])
	}
	if (message.content.startsWith(prefix + "whats my name")) {
		var user = message.author.username;
        message.channel.sendMessage("Your name is: " + user)
    }
	if (message.content.startsWith(prefix + "ascii")) {
        message.delete(1000);
        var input = message.content.replace(prefix + "ascii ", "");
        request("https://artii.herokuapp.com/make?text=" + input, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var ascii = body;
                message.channel.sendMessage("```\n " + message.author.username + " has requested \"" + input + "\" in ASCII from! \n" + ascii + "```");
            }
        });
    }
	//Feature Requested by IronTaters
    if (message.content.startsWith(prefix+"define") || message.content.startsWith(prefix+"urban")) {
        message.delete(1000);
        if (message.content.startsWith(prefix+"define")) {
            var term = message.content.replace(prefix+"define ", "");
        }
        if (message.content.startsWith(prefix+"urban")) {
            var term = message.content.replace(prefix+"urban ", "");
        }
        request("http://api.scorpstuff.com/urbandictionary.php?term=" + term, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var def = body;
                message.channel.sendMessage(def);
            }
        });
    }
	if (message.content == prefix+"serverlist") {
        message.delete(1000)
        var listraw = bot.guilds.map(g => g.name).toString()
        var list = listraw.replace(",", ", ")
        message.channel.sendMessage("Current list of servers I am on **" + list + "**")
    }
	if (message.content.startsWith(prefix + "halo4")) {
		message.channel.sendMessage(" Mayday, mayday. This is UNSC FFG-201 Forward Unto Dawn, requesting immediate evac. Survivors aboard.")
	}
	if (message.content.startsWith(prefix + "tell me a joke")) {
		var mes = ["What did the mother bee say to the little bee, ```You bee good and beehive yourself.```", "i used to have a fear of hurdles, ```but eventually i got over it```", "Police officer to a driver: “OK, driver’s license, vehicle license, first aid kit and warning triangle. ```Driver: Nah, I’ve already got all that. But how much for that funny Captain’s cap?```", "A German, an American and a Russian walk into a bar.```The bartender looks at them suspiciously and says, “Is this some kind of a joke?```"];
		message.channel.sendMessage(mes[Math.floor(Math.random() * mes.length)])
	}
	if (message.content.startsWith(prefix+"twitch ")) {
    message.delete(1000)
		var MC = message.content.replace(prefix+"twitch ", "")
		request("https://api.twitch.tv/kraken/streams/"+suffix+"?client_id="+twitchkey,) { //set info for the MC Server in JSON
            if (!error && response.statusCode == 200) { //if there is no error checking
                var twitchInfo = JSON.parse(body); //setting a var for the JSON info
                const twitchStuff = new Discord.RichEmbed()
                    .setColor(embedColor)
                    .setTitle(suffix + "is online, playing")
                    .setFooter("ChisdealHD.XYZ", "http://chisdealhd.xyz/images/Avatar_chis.png")
                    .setTimestamp()
                    .setThumbnail(twitchInfo.favicon)
					.addField("Title: ", twitchInfo.stream.channel.status, true)
					.addField("Game: ", twitchInfo.stream.game, true)
					.setURL("http://twitch.tv/" + suffix)
					.addField("Preview: ", twitchInfo.stream.preview.large, true)
                    message.channel.sendEmbed(twitchStuff)
            }
            else{
                    message.reply("error finding that streamer, are you sure that was the correct name?")
            }
        });
    }
	if (message.content.startsWith(prefix+"streamme ")) {
    message.delete(1000)
		var MC = message.content.replace(prefix+"streamme ", "")
		request("https://www.stream.me/api-user/v1/:chisdealhd/channel,) { //set info for the MC Server in JSON
            if (!error && response.statusCode == 200) { //if there is no error checking
                var streammeInfo = JSON.parse(body); //setting a var for the JSON info
                const streammeStuff = new Discord.RichEmbed()
                    .setColor(embedColor)
                    .setTitle(suffix + "is online, playing")
                    .setFooter("ChisdealHD.XYZ", "http://chisdealhd.xyz/images/Avatar_chis.png")
                    .setTimestamp()
                    .setThumbnail(streammeInfo._embedded.streams[0]._links.avatar.href)
					.addField("Title: ", streammeInfo._embedded.streams[0].title, true)
					.addField("Followers: ", streammeInfo._embedded.streams[0].stats.human.followers, true)
					.addField("Viewers: ", streammeInfo._embedded.streams[0].stats.human.viewers, true)
					.setURL("http://stream.me/" + suffix)
                    message.channel.sendEmbed(streammeStuff)
            }
            else{
                    message.reply("error finding that streamer, are you sure that was the correct name?")
            }
        });
    }
	if(message.content.startsWith(prefix + "sub")) {
        var id = message.content.split(" ").slice(1).join(" ");
        request("https://www.googleapis.com/youtube/v3/search?part=snippet&q="+id+"&key="+ytkey, function(err, resp, body) {
            try{
                var parsed = JSON.parse(body);
                if(parsed.pageInfo.resultsPerPage != 0){
                    for(var i = 0; i < parsed.items.length; i++){
                        if(parsed.items[i].id.channelId) {
                            request("https://www.googleapis.com/youtube/v3/channels?part=statistics&id="+parsed.items[i].id.channelId+"&key="+ytkey, function(err, resp, body) {
                                var sub = JSON.parse(body);
                                if(sub.pageInfo.resultsPerPage != 0){
                                    message.channel.sendMessage("YouTube SUBSCRIBERS: **" + sub.items[0].statistics.subscriberCount + "**");
                                }else message.channel.sendMessage("Nothing found");
                            })
                        break;
                        }
                    }
                }else message.channel.sendMessage("Nothing found");
            }catch(e){
                message.channel.sendMessage(e);
            }
        })
    }

  if (message.content === prefix + 'specs') {
  message.channel.sendMessage("", {embed: {
  color: 2590000,
  author: {
    name: bot.user.username,
    icon_url: bot.user.avatarURL
  },
  title: 'Server Infomation!',
  description: 'Where all Server Infomation.',
  fields: [
    {
      name: 'System info:',
      value: process.platform
    },
	{
      name: 'System Bytes:',
      value: process.arch
    },
	{
      name: 'Running on:',
      value: process.release.name + ' version ' + process.version.slice(1)
    },
	{
      name: 'Process memory usage:',
      value: Math.ceil(process.memoryUsage().heapTotal / 1000000) + ' MB'
    },
	{
      name: 'System memory usage:',
      value: Math.ceil((os.totalmem() - os.freemem()) / 1000000) + ' of ' + Math.ceil(os.totalmem() / 1000000) + ' MB'
    },
    {
      name: ' Created in Discord.js',
	  value: ' Version: ' + Discord.version + ' [DiscordJS](https://github.com/hydrabolt/discord.js/).'
    }
    ],
      timestamp: new Date(),
  footer: {
    icon_url: bot.user.avatarURL,
    text: '© ' + bot.user.username
  }
}});
  }
})

bot.on('ready', function() {
	setInterval(() => {
        fs.readFile('./status.txt', 'utf8', function(err, data) {
        var games = data.toString().split('\n')
        bot.user.setGame(games[Math.floor(Math.random()* games.length)]+ ' | Bot Prefix ' +prefix+' | '+bot.guilds.size+' Connected Servers','https://twitch.tv/'+twitchusername, function(err) {
        console.log(games)
            if (err) {
                message.channel.sendMessage("ERROR has be MADE!" + err);
            }
       });
    });
}, 120000)
});

//bot.on('ready', function() {
//    setInterval(() => {
//        request("https://api.twitch.tv/kraken/streams/"+suffix+"?client_id="+twitchkey,
//            function(err,res,body){
//                if(err) {
//                    console.log('Error encounterd: '+err);
//                    message.channel.sendMessage("Horrible stuff happend D:. Try again later.");
//                    return;
//        }
//        var stream = JSON.parse(body);
//                if(stream.stream){
//                    bot.user.setGame(twitchusername + 'IS NOW LIVE! come and check him out!','https://twitch.tv/'+twitchusername);
//                } else {
//      if(stream.stream == null){
//        fs.readFile('./status.txt', 'utf8', function(err, data) {
//        var games = data.toString().split('\n')
//        bot.user.setGame(games[Math.floor(Math.random()* games.length)]+ ' | Bot Prefix ' +prefix+' | '+bot.guilds.size+' Connected Servers','https://twitch.tv/'+twitchusername, function(err) {
//        console.log(games)
//            if (err) {
//                message.channel.sendMessage("ERROR has be MADE!" + err);
//            }
//	}
//       });
//    });
//}, 1000)
//});

bot.login(config.token)

process.on("unhandledRejection", err => {
    console.error("Uncaught We had a promise error, if this keeps happening report to dev server (https://discord.gg/EX642f8): \n" + err.stack);
});
