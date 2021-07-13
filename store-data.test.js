jest.mock('./database');
const database = require('./database');
jest.mock('./call-webhook');
const webhook = require('./call-webhook');
const storeDataMiddleware = require('./store-data');
const { mockRequest, mockResponse } = require('./mocks');

describe('Store Data Middleware', () => {
    const insertMock = jest.fn();
    const rawMock = jest.spyOn(database, 'raw').mockResolvedValue([[ { tag_name: 'taggy' }]]);
    const incrementMock = jest.fn().mockResolvedValueOnce(1).mockResolvedValue(0);
    const whereMock = jest.fn().mockReturnValue({
        increment: incrementMock
    });

    beforeAll(() => {    
        database.mockReturnValue({
            insert: insertMock,
            where: whereMock
        });

        const req = mockRequest({
            body: {
                user_id: 'I am ignoring title',
                title: 'I am ignoring tags',
                tags: [
                    'necessary',
                    'yet again',
                    'another',
                    'another'
                ]
            }
        });

        const res = mockResponse();
        const next = () => {};


        storeDataMiddleware(req, res, next);
    });

    it('saves the user and title in the tickets table', () => {
        expect(database.mock.calls[0][0]).toBe('tickets');
        expect(insertMock.mock.calls[0][0]).toEqual({
            user_id: 'I am ignoring title',
            title: 'I am ignoring tags',
        });
    });

    it('increment tag\'s count on the db if it exists', () => {
        expect(database.mock.calls[1][0]).toBe('tags');
        expect(whereMock.mock.calls[0][0]).toEqual({
            tag_name: 'necessary'
        });
        expect(incrementMock.mock.calls[0][0]).toBe('count');
        expect(incrementMock.mock.calls[0][1]).toBe(1);
    });

    it('inserts tag if it doesn\'t exist', () => {
        expect(database.mock.calls[2][0]).toBe('tags');
        expect(insertMock.mock.calls[1][0]).toEqual({
            tag_name: 'yet again',
            count: 1
        });
    });

    it('sends webhook request containing the tag with current highest count as \'tag\' query param.', () => { 
        expect(rawMock).toBeCalled();
        expect(webhook).toBeCalledWith('taggy');
    });
});