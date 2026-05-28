const ROLE_LABELS: Record<string, string> = {
  medecin: 'Médecin',
  infirmier: 'Infirmier(e)',
  admin_hopital: 'Administrateur d\'hôpital',
}

export async function sendWelcomeMembreEmail({
  to,
  name,
  email,
  motDePasse,
  role,
  hopitalNom,
  siteUrl,
}: {
  to: string
  name: string
  email: string
  motDePasse: string
  role: string
  hopitalNom: string
  siteUrl: string
}): Promise<void> {
  const apiKey = process.env.MAILZEET_API_KEY
  if (!apiKey) return

  const roleLabel = ROLE_LABELS[role] ?? role

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;padding:0 16px;">

    <!-- Header -->
    <div style="background:#dc2626;border-radius:16px 16px 0 0;padding:32px;text-align:center;">
      <div style="width:52px;height:52px;background:rgba(255,255,255,0.15);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
        <span style="font-size:26px;">🩸</span>
      </div>
      <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;">eBloodSys</h1>
      <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:14px;">Système de gestion du sang</p>
    </div>

    <!-- Body -->
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;padding:36px;">

      <h2 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#111827;">Bienvenue dans l'équipe, ${name} !</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
        Votre compte a été créé sur la plateforme <strong>eBloodSys</strong> pour l'établissement
        <strong style="color:#111827;">${hopitalNom}</strong>. Voici vos informations de connexion.
      </p>

      <!-- Credentials box -->
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:24px;margin-bottom:28px;">
        <p style="margin:0 0 16px;font-size:12px;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:1px;">Vos informations de connexion</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:14px;width:140px;">Établissement</td>
            <td style="padding:8px 0;font-weight:600;color:#111827;font-size:14px;">${hopitalNom}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:14px;border-top:1px solid #fecaca;">Rôle</td>
            <td style="padding:8px 0;font-weight:600;color:#111827;font-size:14px;border-top:1px solid #fecaca;">
              <span style="background:#fee2e2;color:#dc2626;padding:3px 10px;border-radius:20px;font-size:13px;">${roleLabel}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:14px;border-top:1px solid #fecaca;">Email</td>
            <td style="padding:8px 0;font-weight:600;color:#111827;font-size:14px;border-top:1px solid #fecaca;">${email}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:14px;border-top:1px solid #fecaca;">Mot de passe</td>
            <td style="padding:8px 0;border-top:1px solid #fecaca;">
              <span style="background:#111827;color:#f9fafb;font-family:monospace;font-size:15px;font-weight:700;padding:6px 14px;border-radius:8px;letter-spacing:1px;">${motDePasse}</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:28px;">
        <a href="${siteUrl}/auth/signin"
           style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;padding:15px 40px;border-radius:12px;font-weight:700;font-size:15px;letter-spacing:0.3px;">
          Se connecter à eBloodSys
        </a>
        <p style="margin:12px 0 0;color:#9ca3af;font-size:13px;">${siteUrl}/auth/signin</p>
      </div>

      <!-- Security note -->
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 18px;">
        <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">
          ⚠️ <strong>Sécurité :</strong> Changez votre mot de passe dès votre première connexion. Ne partagez jamais vos identifiants.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <p style="text-align:center;color:#9ca3af;font-size:12px;margin:20px 0;">
      Cet email a été envoyé automatiquement par eBloodSys · Ne pas répondre
    </p>
  </div>
</body>
</html>`

  await fetch('https://api.mailzeet.com/v1/mails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      recipients: [{ email: to, name }],
      subject: `Bienvenue sur eBloodSys — ${hopitalNom}`,
      html,
    }),
  })
}
