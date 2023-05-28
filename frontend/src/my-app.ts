import { checkTokenExpiry } from './core/check-expiry';
import { IApiService } from './services/api-service';
import MarkdownIt from 'markdown-it';

export class MyApp {
    private question: string = '';
    private response: string = '';
    private loading: boolean = false;
    private loggedIn: boolean = false;
    private errored: boolean = false;
    private error: string = '';

    constructor(@IApiService private readonly api: IApiService) {}

    attached() {
        // get the token from URL
        const tokenFromURL = new URLSearchParams(window.location.search).get('accessToken');
        let tokenFromStorage = localStorage.getItem('token');

        // Check token expiry for the stored token
        checkTokenExpiry();

        // Re-fetch the token from local storage in case it was removed by checkTokenExpiry()
        tokenFromStorage = localStorage.getItem('token');

        if (tokenFromURL) {
            const currentTime = new Date();
            localStorage.setItem('token', tokenFromURL);
            localStorage.setItem('loginTime', String(currentTime.getTime()));
            // Remove the accessToken from the URL after storing it
            window.history.replaceState({}, document.title, '/');
        }

        // Set loggedIn based on presence of a valid token
        this.loggedIn = !!(tokenFromStorage || tokenFromURL);
    }

    private login() {
        window.location.href = `${process.env.BACKEND_URL}/auth/github`;
    }

    private async ask() {
        try {
            const md = new MarkdownIt();
            this.response = '';

            this.loading = true;
            const response = await this.api.ask(this.question);
            const markdown = md.render(response);
            this.typeResponse(markdown, 0);
        } catch (error) {
            this.loading = false;
            this.errored = true;

            if (error.status === 429) {
                this.error = `You have exceeded your daily question limit.`;
            }

            if (error.status === 401) {
                this.error = `You are not logged in or your session has expired.`;
            }

            if (this.errored) {
                setTimeout(() => this.dismissError(), 5000);
            }
        }
    }

    private typeResponse(response: string, i: number) {
        if (i < response.length) {
            this.response += response.charAt(i);
            setTimeout(() => this.typeResponse(response, i + 1), 80);
        } else {
            this.loading = false;
        }
    }

    private keyPressed(which: number) {
        if (which === 13) {
            this.ask();
        }

        return true;
    }

    private dismissError() {
        this.errored = false;
    }

    private logout() {
        this.api.logout();
    }
}
