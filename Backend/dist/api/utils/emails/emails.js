var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const EmailTemplate = require('../../models/emailTemplate.model');
//send email to mentioned users
exports.sendEmail = (email = '', type = '', content = null, subject = '') => __awaiter(this, void 0, void 0, function* () {
    if (email !== '') {
        const getTemplate = yield EmailTemplate.findOne({ type });
        if (getTemplate) {
            var mailgun = require('mailgun-js')({
                apiKey: '9a382e248ee192eccc3fa718d7664bd0-c250c684-a07ab583',
                domain: 'sandbox0c1f40cfbd3b4c3a843c67f1b1dc591c.mailgun.org'
            });
            let sub = '';
            if (subject) {
                sub = subject;
            }
            else {
                sub = getTemplate.subject;
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
                        console.log(err);
                    }
                    else {
                        console.log("Mail sent successfully!");
                    }
                });
            }
            catch (error) {
                console.log(errors);
            }
        }
    }
});
function getHtml(getTemplate, content) {
    let text = getTemplate.text;
    if (content) {
        for (let key in content) {
            text = text.replace(`${key}`, "'" + `${content[key]}` + "'");
        }
    }
    return text;
}
