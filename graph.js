// Create an authentication provider
const authProvider = {
    getAccessToken: async () => {
        // Call getToken in auth.js
        return await getToken();
    }
};
// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });

async function getNextWeeksEvents() {
    ensureScope('Calendars.ReadWrite');
    const dateNow = new Date();
    const dateNextWeek = new Date();
    dateNextWeek.setDate(dateNextWeek.getDate() + 7);
    const query = `startDateTime=${dateNow.toISOString()}&endDateTime=${dateNextWeek.toISOString()}`;
  
    return await graphClient
    .api('/me/calendarView').query(query)
    .select('subject,start,end')
    .orderby(`start/DateTime`)
    .get();
  }

async function createEvent(name, startDate, endDate) {
    ensureScope('Calendars.ReadWrite');
    const event = {
        subject: `${name}`,
        body: {
            contentType: 'HTML',
            content: 'This is a test event'
        },
        start: {
            dateTime: `${startDate.toISOString()}`,
            timeZone: 'Pacific Standard Time'
        },
        end: {
            dateTime: `${endDate.toISOString()}`,
            timeZone: 'Pacific Standard Time'
        },

    };
    return await graphClient
    .api('/me/events')
    .post(event);
}

async function getAllEvents() {
    ensureScope('Calendars.ReadWrite');
    return await graphClient
    .api('/me/events')
	.select('id,subject,body,bodyPreview,organizer,attendees,start,end,location')
	.get();
}


async function updateEvent(id, name, startDate, endDate) {
    ensureScope('Calendars.ReadWrite');
    const event = {

        subject: `${name}`,
        body: {
            contentType: 'HTML',
            content: 'This is a test event'
        },
        start: {
            dateTime: `${startDate.toISOString()}`,
            timeZone: 'Pacific Standard Time'
        },
        end: {
            dateTime: `${endDate.toISOString()}`,
            timeZone: 'Pacific Standard Time'
        },

    };
    return await graphClient
    .api(`/me/events/${id}`)
    .patch(event);
}
