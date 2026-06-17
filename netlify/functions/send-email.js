exports.handler = async (event) => {
    const { to, subject, message } = JSON.parse(event.body)
  
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_FiA9GNiN_GnwibWUia4z9XbrkevsLCPq5',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'ClientFlow <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: message
      })
    })
  
    const data = await response.json()
  
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  }