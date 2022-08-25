const EmailTemplate = require('../../models/emailTemplate.model')

//send email to mentioned users
exports.sendEmail = async (email = '', type = '', content = null, subject = '') => {
  if (email !== '') {

    const getTemplate = await EmailTemplate.findOne({ type })
    if (getTemplate) {

      var mailgun = require('mailgun-js')(
        {
          apiKey: '9a382e248ee192eccc3fa718d7664bd0-c250c684-a07ab583',
          domain: 'sandbox0c1f40cfbd3b4c3a843c67f1b1dc591c.mailgun.org'
        }
      );
      let sub = ''

      if (subject) {
        sub = subject
      }
      else {
        sub = getTemplate.subject
      }

      let messageData = getHtml(getTemplate, content);
      const msg = {
        to: email,
        from: 'PRPL User <me@samples.mailgun.org>',
        subject: sub,
        html: messageData
      };

      try {
        mailgun.messages().send(msg, function (err) {
          if (err) {
            console.log(err)
          }
          else {
            console.log("Mail sent successfully!")
          }
        });
      } catch (error) {
        console.log(errors);
      }
    }
  }
}

function getHtml(getTemplate, content) {
  let text = getTemplate.text
  if (content) {
    for (let key in content) {
      text = text.replace(`${key}`, "'" + `${content[key]}` + "'")
    }
  }
  return text
}







