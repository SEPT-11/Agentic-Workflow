import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export class OpenAIService {
  
  async summarizeContent(data: any[]): Promise<string> {
    try {
      if (!data || data.length === 0) {
        throw new Error("No data provided for summarization");
      }

      // Convert data to text format
      const textContent = data.map(row => {
        return Object.entries(row)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      }).join('\n');

      const prompt = `Please summarize the following content from a Google Sheet. Focus on key themes, topics, and important information that would be useful for creating social media posts:

${textContent}

Provide a concise summary that captures the main points and themes.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      });

      return response.choices[0].message.content || "Unable to generate summary";
    } catch (error) {
      console.error("Error summarizing content:", error);
      throw new Error("Failed to summarize content");
    }
  }

  async generatePost(summary: string, platform: string): Promise<{
    title: string;
    content: string;
    hashtags: string;
  }> {
    try {
      const platformSpecs = this.getPlatformSpecs(platform);
      
      const prompt = `Based on the following content summary, create an engaging social media post for ${platform}:

Summary: ${summary}

Requirements for ${platform}:
- Character limit: ${platformSpecs.charLimit}
- Style: ${platformSpecs.style}
- Hashtag count: ${platformSpecs.hashtagCount}

Please respond with JSON in this exact format:
{
  "title": "Brief engaging title (max 60 characters)",
  "content": "The main post content",
  "hashtags": "Relevant hashtags separated by spaces"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a social media expert who creates engaging, platform-specific content. Always respond with valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        title: result.title || "Generated Post",
        content: result.content || "Content generation failed",
        hashtags: result.hashtags || "",
      };
    } catch (error) {
      console.error(`Error generating ${platform} post:`, error);
      throw new Error(`Failed to generate ${platform} post`);
    }
  }

  private getPlatformSpecs(platform: string) {
    const specs: Record<string, any> = {
      linkedin: {
        charLimit: 3000,
        style: "Professional, thought-leadership focused, industry insights",
        hashtagCount: "3-5 relevant professional hashtags",
      },
      twitter: {
        charLimit: 280,
        style: "Concise, engaging, conversation-starter with emojis",
        hashtagCount: "2-3 trending hashtags",
      },
      instagram: {
        charLimit: 2200,
        style: "Visual-first, storytelling, inspiring with emojis",
        hashtagCount: "8-15 hashtags including niche and broad ones",
      },
    };

    return specs[platform] || specs.linkedin;
  }
}
