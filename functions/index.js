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

/* 
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
*/

//send sms on update start time
exports.textStatus = functions.database
       .ref('/appointments/{key}/start')
       .onUpdate(event => {
           const orderKey = event.params.key
           return admin.database()
                       .ref(`/appointments/${orderKey}`)
                       .once('value')
                       .then(snapshot => snapshot.val())
                       .then(appointment => {
                           const name = appointment.name
                           const start = DisplayCurrentTime(appointment.start)
                           const phoneNumber = appointment.phone
                           if (!validE164(phoneNumber)) {
                               throw new Error('number must be E164 format!')
                           }
                           const textMessage = {
                               //body: `Hello ${name}, you have an Appointment on ${start} - Saddhers`,
                               body: `You have booked an appointment on ${start} - Ritual Spa. If you need to reschedule please call (604) 381-3860`,
                               //to: +17787792744,
                               to: phoneNumber,  // Text to this number
                               from: twilioNumber // From a valid Twilio number
                           }
                           console.log('Sending messge to' + name + 'on phone number' + phoneNumber + 'on ' + start )
                            return client.messages.create(textMessage).then(message => console.log(message.sid, 'success'))
                                                                     .catch(err => console.log(err))
                          
                       })
                       
       });

const ref = admin.database().ref()
//send sms daily at 6PM
/*exports.dailySMSReminder = functions.https.onRequest((req, res) => {
    const currentTime = new Date().getTime()
    const names = []

    ref.child('appointments').orderByChild('start').startAt(currentTime).once('value')
    .then(snap => {
        snap.forEach(childSnap => {
            const name = childSnap.val().name
            names.push(name)
        })
        return names
    }).then(names => {
        console.log('Appointments for tomorrow: ' + names.join())
        return names.join().then(() => {
            res.send('SMS Sent')
        }).catch(error => {
            res.send(error)
        })
    })
})

*/

exports.dailySMSReminder = functions.https.onRequest((req, res) => {
    var currentDate = new Date()
    // change time in PST
    currentDate.setHours(currentDate.getHours() - 8)

    //Add number of hours to the point when client wants to send reminders
    // Example if at 6PM then and 6 or more hours to current date to make it next day
    currentDate.setHours(currentDate.getHours() + 13)
    const getDate = currentDate.toDateString();

    const names = []

    ref.child('appointments').once('value')
    .then(snap => {
        snap.forEach(childSnap => {
            const name = childSnap.val().name
            const start1 = childSnap.val().start
            var date = new Date(start1)
            date.setHours(date.getHours() - 8)
            const getStartDate = date.toDateString()

            const start = DisplayCurrentTime(childSnap.val().start)
            const phoneNumber1 = childSnap.val().phone

            if (getStartDate == getDate) {
                names.push(name)
                if (!validE164(phoneNumber1)) {
                    throw new Error('number must be E164 format!')
                }

                const textMessage = {
                    //body: `Hello ${name}, you have an Appointment tomorrow on ${start} - Ritual Spa, If you need to reschedule please call (604) 381-3860`,
                    body: `You have an Appointment booked on ${start} - Ritual Spa. If you need to reschedule please call (604) 381-3860`,
                    //to: +17787792744,
                    to: phoneNumber1,  // Text to this number
                    from: twilioNumber // From a valid Twilio number
                }
                console.log('Sending messge to' + name + 'on phone number' + phoneNumber1 + 'on ' + start)
                 client.messages.create(textMessage).then(message => console.log(message.sid, 'success'))
                                                          .catch(err => console.log(err))
                
            }
        })
    }).then(() => {
            res.send('SMS Sent')
            })
            .catch(error => {
                res.send(error)
            })

});




/// Validate E164 format
function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}

//return date and time
function DisplayCurrentTime(date1) {
    var date = new Date(date1);
    date.setHours(date.getHours() - 8);
    var getDate = date.toDateString();
    var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? "PM" : "AM";
    hours = hours < 10 ? "0" + hours : hours;
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    time = getDate + " at " + hours + ":" + minutes + " " + am_pm;
    //time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
    return time;
}

