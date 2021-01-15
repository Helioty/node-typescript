export interface App {
    name: string;
    packageId: string;
    id?: string;
}

export class AppService {
    public async createApp(body: App): Promise<App> {
        return { ...body, ...{ id: 'fake-id' } };
    }
}
