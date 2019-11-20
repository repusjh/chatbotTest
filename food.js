const food = function (rtm, channel) {
  console.log('밥집을 추천합니다.');
  rtm.sendMessage('주변 맛집을 추천해드릴게요.', channel);
};

module.exports = food;
