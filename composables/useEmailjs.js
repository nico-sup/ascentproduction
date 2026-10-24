// Envoi d'e-mails via EmailJS (formulaire de contact et réservation des packs).
// Clé publique : elle est faite pour être visible dans le navigateur.
// Pense à limiter les domaines autorisés dans le tableau de bord EmailJS.
export const EMAILJS = {
  publicKey: 'zuE8HajcfqCIStJEm',
  serviceId: 'service_b1ofmh9',
  templateId: 'template_rfpd68p',
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Envoie un message avec le modèle EmailJS existant.
 * Champs du modèle : object, email_id, from_name, from_firstName, from_telephone, message, rgpd
 */
export async function sendEmail(params) {
  const { default: emailjs } = await import('@emailjs/browser')
  return emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, params, { publicKey: EMAILJS.publicKey })
}
