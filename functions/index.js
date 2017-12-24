const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const twilio = require('twilio');
const accountSid = functions.config().twilio.sid
const authToken  = functions.config().twilio.token
const client = new twilio(accountSid, authToken);
const twilioNumber = '+16043301544'   // your twilio phone number


/// start cloud function
/*exports.textStatus = functions.database
       .ref('/appointments/{key}/phone')
       .onUpdate(event => {
           const orderKey = event.params.key
           return admin.database()
                       .ref(`/appointments/${orderKey}`)
                       .once('value')
                       .then(snapshot => snapshot.val())
                       .then(appointment => {
                           const name = appointment.name
                           const phoneNumber = appointment.phone
                           if (!validE164(phoneNumber)) {
                               throw new Error('number must be E164 format!')
                           }
                           const textMessage = {
                               body: `Hello kiddan: ${name}`,
                               to: phoneNumber,  // Text to this number
                               from: twilioNumber // From a valid Twilio number
                           }
                           return client.messages.create(textMessage)
                       })
                       .then(message => console.log(message.sid, 'success'))
                       .catch(err => console.log(err))
       });
*/



//Test Functions
exports.helloworld = functions.database
    .ref('/appointments/{key}')
    .onWrite(event => {
        const post = event.data.val()
        if (post.sanitized){
            return
        }
        console.log("Kiddann"+ post.name )
        post.sanitized = true
    })


exports.textStatus = functions.database
       .ref('/appointments/{key}/end')
       .onUpdate(event => {
           const orderKey = event.params.key
           return admin.database()
                       .ref(`/appointments/${orderKey}`)
                       .once('value')
                       .then(snapshot => snapshot.val())
                       .then(appointment => {
                           const name = appointment.name
                           const phoneNumber = appointment.phone
                           if (!validE164(phoneNumber)) {
                               throw new Error('number must be E164 format!')
                           }
                           const textMessage = {
                               body: `Hello kiddan: ${name}`,
                               to: phoneNumber,  // Text to this number
                               from: twilioNumber // From a valid Twilio number
                           }
                           //return client.messages.create(textMessage)
                           console.log('Sending messge to' + name+ 'on phone number' + phoneNumber)
                       })
                       .then(message => console.log(message.sid, 'success'))
                       .catch(err => console.log(err))
       });

/// Validate E164 format
function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}