import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for a CRM system. Keep responses concise and professional."
        },
        ...messages
      ],
      temperature: 0.7,
    })

    return NextResponse.json({
      message: response.choices[0]?.message?.content || "No response from AI"
    })
  } catch (error) {
    console.error("AI Assistant error:", error)
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 }
    )
  }
}
