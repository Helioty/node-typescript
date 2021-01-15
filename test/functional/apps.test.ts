describe('Apps functional tests', () => {
    describe('On create app', () => {
        it('should create a app with success', async () => {
            const app = {
                name: 'vendas',
                packageId: 'br.com.ferreiracosta.vendas',
            };

            const response = await global.testRequest.post('/apps').send(app);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining(app));
        });

        // it('should return 422 when there is a validation error', async () => {
        //     const app = {
        //         name: 123,
        //         packageId: 'br.com.ferreiracosta.vendas',
        //     };

        //     const response = await global.testRequest.post('/apps').send(app);
        //     expect(response.status).toBe(422);
        //     expect(response.body).toEqual({
        //         error:
        //             'Application validation failed: parameter "name" received Number, expected String.',
        //     });
        // });
    });
});
