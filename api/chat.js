export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    // Llamar a Gemini API (mucho más rápido que Claude)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Eres un asistente de apoyo emocional experto. Responde de forma empática, breve (máximo 2-3 frases cortas) y práctica. Usa principios de TCC (Terapia Cognitivo-Conductual). Valida emociones y ofrece una estrategia concreta.\n\nUsuario: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
            topP: 0.8,
            topK: 40
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error en la API de Gemini');
    }

    const botResponse = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ respuesta: botResponse });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Lo siento, hubo un problema al procesar tu mensaje. Inténtalo de nuevo.' 
    });
  }
}
