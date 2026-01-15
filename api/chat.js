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

    // Llamar a Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: 'Eres un asistente de apoyo emocional. Responde de forma empática y breve (máximo 2-3 frases) usando principios de TCC. Valida emociones y ofrece estrategias prácticas.',
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error en la API');
    }

    const botResponse = data.content[0].text;
    return res.status(200).json({ response: botResponse });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Error al procesar tu mensaje. Inténtalo de nuevo.' 
    });
  }
}
