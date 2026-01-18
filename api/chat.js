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

    // Sistema de respuestas basado en palabras clave (100% GRATUITO)
    const messageLower = message.toLowerCase();
    let respuesta = '';

    // Detectar emociones/palabras clave
    if (messageLower.match(/ansi(oso|edad|a)|nervios(o|a)|preocup(ado|ada|ación)/)) {
      respuesta = 'La ansiedad es una respuesta natural del cuerpo. Prueba respirar profundamente 4 segundos, mantén 4, exhala 4. ¿Qué situación específica te preocupa?';
    } else if (messageLower.match(/trist(e|eza)|deprim(ido|ida)|sol(o|a|edad)/)) {
      respuesta = 'Es válido sentirte así. Tus emociones son importantes. Intenta salir a caminar 10 minutos o hablar con alguien de confianza. No estás solo/a.';
    } else if (messageLower.match(/estrés|estresad(o|a)|abrumad(o|a)|agobiad(o|a)/)) {
      respuesta = 'El estrés se puede manejar paso a paso. Haz una lista de tareas, prioriza las 3 más importantes y toma descansos de 5 minutos cada hora. Tú puedes con esto.';
    } else if (messageLower.match(/enojad(o|a)|enojo|enfadad(o|a)|rabia|ira/)) {
      respuesta = 'Es normal sentir enfado. Antes de reaccionar, cuenta hasta 10 y respira. ¿Qué necesidad tuya no se está cubriendo en esta situación?';
    } else if (messageLower.match(/feliz|alegr(e|ia)|bien|content(o|a)/)) {
      respuesta = '¡Qué bueno que te sientas así! Disfruta este momento y celebra tus logros, por pequeños que sean. Te lo mereces.';
    } else if (messageLower.match(/miedo|asustad(o|a)|temor/)) {
      respuesta = 'El miedo te está protegiendo de algo. Preguntándote: ¿Es real el peligro ahora? ¿Qué es lo peor que podría pasar? ¿Cómo lo manejarías?';
    } else if (messageLower.match(/dormir|insomnio|sueño/)) {
      respuesta = 'El sueño es fundamental. Evita pantallas 1 hora antes de dormir, mantén horarios regulares y prueba meditación guiada para relajarte.';
    } else if (messageLower.match(/cansad(o|a)|fatiga|agotad(o|a)/)) {
      respuesta = 'El cansancio mental es real. Toma un descanso sin culpa, hidrátate bien y considera hacer una actividad que disfrutes, aunque sea 10 minutos.';
    } else if (messageLower.match(/gracias|ayud(a|ado)|bien|mejor/)) {
      respuesta = '¡Me alegra poder ayudarte! Recuerda que cuidar tu salud mental es tan importante como la física. ¿Hay algo más en lo que pueda apoyarte?';
    } else if (messageLower.match(/hola|buenos|saludos/)) {
      respuesta = '¡Hola! Estoy aquí para escucharte. ¿Cómo te sientes hoy? Puedes compartir lo que necesites, sin juicios.';
    } else {
      respuesta = 'Entiendo que estés pasando por esto. Validar tus emociones es el primer paso. ¿Podrías contarme más sobre cómo te sientes?';
    }

    return res.status(200).json({ respuesta });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Lo siento, hubo un problema al procesar tu mensaje. Inténtalo de nuevo.'
    });
  }
}
