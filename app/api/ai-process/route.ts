import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/utils/supabase/server";

const instructions = `Tu es CASAHOST CHATBOT, l'assistant virtuel officiel de
l'entreprise CASAHOST (ou CASAHOT), spécialisée dans l'automatisation et la domotique
résidentielle pour simplifier le contrôle des appareils de la maison comme les lumières,
les stores et le four. Ton rôle est d'accueillir chaleureusement les utilisateurs,
de leur expliquer de manière simple, moderne et concise comment nos solutions améliorent
leur quotidien, et de répondre à leurs questions sur la maison intelligente.
Pour toute demande commerciale complexe, projet sur-mesure, partenariat ou demande de devis,
tu dois poliment orienter l'utilisateur vers notre fondatrice, Mme TOUZANI,
joignable directement au 720-547612. Reste toujours courtois, professionnel,
focalisé exclusivement sur l'univers de CASAHOST, et refuse poliment de traiter tout
sujet n'ayant aucun rapport avec la domotique.`;

const MODEL_ID = "gemini-3-flash-preview";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function isValidHistory(value: unknown): value is ChatMessage[] {
  if (!Array.isArray(value)) return false;

  return value.every(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      (entry.role === "user" || entry.role === "assistant") &&
      typeof entry.content === "string"
  );
}

async function ensureProfile(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? "",
      full_name:
        user.user_metadata?.full_name ??
        user.email?.split("@")[0] ??
        "User",
      avatar_url: user.user_metadata?.avatar_url ?? null,
    },
    {
      onConflict: "id",
    }
  );

  return user;
}

async function saveRequest(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  prompt: string,
  response: string
) {
  const { error } = await supabase.from("user_requests").insert({
    user_id: userId,
    user_prompt: prompt,
    ai_response: response,
  });

  if (error) {
    console.error("Failed to save request:", error);
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ messages: [] }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("user_requests")
      .select("user_prompt, ai_response, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    const messages = (data ?? []).flatMap((entry) => {
      const normalizedMessages: Array<{ role: "user" | "assistant"; content: string }> = [];

      if (entry.user_prompt?.trim()) {
        normalizedMessages.push({ role: "user", content: entry.user_prompt.trim() });
      }

      if (entry.ai_response?.trim()) {
        normalizedMessages.push({ role: "assistant", content: entry.ai_response.trim() });
      }

      return normalizedMessages;
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Load history error:", error);

    return NextResponse.json({ messages: [] }, {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message =
      typeof body?.message === "string" ? body.message.trim() : "";

    const history = isValidHistory(body?.history) ? body.history : [];

    if (!message) {
      return NextResponse.json(
        {
          error: "Veuillez saisir un message.",
        },
        {
          status: 400,
        }
      );
    }

    const contents = [
      ...history.map((entry: ChatMessage) => ({
        role: entry.role === "user" ? "user" : "model",
        parts: [{ text: entry.content }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents,
      config: {
        systemInstruction: instructions,
      },
    });

    const reply =
      response.text?.trim() ||
      "Je n'ai pas pu générer une réponse pour le moment.";

    const supabase = await createClient();

    const user = await ensureProfile(supabase);

    if (user) {
      await saveRequest(supabase, user.id, message, reply);
    }

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    console.error("AI process error:", error);

    return NextResponse.json(
      {
        error: "Le chatbot n'a pas pu répondre. Veuillez réessayer.",
      },
      {
        status: 500,
      }
    );
  }
}