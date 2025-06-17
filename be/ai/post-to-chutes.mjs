import * as https from 'https';

export const postToChutes = (apiToken, wrapper) => {
    const postData = JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3-0324",
        messages: [
            {
                role: "user",
                content: wrapper
            }
        ],
        stream: true,
        max_tokens: 1024,
        temperature: 0.0
    });

    const options = {
        hostname: 'llm.chutes.ai',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            res.setEncoding('utf8');

            let responseTxt = '';
            let buffer = '';
            res.on('data', (chunk) => {
                buffer += chunk;

                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep the incomplete line in buffer

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonStr = line.slice(6).trim();
                        if (jsonStr === '[DONE]') continue;

                        try {
                            const json = JSON.parse(jsonStr);
                            const content = json?.choices?.[0]?.delta?.content;
                            if (content) {
                                responseTxt += content;
                                // process.stdout.write(content);
                            }
                        } catch (err) {
                            console.error('Error parsing JSON:', err);
                        }
                    }
                }
            });


            res.on('end', () => {
                //console.log('\n\nStream ended.');
                resolve(responseTxt);
            });
        });

        req.on('error', (err) => {
            console.error('Request error:', err);
            reject(err);
        });

        req.write(postData);
        req.end();
    });
};