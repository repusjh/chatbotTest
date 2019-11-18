require('dotenv').config();
const {RTMClient} = require('@slack/rtm-api');
var token = process.env.SLACK_TOKEN;

var rtm = new RTMClient(token);
rtm.start();

var food = require('./food');
var movie = require('./movie');

rtm.on('message', function (message){
	var channel = message.channel;
	var text = message.text;
	
	switch (text){
		case '영화':
			movie(rtm, channel);
			break;
		case '밥':
			food(rtm, channel);
			break;
		case '놀이':
			rtm.sendMessage('고만해.', channel);
			break;
		default:
			rtm.sendMessage('안녕하세요. 영화, 밥, 놀이 중에 말씀해주세요.', channel);
	}
});
