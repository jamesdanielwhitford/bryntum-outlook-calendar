import { Calendar } from './node_modules/@bryntum/calendar/calendar.module.js';

const calendar = new Calendar({

    // append to the div with id="calendar"
    appendTo : document.getElementById('calendar'),

    listeners : {
        dataChange: function(event) {
            updateMicrosoft(event);
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

async function updateMicrosoft(event) {
    if(event.action == "update") {
        const microEvents = await getAllEvents();
        // check if event exists in microsoft, if it does, update it, if not, create it
        var eventExists = false;

        microEvents.value.forEach(microEvent => {
            // event exists in both microsoft and bryntum with the same name
            if(microEvent.subject == event.record.name) {
                eventExists = true;
                updateEvent(microEvent.id, event.record.name, event.record.startDate, event.record.endDate);
            } 
            // The event exists but the name was updated
            else if('duration' in event.changes || 'name' in event.changes) {
                if ('name' in event.changes) {
                    if (event.changes.name.oldValue != "New event"){
                        eventExists = true;
                        updateEvent(microEvent.id, event.record.name, event.record.startDate, event.record.endDate);
                    }
            }
        }
        });
        // event does not exist in microsoft, create it
        if(!eventExists) {
            if (event.record.name != undefined) {
                createEvent(event.record.name, event.record.startDate, event.record.endDate);
            } 
        }

    }
    // event is deleted
    else if (event.action == "remove") {
        const microEvents = await getAllEvents();
        var eventName = event.records[0].data.name;
        microEvents.value.forEach(event => {
            if (event.subject == eventName) {
                deleteEvent(event.id);
            }
        });

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