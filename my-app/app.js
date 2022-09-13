import { Calendar } from './node_modules/@bryntum/calendar/calendar.module.js';
// import { displayEvents } from './ui.js';

const calendar = new Calendar({

    // append to the div with id="calendar"
    appendTo : document.getElementById('calendar'),

    resources : [
        {
            id         : 1,
            name       : 'Default Calendar',
            eventColor : 'green'
        }
    ],
    events : [
        {
            id         : 1,
            name       : 'Meeting',
            startDate  : '2022-09-11T10:00:00',
            endDate    : '2022-09-11T11:00:00',
            resourceId : 1
        }
    ]
});

document.querySelector('#signin').addEventListener('click', displayUI);
// document.querySelector('#btnShowEvents').addEventListener('click', displayEvents);
export { calendar };


async function displayUI() {    
    await signIn();

    // Hide login button and initial UI
    var signInButton = document.getElementById('signin');
    signInButton.style = "display: none";
    var content = document.getElementById('content');
    content.style = "display: block";

    // Display calendar after login
    var events = await getEvents();
    var calendarEvents = [];
    var eventId = 1;
    var resourceID = 1;
    events.value.forEach(event => {
      calendarEvents.push({
        id: eventId,
        name: event.subject,
        startDate: event.start.dateTime,
        endDate: event.end.dateTime,
        resourceId: resourceID,
      });
      eventId++;
      resourceID++;
    });
    calendar.events = calendarEvents;

}

export { displayUI };