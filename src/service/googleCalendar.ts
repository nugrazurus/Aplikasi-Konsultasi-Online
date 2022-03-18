import { google } from 'googleapis';

const calendar = google.calendar('v3');

interface Attendee {
  email: string;
}

interface Override {
  method: string;
  minutes: number;
}

interface Event {
  summary: string;
  location: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  conferenceData: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: 'hangoutsMeet';
      };
    };
  };
  attendees: Array<Attendee>;
  reminders: {
    useDefault: boolean;
    overrides: Array<Override>;
  };
}

export const createEvent = async (payload: Event) => {
  return calendar.events.insert(
    {
      auth: process.env.GOOGLE_API_KEY,
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: payload,
    },
    (err: Error, payload: any) => {
      if (err) {
        return {
          status: false,
          message: err,
        };
      }
      return {
        status: true,
        message: payload,
      };
    },
  );
};
