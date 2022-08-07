const { Telegraf } = require('telegraf')
var axios = require('axios')
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply(
    "Привет, " + ctx.message.from.first_name + "!\n" +
    "Напиши мне \"weather\" и получи погоду в Алматы сегодня\n" +
    "В случае дождя в скобочках будет указано это"
))

bot.hears('weather', (ctx) => {
    axios.get('https://api.open-meteo.com/v1/forecast?latitude=43.24&longitude=76.93&hourly=temperature_2m,rain')
    .then(function (response) {
        var arr = response.data.hourly.time.slice(0,24)
        var tempArr = response.data.hourly.temperature_2m
        var rainArr = response.data.hourly.rain
        var msg = `Погода в Алматы сегодня(${arr[0].split("T")[0]}):\n`

        for(var el in arr){
            msg += arr[el].split("T")[1] + ": " + Math.floor(tempArr[el]) + "°C"
            if(rainArr[el]) msg += " (Дождь!)"
            msg += "\n"
        }
        ctx.reply(msg)
    })
    .catch(function (error) {
        ctx.reply(`Ошибка получения данных(${error})`)
    })
})

bot.launch() // запуск бота

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));