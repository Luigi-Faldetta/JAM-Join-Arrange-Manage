import eventsReducer, {
  setEventList,
  addEvent,
  updateEvent,
  deleteEvent,
  EventState,
} from '../events';

const mockEvent: EventState = {
  eventId: '1',
  title: 'Test Event',
  description: 'Test Description',
  date: new Date('2025-08-15T18:00:00'),
  location: 'Test Location',
  coverPic: 'https://example.com/image.jpg',
  hostId: 'user1',
  UserEvents: [
    { userId: 'user1', isHost: true, isGoing: true },
  ],
};

const mockEventList: EventState[] = [
  mockEvent,
  {
    eventId: '2',
    title: 'Test Event 2',
    description: 'Test Description 2',
    date: new Date('2025-08-20T19:00:00'),
    location: 'Test Location 2',
    coverPic: null,
    hostId: 'user2',
    UserEvents: [
      { userId: 'user2', isHost: true, isGoing: true },
    ],
  },
];

describe('Events Slice', () => {
  describe('reducers', () => {
    it('should handle initial state', () => {
      expect(eventsReducer(undefined, { type: 'unknown' })).toEqual([]);
    });

    it('should handle setEventList', () => {
      const actual = eventsReducer([], setEventList(mockEventList));
      expect(actual).toEqual(mockEventList);
    });

    it('should handle setEventList with empty array', () => {
      const initialState = mockEventList;
      const actual = eventsReducer(initialState, setEventList([]));
      expect(actual).toEqual([]);
    });

    it('should handle addEvent', () => {
      const newEvent: EventState = {
        eventId: '3',
        title: 'New Event',
        description: 'New Description',
        date: new Date('2025-08-25T20:00:00'),
        location: 'New Location',
        coverPic: null,
        hostId: 'user3',
        UserEvents: [],
      };

      const actual = eventsReducer(mockEventList, addEvent(newEvent));
      expect(actual).toHaveLength(3);
      expect(actual[2]).toEqual(newEvent);
    });

    it('should handle addEvent to empty state', () => {
      const actual = eventsReducer([], addEvent(mockEvent));
      expect(actual).toHaveLength(1);
      expect(actual[0]).toEqual(mockEvent);
    });

    it('should handle updateEvent', () => {
      const updatedEvent: EventState = {
        ...mockEvent,
        title: 'Updated Event Title',
        description: 'Updated Description',
      };

      const actual = eventsReducer(mockEventList, updateEvent(updatedEvent));
      expect(actual[0].title).toBe('Updated Event Title');
      expect(actual[0].description).toBe('Updated Description');
      expect(actual[0].eventId).toBe('1');
    });

    it('should handle updateEvent when event does not exist', () => {
      const nonExistentEvent: EventState = {
        eventId: '999',
        title: 'Non-existent Event',
        description: 'This event does not exist',
        date: new Date(),
        location: 'Nowhere',
        coverPic: null,
        hostId: 'user999',
        UserEvents: [],
      };

      const actual = eventsReducer(mockEventList, updateEvent(nonExistentEvent));
      expect(actual).toEqual(mockEventList); // Should remain unchanged
    });

    it('should handle updateEvent with partial data', () => {
      const partialUpdate: EventState = {
        eventId: '1',
        title: 'Partially Updated Event',
        // Only updating title, other fields should remain the same
        description: mockEvent.description,
        date: mockEvent.date,
        location: mockEvent.location,
        coverPic: mockEvent.coverPic,
        hostId: mockEvent.hostId,
        UserEvents: mockEvent.UserEvents,
      };

      const actual = eventsReducer(mockEventList, updateEvent(partialUpdate));
      expect(actual[0].title).toBe('Partially Updated Event');
      expect(actual[0].description).toBe(mockEvent.description);
      expect(actual[0].location).toBe(mockEvent.location);
    });

    it('should handle deleteEvent', () => {
      const actual = eventsReducer(mockEventList, deleteEvent('1'));
      expect(actual).toHaveLength(1);
      expect(actual[0].eventId).toBe('2');
    });

    it('should handle deleteEvent when event does not exist', () => {
      const actual = eventsReducer(mockEventList, deleteEvent('999'));
      expect(actual).toEqual(mockEventList); // Should remain unchanged
    });

    it('should handle deleteEvent on empty state', () => {
      const actual = eventsReducer([], deleteEvent('1'));
      expect(actual).toEqual([]);
    });
  });

  describe('action creators', () => {
    it('should create setEventList action', () => {
      const actual = setEventList(mockEventList);
      expect(actual.type).toBe('events/setEventList');
      expect(actual.payload).toEqual(mockEventList);
    });

    it('should create addEvent action', () => {
      const actual = addEvent(mockEvent);
      expect(actual.type).toBe('events/addEvent');
      expect(actual.payload).toEqual(mockEvent);
    });

    it('should create updateEvent action', () => {
      const updatedEvent = { ...mockEvent, title: 'Updated Title' };
      const actual = updateEvent(updatedEvent);
      expect(actual.type).toBe('events/updateEvent');
      expect(actual.payload).toEqual(updatedEvent);
    });

    it('should create deleteEvent action', () => {
      const actual = deleteEvent('1');
      expect(actual.type).toBe('events/deleteEvent');
      expect(actual.payload).toBe('1');
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple operations in sequence', () => {
      let state: EventState[] = [];

      // Add events
      state = eventsReducer(state, setEventList(mockEventList));
      expect(state).toHaveLength(2);

      // Add another event
      const newEvent: EventState = {
        eventId: '3',
        title: 'Third Event',
        description: 'Third Description',
        date: new Date('2025-08-30T21:00:00'),
        location: 'Third Location',
        coverPic: null,
        hostId: 'user3',
        UserEvents: [],
      };
      state = eventsReducer(state, addEvent(newEvent));
      expect(state).toHaveLength(3);

      // Update an event
      const updatedEvent = { ...mockEvent, title: 'Updated First Event' };
      state = eventsReducer(state, updateEvent(updatedEvent));
      expect(state[0].title).toBe('Updated First Event');

      // Delete an event
      state = eventsReducer(state, deleteEvent('2'));
      expect(state).toHaveLength(2);
      expect(state.find(event => event.eventId === '2')).toBeUndefined();
    });

    it('should handle UserEvents updates correctly', () => {
      const eventWithUpdatedUserEvents: EventState = {
        ...mockEvent,
        UserEvents: [
          { userId: 'user1', isHost: true, isGoing: true },
          { userId: 'user2', isHost: false, isGoing: true },
          { userId: 'user3', isHost: false, isGoing: false },
        ],
      };

      const actual = eventsReducer(mockEventList, updateEvent(eventWithUpdatedUserEvents));
      expect(actual[0].UserEvents).toHaveLength(3);
      expect(actual[0].UserEvents![2].userId).toBe('user3');
      expect(actual[0].UserEvents![2].isGoing).toBe(false);
    });

    it('should preserve other events when updating one', () => {
      const updatedEvent: EventState = {
        ...mockEvent,
        title: 'Updated Title',
      };

      const actual = eventsReducer(mockEventList, updateEvent(updatedEvent));
      
      // First event should be updated
      expect(actual[0].title).toBe('Updated Title');
      
      // Second event should remain unchanged
      expect(actual[1]).toEqual(mockEventList[1]);
    });

    it('should handle events with null/undefined optional fields', () => {
      const eventWithNullFields: EventState = {
        eventId: '4',
        title: 'Event with Nulls',
        description: undefined,
        date: new Date('2025-09-01T18:00:00'),
        location: null,
        coverPic: undefined,
        hostId: 'user1',
        UserEvents: undefined,
      };

      const actual = eventsReducer([], addEvent(eventWithNullFields));
      expect(actual[0].description).toBeUndefined();
      expect(actual[0].location).toBeNull();
      expect(actual[0].coverPic).toBeUndefined();
      expect(actual[0].UserEvents).toBeUndefined();
    });
  });
});