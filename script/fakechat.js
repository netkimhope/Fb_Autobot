const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
    config: {
        name: "fakechat",
        aliases: ["fc"],
        version: "1.0",
        author: "Vex_kshitiz",
        countDown: 5,
        role: 0,
        shortDescription: "",
        longDescription: "fake fb chat",
        category: "fun",
        guide: "{p} fakechat2 uid | {text} or {p} fakechat @mention | {text} or reply to someone text by fakechat {text} -{theme}"
    },
module.exports = async function (ctx) {
    const { sender, message, messageChain } = ctx.event;
    const args = message.split(' ');
    let uid;
    let mentionName;
    let textSegments = args.slice(1).join(" ").split(" | ");
    let theme = null;
    const themeMatch = textSegments.join(" ").match(/-\d+$/);

    if (themeMatch) {
        theme = themeMatch[0];
        textSegments = textSegments.join(" ").replace(theme, '').split(" | ");
    }

    if (messageChain[1] && messageChain[1].type === 'At') {
        uid = messageChain[1].target;
        mentionName = messageChain[1].display;
        textSegments = args.slice(2).join(" ").split(" | ");
    } else if (/^\d+$/.test(args[0])) {
        uid = args[0];
    } else if (ctx.event.reply) {
        uid = ctx.event.reply.sender.id;
        textSegments = args.join(" ").split(" | ");
    } else {
        return ctx.sendMessage("Please mention or provide a UID.");
    }

    if (theme) {
        textSegments = textSegments.map(segment => segment.trim().replace(theme, ''));
    }

    try {
        const userInfo = await getUserInfo(uid);
        const firstName = userInfo.name.split(' ')[0];
        const avatarUrl = userInfo.avatarUrl;

        const canvasWidth = 1000;
        const canvasHeight = 800;
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        const fontUrl = 'https://drive.google.com/uc?export=download&id=1yzSCCWCY7H_f3DShqQdMoPiISwgj2n2G';

        const fontPath = await downloadFont(fontUrl);
        registerFont(fontPath, { family: 'customFont' });

        let backgroundImagePath;
        switch (theme) {
            case '-1':
                backgroundImagePath = await downloadImage('https://i.ibb.co/qF0d7dG/download-17.jpg', 'theme-1.jpg');
                break;
            case '-2':
                backgroundImagePath = await downloadImage('https://i.ibb.co/PYHkhjY/download-18.jpg', 'theme-2.jpg');
                break;
            case '-3':
                backgroundImagePath = await downloadImage('https://i.ibb.co/fnMYNxq/Bubble-tea-wallpaper-w-boba-pearls.jpg', 'theme-3.jpg');
                break;
            default:
                backgroundImagePath = null;
        }

        if (backgroundImagePath) {
            const backgroundImage = await loadImage(backgroundImagePath);
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const nameX = 165;
        const nameY = 50;
        ctx.font = '25px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.fillText(mentionName || firstName, nameX, nameY);

        const maxContainerWidth = canvas.width - 250;
        const lineHeight = 40;
        const borderRadius = 50;
        const sideGap = 20;
        const rightSideGap = 20;
        let currentX = 120;
        let currentY = 80;
        const gapBetweenContainers = 25;
        let lastContainerHeight = 0;
        let totalHeight = 10;

        const chatBubblePositions = [];

        const firstBubbleBorderRadius = {
            topLeft: 50,
            topRight: 50,
            bottomRight: 50,
            bottomLeft: 0
        };

        const middleBubbleBorderRadius = {
            topLeft: 0,
            topRight: 50,
            bottomRight: 50,
            bottomLeft: 0
        };

        const lastBubbleBorderRadius = {
            topLeft: 0,
            topRight: 50,
            bottomRight: 50,
            bottomLeft: 50
        };

        for (let i = 0; i < textSegments.length; i++) {
            const text = textSegments[i];
            const lines = splitText(ctx, text, maxContainerWidth - sideGap * 2 - 20);
            let maxLineWidth = 0;
            lines.forEach(line => {
                const lineWidth = ctx.measureText(line).width;
                maxLineWidth = Math.max(maxLineWidth, lineWidth);
            });

            let containerWidth = Math.min(maxContainerWidth, maxLineWidth + sideGap * 8);
            if (i === 0) {
                containerWidth += rightSideGap;
            }

            const textHeight = lines.length * lineHeight;
            const containerHeight = textHeight + 30;

            chatBubblePositions.push({
                x: currentX,
                y: currentY,
                height: containerHeight
            });

            let containerColor;
            switch (theme) {
                case '-1':
                    containerColor = 'rgba(128, 0, 128, 0.8)';
                    break;
                case '-2':
                    containerColor = 'rgba(80, 80, 80, 0.8)';
                    break;
                case '-3':
                    containerColor = 'rgba(76, 41, 0, 0.8)';
                    break;
                default:
                    containerColor = 'rgba(100, 100, 100, 0.8)';
            }

            let bubbleBorderRadius;
            if (textSegments.length === 1) {
                bubbleBorderRadius = {
                    topLeft: 50,
                    topRight: 50,
                    bottomRight: 50,
                    bottomLeft: 50
                };
            } else if (i === 0) {
                bubbleBorderRadius = firstBubbleBorderRadius;
            } else if (i === textSegments.length - 1) {
                bubbleBorderRadius = lastBubbleBorderRadius;
            } else {
                bubbleBorderRadius = middleBubbleBorderRadius;
            }

            ctx.fillStyle = containerColor;
            ctx.beginPath();
            ctx.moveTo(currentX + bubbleBorderRadius.topLeft + sideGap, currentY - 10);
            ctx.lineTo(currentX + containerWidth - bubbleBorderRadius.topRight - sideGap, currentY - 10);
            ctx.quadraticCurveTo(currentX + containerWidth - sideGap, currentY - 10, currentX + containerWidth - sideGap, currentY + bubbleBorderRadius.topRight - 10);
            ctx.lineTo(currentX + containerWidth - sideGap, currentY + containerHeight - bubbleBorderRadius.bottomRight + 10);
            ctx.quadraticCurveTo(currentX + containerWidth - sideGap, currentY + containerHeight + 10, currentX + containerWidth - bubbleBorderRadius.bottomRight - sideGap, currentY + containerHeight + 10);
            ctx.lineTo(currentX + bubbleBorderRadius.bottomLeft + sideGap, currentY + containerHeight + 10);
            ctx.quadraticCurveTo(currentX + sideGap, currentY + containerHeight + 10, currentX + sideGap, currentY + containerHeight - bubbleBorderRadius.bottomLeft + 10);
            ctx.lineTo(currentX + sideGap, currentY + bubbleBorderRadius.topLeft - 10);
            ctx.quadraticCurveTo(currentX + sideGap, currentY - 10, currentX + bubbleBorderRadius.topLeft + sideGap, currentY - 10);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '35px "customFont"';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            let textX = currentX + sideGap + 30;
            let textY = currentY + 15;

            lines.forEach(line => {
                ctx.fillText(line, textX, textY);
                textY += lineHeight;
            });

            currentY += containerHeight + gapBetweenContainers;
            lastContainerHeight = containerHeight;
            totalHeight += containerHeight + gapBetweenContainers;
        }

        const profilePicSize = 65;
        const profilePicX = 55;
        let profilePicY = 30;
        if (chatBubblePositions.length > 0) {
            const lastChatBubble = chatBubblePositions[chatBubblePositions.length - 1];
            profilePicY = lastChatBubble.y + lastChatBubble.height - profilePicSize;
        }

        const avatarImage = await loadImage(avatarUrl);
        ctx.beginPath();
        ctx.arc(profilePicX + profilePicSize / 2, profilePicY + profilePicSize / 2, profilePicSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImage, profilePicX, profilePicY, profilePicSize, profilePicSize);

        const outputPath = path.join(__dirname, 'fakechat-output.png');
        const out = fs.createWriteStream(outputPath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => {
            console.log('Fake chat image created successfully!');
            ctx.sendMessage({
                message: '',
                image: fs.createReadStream(outputPath)
            }, ()
