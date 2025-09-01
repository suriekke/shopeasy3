export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { phone } = req.body

  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required' })
  }

  try {
    const response = await fetch('https://verify.twilio.com/v2/Services/VA9d1943068467ac43f1a63cd7c8adf1b8/Verifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(process.env.TWILIO_ACCOUNT_SID + ':' + process.env.TWILIO_AUTH_TOKEN).toString('base64')
      },
      body: new URLSearchParams({
        'To': phone,
        'Channel': 'sms'
      })
    })

    const data = await response.json()

    if (data.status === 'pending') {
      return res.status(200).json({ success: true, message: 'OTP sent successfully' })
    } else {
      return res.status(400).json({ success: false, message: 'Failed to send OTP' })
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
