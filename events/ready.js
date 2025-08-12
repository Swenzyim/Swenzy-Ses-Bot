const { Client, Intents } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const config = require('../config.json');

// Aktivite türleri için uygun string değerler
const activityTypes = {
    PLAYING: 'PLAYING',
    STREAMING: 'STREAMING',
    LISTENING: 'LISTENING',
    WATCHING: 'WATCHING',
};

const activityConfig = config.activity;

function getActivities() {
    return activityConfig.map(activity => ({
        name: activity.name,
        type: activityTypes[activity.type] || 'PLAYING' // Varsayılan olarak PLAYING kullanılır
    }));
}

module.exports = async (client) => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı`);

    const activities = getActivities();
    let currentIndex = 0;

    client.user.setActivity(activities[currentIndex].name, { type: activities[currentIndex].type });

    // Aktiviteleri belirli aralıklarla döndür
    setInterval(() => {
        currentIndex = (currentIndex + 1) % activities.length;
        client.user.setActivity(activities[currentIndex].name, { type: activities[currentIndex].type });
        console.log(`Aktivite Değiştirildi: ${activities[currentIndex].name}`);
    }, 60000); // Aktivite değişim süresi (milisaniye cinsinden), burada 60 saniye

    try {
        const guild = await client.guilds.fetch(config.guildId);
        const channel = await guild.channels.fetch(config.voiceChannelId);

        if (channel.isVoice()) {
            joinChannel(channel);
        } else {
            console.error('Ses kanalına erişilemiyor veya kanal bulunamadı.');
        }
    } catch (error) {
        console.error('Ses kanalına bağlanırken bir hata oluştu:', error);
    }
};

function joinChannel(channel) {
    try {
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        console.log(`Bot ${channel.name} kanalına bağlandı.`);
    } catch (error) {
        console.error('Kanal bağlantısında bir hata oluştu:', error);
    }
}
