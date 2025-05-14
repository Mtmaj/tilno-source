import { OpenAI } from "openai";

export async function descriptionGenerate(name: string) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/hyperbolic/v1",
  });

  const chatCompletion = await client.chat.completions.create({
    model: "deepseek-ai/DeepSeek-R1",
    messages: [
      {
        role: "user",
        content: `توضیحاتی برای ${name} محصول به زبان فارسی بنویس`,
      },
    ],
  });
  return chatCompletion.choices[0].message.content;
}
