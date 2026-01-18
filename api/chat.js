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

    // Llamar a Hugging Face Inference API (GRATIS)
    const response = await fetch(
      'https://router.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        },
        body: JSON.stringify({
          inputs: `Eres un asistente de apoyo emocional experto. Responde de forma empática, breve (máximo 2-3 frases cortas) y práctica. Usa principios de TCC (Terapia Cognitivo-Conductual). Valida emociones sin juzgar.\n\nUsuario: ${message}\n\nAsistente:`,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            return_full_text: false
          }
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error en la API de Hugging Face');
    }

    // Extraer la respuesta del modelo
    let botResponse = '';
    if (Array.isArray(data) && data[0]?.generated_text) {
      botResponse = data[0].generated_text.trim();
    } else if (data.generated_text) {
      botResponse = data.generated_text.trim();
    } else {
      throw new Error('Formato de respuesta inesperado');
    }

    return res.status(200).json({ respuesta: botResponse });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Lo siento, hubo un problema al procesar tu mensaje. Inténtalo de nuevo.'
    });
  }
}
