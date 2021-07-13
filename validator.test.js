const validatorMiddleware = require('./validator');
const { mockRequest, mockResponse } = require('./mocks');

describe('Validator Middleware', () => {
    it('returns error if user_id is not in request body', () => {
        const req = mockRequest({
            body: {
                title: 'I am ignoring user_id',
                tags: []
            }
        });

        const res = mockResponse();
        const next = () => {};

        validatorMiddleware(req, res, next);

        expect(res.status).toBeCalledWith(422);
        expect(res.json).toBeCalledWith({
            status: 'error',
            error: {
                user_id: 'user_id is required'
            }
        });
    });

    it('returns error if title is not present in request body', () => {
        const req = mockRequest({
            body: {
                user_id: 'I am ignoring title',
                tags: []
            }
        });

        const res = mockResponse();
        const next = () => {};

        validatorMiddleware(req, res, next);

        expect(res.status).toBeCalledWith(422);
        expect(res.json).toBeCalledWith({
            status: 'error',
            error: {
                title: 'title is required'
            }
        });
    });

    it('tags must be present in request body', () => {
        const req = mockRequest({
            body: {
                user_id: 'I am ignoring title',
                title: 'I am ignoring tags'
            }
        });

        const res = mockResponse();
        const next = () => {};

        validatorMiddleware(req, res, next);

        expect(res.status).toBeCalledWith(422);
        expect(res.json).toBeCalledWith({
            status: 'error',
            error: {
                tags: 'tags must be an array'            
            }
        });
    });

    it('tags cannot be more fewer 5', () => {
        const req = mockRequest({
            body: {
                user_id: 'I am ignoring title',
                title: 'I am ignoring tags',
                tags: [
                    'necessary',
                    'yet again',
                    'another',
                    'and another',
                    'excessive',
                    'way too excess'
                ]
            }
        });

        const res = mockResponse();
        const next = () => {};

        validatorMiddleware(req, res, next);

        expect(res.status).toBeCalledWith(422);
        expect(res.json).toBeCalledWith({
            status: 'error',
            error: {
                tags: 'tags must be less than 5 elements'
            }
        });
    });

    it('successful validation triggers the next middleware', () => {
        const req = mockRequest({
            body: {
                user_id: 'I am ignoring title',
                title: 'I am ignoring tags',
                tags: [
                    'necessary',
                    'yet again',
                    'another',
                    'and another'
                ]
            }
        });

        const res = mockResponse();
        const next = jest.fn()

        validatorMiddleware(req, res, next);

        expect(next).toBeCalled()
    });
});