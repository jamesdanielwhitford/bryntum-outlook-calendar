import { Calendar } from './node_modules/@bryntum/calendar/calendar.module.js';

const calendar = new Calendar({

    // append to the div with id="calendar"
    appendTo : document.getElementById('calendar'),

    listeners : {
        dataChange: function(event) {
            createUpdateMicrosoft(event);
        }
         },
    resources : [
        {
            id         : 1,
            name       : 'Default Calendar',
            eventColor : 'green'
        }
    ],
});

async function createUpdateMicrosoft(event) {

    if(event.action == "update") {
        const microEvents = await getAllEvents();
        var newEvent = calendar.events[calendar.events.length - 1];

        if (microEvents.value[0].subject == "New event"){
            updateEvent(microEvents.value[0].id, newEvent.name, newEvent.startDate, newEvent.endDate);
        } else {
            createEvent(newEvent.name, newEvent.startDate, newEvent.endDate);
        }
    }   
}

async function displayUI() {    
    await signIn();

    // Hide login button and initial UI
    var signInButton = document.getElementById('signin');
    signInButton.style = "display: none";
    var content = document.getElementById('content');
    content.style = "display: block";

    // Display calendar after login
    var events = await getNextWeeksEvents();
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

document.querySelector('#signin').addEventListener('click', displayUI);

export { calendar }
export { displayUI };