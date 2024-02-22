const axios = require('axios');

const apiUrl = "https://api.imagepipeline.io/sdxl/text2image/v1";
const apiKey = "9uo14BkxoWdmqwUfLpYYchCq9R9GfmXOnvwZcY7vQWF6IiWkGxVZAIPbOxgQGdpW"; // Replace this with your actual API key

module.exports.config = {
  name: "imagine",
  version: "1.0.0",
  aliases: ["imggen", "text2image", "img-gen", "image-gen", "genimage", "gen", "gen-image", "gen-img", "txt2img", "pipeline"],
  role: 0,
  credits: "Kenneth Panio",
  info: "Generate an image based on a text prompt.",
  type: "image-generation",
  usage: "[prompt]",
  cd: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const prompt = args.join(" ");

  if (!prompt) {
    return api.sendMessage("Please provide a prompt for image generation.", event.threadID, event.messageID);
  } else {
    api.sendMessage("🕣 | Image generation in progress...", event.threadID, event.messageID);
}

  try {
    const data = {
      "model_id": "d961a274-658c-4889-8c1a-bf85416cb1c1",
      "prompt": prompt,
      "negative_prompt": "error, cropped, worst quality, low quality",
      "num_inference_steps": 30,
      "samples": 1,
      "guidance_scale": 7.5,
      "width": 768,
      "height": 768,
      "seed": 12345,
      "safety_checker": true,
      "scheduler": "UniPCMultistepScheduler"
    };

    const response = await axios.post(apiUrl, data, {
      headers: {
        "API-Key": apiKey,
        "Content-Type": "application/json"
      },
      responseType: 'json'
    });

    const responseData = response.data;

    if (response.status === 202) {
      const id = responseData.id;
      console.log(`Image generation is accepted. Checking status...`);

      // Poll status endpoint
      await checkStatus(api, event, id);
    } else {
      console.error(`Error: ${response.statusText}`);
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    api.sendMessage("Error generating image.", event.threadID);
  }
};

async function checkStatus(api, event, id) {
  const statusUrl = `${apiUrl}/status/${id}`;

  try {
    const statusResponse = await axios.get(statusUrl, {
      headers: {
        "API-Key": apiKey
      },
      responseType: 'json'
    });

    const statusData = statusResponse.data;

    if (statusResponse.status === 200) {
      if (statusData.status === "SUCCESS") {
        const downloadUrls = statusData.download_urls;
        console.log(`Image generation successful.`);

        for (const url of downloadUrls) {
          const imageStream = await axios.get(url, { responseType: 'stream' });
          api.sendMessage({
            body: "🖼️ Image Generated!",
            attachment: imageStream.data,
          }, event.threadID);
        }
      } else if (statusData.status === "PENDING") {
        console.log(`Image generation is still pending. Checking status again in 5 seconds...`);
        setTimeout(() => checkStatus(api, event, id), 5000);
      } else if (statusData.status === "FAILURE") {
        const errorMessage = statusData.error || "Image generation failed.";
        console.error(`Image generation failed. Error: ${errorMessage}`);
        api.sendMessage(errorMessage, event.threadID);
      } else {
        console.error("Unexpected response status");
        api.sendMessage("Error generating image.", event.threadID);
      }
    } else {
      console.error(`Error checking status: ${statusResponse.statusText}`);
      api.sendMessage("Error checking image generation status.", event.threadID);
    }
  } catch (error) {
    console.error(`Error checking status: ${error.message}`);
    api.sendMessage("Error checking image generation status.", event.threadID);
  }
}


