import { DI } from 'aurelia';
import { newInstanceForScope } from '@aurelia/kernel';
import { HttpClient } from '@aurelia/fetch-client';

export type IApiService = ApiService;
export const IApiService = DI.createInterface<IApiService>('IApiService', (x) => x.singleton(ApiService));

export class ApiService {
    constructor(@newInstanceForScope(HttpClient) private readonly httpClient: HttpClient) {
        this.httpClient.configure((config) => config.useStandardConfiguration().withBaseUrl(process.env.BACKEND_URL));
    }

    public async ask(question: string): Promise<string> {
        const token  = localStorage.getItem('token');

        const response = await this.httpClient.fetch(`/questions`, {
            body: JSON.stringify({ question }),
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const body = await response.text();

        return body;
    }

    public logout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }
}
