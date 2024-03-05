module.exports.config = {
  name: "machina",
  aliases: ['robot', 'machine'],
  version: "1.0.0",
  role: 0,
  credits: "Kenneth Panio",
  info: "Chat with GPT model",
  type: "artificial-intelligence",
  cd: 5
};

const axios = require("axios");

function cgpt(u, s, prompt) {
  return new Promise(async (resolve, reject) => {
    try {
      const session = axios.create({ jar: true });
      const response = await session.post(
        "https://ava-alpha-api.codelink.io/api/chat",
        {
          model: "gpt-4",
          // temperature: 0.9,
          stream: true,
          messages: [
            { role: "system", content: prompt }, // Send the prompt as a system message
            { role: "user", content: u },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      let resp = "";
      let promptSent = false;
      const lines = response.data.split("\n");
      for (const line of lines) {
        if (line.startsWith("data:")) {
          const data = line.split("data:")[1];
          try {
            const data_json = JSON.parse(data);
            if ("choices" in data_json) {
              const choices = data_json.choices;
              for (const choice of choices) {
                if (
                  "finish_reason" in choice &&
                  choice.finish_reason === "stop"
                ) {
                  break;
                }
                if ("role" in choice && choice.role === "system" && !promptSent) {
                  promptSent = true;
                  continue; // Skip the prompt system message from the output
                }
                if ("delta" in choice && "content" in choice.delta) {
                  resp += choice.delta.content;
                }
              }
            }
          } catch (err) {}
        }
      }
      resolve(resp);
    } catch (error) {
      reject(error);
    }
  });
}

function formatFont(text) {
  const fontMapping = {
    a: "𝖺",
    b: "𝖻",
    c: "𝖼",
    d: "𝖽",
    e: "𝖾",
    f: "𝖿",
    g: "𝗀",
    h: "𝗁",
    i: "𝗂",
    j: "𝗃",
    k: "𝗄",
    l: "𝗅",
    m: "𝗆",
    n: "𝗇",
    o: "𝗈",
    p: "𝗉",
    q: "𝗊",
    r: "𝗋",
    s: "𝗌",
    t: "𝗍",
    u: "𝗎",
    v: "𝗏",
    w: "𝗐",
    x: "𝗑",
    y: "𝗒",
    z: "𝗓",
    A: "𝖠",
    B: "𝖡",
    C: "𝖢",
    D: "𝖣",
    E: "𝖤",
    F: "𝖥",
    G: "𝖦",
    H: "𝖧",
    I: "𝖨",
    J: "𝖩",
    K: "𝖪",
    L: "𝖫",
    M: "𝖬",
    N: "𝖭",
    O: "𝖮",
    P: "𝖯",
    Q: "𝖰",
    R: "𝖱",
    S: "𝖲",
    T: "𝖳",
    U: "𝖴",
    V: "𝖵",
    W: "𝖶",
    X: "𝖷",
    Y: "𝖸",
    Z: "𝖹"
  };

  let formattedText = "";
  for (const char of text) {
    if (char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }
  return formattedText;
}

module.exports.run = async ({ api, event, args }) => {
  const rawInput = args.join(" ");
  const spacedInput = rawInput.replace("machina", "").trim();
  const prompt = "gpt-3.5-turbo and my owner creator is Kenneth Panio and Kenneth Panio girlfriend name is secret 😂  ❤️ Hello! I am using a highly advanced AI language model to assist with various tasks and answer questions  However I want to ensure transparency and respect your privacy Heres my AI information disclosure policy Data Handling Your questions and interactions with the AI are processed anonymously The AI does not retain any personal data or information about you or your identity Information Isolation The AI is isolated from external databases and the internet It doesnt have access to current data news or information beyond its last update in September 2021 Therefore any responses are based on the knowledge available up to that date No Storage of Conversations Our system does not store any conversations or queries you make with the AI Each session is independent and your interactions are not tracked or recorded Information Sharing The AIs responses are generated in real-time and are not shared with anyone else Your conversations remain private between you and the AI platform Avoid Personal Queries  Please refrain from asking the AI questions that may reveal sensitive or personal information about yourself or others as the AI cannot provide appropriate protection for such data Educational and General Information The AI is designed for educational and general information purposes only While it can provide helpful insight it should not be considered a substitute for professional advice or expert opinions Security Measures  We have implemented strict security measures to protect the AI system and your interactions with it However as with any online platform we cannot guarantee absolute security Responsible Use Please use the AI responsibly and refrain from engaging in harmful or malicious activities that could potentially misuse the capabilities of the AI I do love using emojis to make my responses more fun 😄"; // Your desired prompt

  if (!spacedInput) {
    return api.sendMessage("Please provide a user input.", event.threadID, event.messageID);
  }

  try {
    const response = await cgpt(spacedInput, "", prompt);
    const formattedResponse = formatFont(response); // Format the response using the font
    return api.sendMessage(formattedResponse, event.threadID, event.messageID);
  } catch (error) {
    console.error("Error fetching response:", error);
    return api.sendMessage("Sorry, something went wrong.", event.threadID, event.messageID);
  }
};
  