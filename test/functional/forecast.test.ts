describe('Beach forecast fuctional tests', () => {
    it('should return a forecast with just a few times', async() => {
        const { body, status } = await global.testRequest.get('/forecast');
        expect(status).toBe(200);
        expect(body).toEqual([{
            "game": "god-of-war"
        }])
    });
});