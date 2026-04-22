const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors()); // 🌟 Narrow Oneからの通信を許可
app.use(express.json());

const WEBHOOK_URL = "https://discord.com/api/webhooks/1495289995127296212/T5aErtbBuqnYLqyrfuYsUALjmBIO2Ku3meS7Avyt2LPU8YwcJQQU9hHIEZQo8BFvBmBg";

app.post('/sos', async (req, res) => {
    const squadCode = req.body.code || "UNKNOWN";
    console.log(`[System] SOS信号受信: ${squadCode}`);

    const payload = {
        "content": `<@&1495252086034796655> **【緊急出動】** Render経由でSOSを受信したぜ！\nコード: \`${squadCode}\``
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("[System] Discordへの転送成功");
            res.status(200).send("Success");
        } else {
            console.error(`[Error] Discordが拒絶: ${response.status}`);
            res.status(response.status).send("Discord Error");
        }
    } catch (err) {
        console.error("[Error] 通信失敗:", err);
        res.status(500).send("Internal Server Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SOS Proxy Server running on port ${PORT}`));
