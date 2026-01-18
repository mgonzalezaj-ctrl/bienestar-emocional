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

    // Llamar a OpenAI API
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente de apoyo emocional experto. Responde de forma empática, breve (máximo 2-3 frases cortas) y práctica. Usa principios de TCC (Terapia Cognitivo-Conductual). Valida emociones sin juzgar.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error en la API de OpenAI');
    }

    const botResponse = data.choices[0].message.content;

    return res.status(200).json({ respuesta: botResponse });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Lo siento, hubo un problema al procesar tu mensaje. Inténtalo de nuevo.'
    });
  }
}
