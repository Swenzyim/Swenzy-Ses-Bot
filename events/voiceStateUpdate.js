const { joinVoiceChannel } = require('@discordjs/voice');
const config = require('../config.json');

module.exports = (oldState, newState) => {
    // Botun ses kanalından ayrıldığını kontrol et
    if (newState.id === oldState.client.user.id) {
        if (!newState.channelId) {
            // Bot ses kanalından ayrıldı, yeniden bağlanmayı dene
            const channel = newState.guild.channels.cache.get(config.voiceChannelId);
            if (channel && channel.isVoice()) {
                joinChannel(channel);
            } else {
                console.error('Ses kanalına erişilemiyor veya kanal bulunamadı.');
            }
        } else if (oldState.channelId && !newState.channelId) {
            // Bot bir ses kanalından ayrıldı
            console.log('Bot ses kanalından ayrıldı, yeniden bağlanmayı deniyor...');
            const channel = newState.guild.channels.cache.get(config.voiceChannelId);
            if (channel && channel.isVoice()) {
                joinChannel(channel);
            } else {
                console.error('Ses kanalına erişilemiyor veya kanal bulunamadı.');
            }
        }
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
