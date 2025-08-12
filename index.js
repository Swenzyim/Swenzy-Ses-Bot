const { Client, Intents } = require('discord.js');
const path = require('path');
const fs = require('fs');
const config = require('./config.json');

// Intents v13 ile uyumlu olarak güncellenmiştirrr
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (file.startsWith('ready')) {
        client.once('ready', () => event(client));
    } else if (file.startsWith('voiceStateUpdate')) {
        client.on('voiceStateUpdate', event);
    }
}

client.login(config.token);
