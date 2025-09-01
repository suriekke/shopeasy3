export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { phone, otp } = req.body

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone number and OTP are required' })
  }

  try {
    const response = await fetch(`https://verify.twilio.com/v2/Services/VA9d1943068467ac43f1a63cd7c8adf1b8/VerificationCheck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(process.env.TWILIO_ACCOUNT_SID + ':' + process.env.TWILIO_AUTH_TOKEN).toString('base64')
      },
      body: new URLSearchParams({
        'To': phone,
        'Code': otp
      })
    })

    const data = await response.json()

    if (data.status === 'approved') {
      return res.status(200).json({ 
        success: true, 
        message: 'OTP verified successfully',
        data: {
          session: {
            access_token: 'twilio_session',
            user: {
              phone: phone
            }
          }
        }
      })
    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP' })
    }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
