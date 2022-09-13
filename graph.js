// Create an authentication provider
const authProvider = {
    getAccessToken: async () => {
        // Call getToken in auth.js
        return await getToken();
    }
};
// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });

async function getEvents() {
    ensureScope('Calendars.read');
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
