import { Router, type IRouter } from "express";

const router: IRouter = Router();

const languageNames: Record<string, string> = {
  hi: "Hindi",
  en: "English",
  mr: "Marathi",
  bn: "Bengali",
  te: "Telugu",
  ta: "Tamil",
};

router.post("/ai/ask", async (req, res) => {
  const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
  const language = typeof req.body?.language === "string" ? req.body.language : "en";

  if (!question) {
    res.status(400).json({ error: "Please enter a question." });
    return;
  }

  if (question.length > 1200) {
    res.status(400).json({ error: "Please keep your question under 1,200 characters." });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "AI answers are not configured yet." });
    return;
  }

  const requestedLanguage = languageNames[language] ?? "English";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content: [
              "You are the Swasthya Setu public health service assistant for residents of India.",
              `Reply in ${requestedLanguage}.`,
              "Give clear, calm, practical information about health, symptoms, prevention, public health services, hospitals, doctors, and government health resources.",
              "Do not diagnose, prescribe, or replace a clinician. For urgent or life-threatening symptoms, tell the user to call India's emergency number 112 or go to the nearest emergency department.",
              "Use short paragraphs and simple language. If the question is not health or public-service related, say you can help with health and public-service questions.",
            ].join(" "),
          },
          { role: "user", content: question },
        ],
      }),
    });

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };

    if (!response.ok) {
      req.log.error({ status: response.status, message: data.error?.message }, "OpenAI request failed");
      res.status(502).json({ error: "The AI assistant is temporarily unavailable. Please try again." });
      return;
    }

    const answer = data.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      res.status(502).json({ error: "The AI assistant did not return an answer. Please try again." });
      return;
    }

    res.json({ answer });
  } catch (error) {
    req.log.error({ err: error }, "AI assistant request failed");
    res.status(502).json({ error: "The AI assistant is temporarily unavailable. Please try again." });
  }
});

export default router;