import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!

serve(async (req) => {
  const { email, inviteLink, teamName, inviterName } = await req.json()

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Copper Reels <noreply@copperreels.com>',
      to: [email],
      subject: `You're invited to join ${teamName} on Copper Reels`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You're invited to join ${teamName}!</h2>
          <p>${inviterName} has invited you to collaborate on Copper Reels.</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 6px;">
            Accept Invitation
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    }),
  })

  const data = await res.json()
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
})