const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios')

const app = express();
const PORT = process.env.PORT || 8881;

app.use(bodyParser.json());

const larkCard = ({ title, content, link }) => {
  return {
    "config": { "wide_screen_mode": true },
    "header": { "template": "blue", "title": { "tag": "plain_text", "content": title } },
    "elements":
      [{ "tag": "markdown", "content": content }, { "alt": { "content": "", "tag": "plain_text" }, "img_key": "img_v2_e5d9761f-3b78-47f2-9fa6-f8438c46861h", "tag": "img", "mode": "crop_center", "compact_width": false, "custom_width": 278 }, { "tag": "action", "actions": [{ "tag": "button", "text": { "tag": "plain_text", "content": "Download App" }, "type": "primary", "url": link }] }]
  }
}
const larkHookMap = {
  'news': 'https://open.larksuite.com/open-apis/bot/v2/hook/3525f98a-1f5c-4eb4-bee5-310f18497e6c',
  'blink': 'https://open.larksuite.com/open-apis/bot/v2/hook/ad2e03d0-59e6-4a6b-b721-21bc13fe69e6'
}

app.post('/webhook', (req, res) => {
  const data = req.body
  const { action, type, appName, link, content: message, os_version, build_version, notes } = data
  console.log(data)
  const title = `⚡️ ${type === '应用更新提醒' ? 'Application Beta Updates' : action} - ${appName}`
  const content = `<font color='red'>${type === '应用更新提醒' ? `New Beta Version - ${os_version}(${build_version}build) Published 🎉🎉🎉` : message}</font>\n***\n**🔥 New Features：**\n<font>${notes}<font>\n<at id=all></at>`
  if (req.body) {
    axios.post(getLarkHookByAppName(appName), { "msg_type": "interactive", card: larkCard({ title, content, link }) }).then(res => console.log(res))
  }
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const getLarkHookByAppName = (appName) => {
  let app = ''
  Object.keys(larkHookMap).forEach(
    (i) => {
      if (appName.toLowerCase().includes(i)) {
        app = i
      }
    }
  )
  return larkHookMap[app]
}
