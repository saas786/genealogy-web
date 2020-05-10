import { Injectable } from '@angular/core';
import { ClientCacheService } from './ClientCacheService';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class ConfigurationService {

    constructor(
        private cacheService: ClientCacheService,
        private http: HttpClient) {

    }

    getApiEndpoint(): Promise<string> {

        return new Promise((resolve, reject) => {

            const cachedEndpoint = this.cacheService.endpoint;
            if (cachedEndpoint != null) {
                resolve(cachedEndpoint);
            }

            const url = window.location.origin + '/env';
            console.log(url);
            fetch(url)
                .then((resp) => resp.json())
                .then(res => {
                    const endpoint: string = res.GENEALOGY_API;
                    this.cacheService.endpoint = endpoint;
                    console.log(`Endpoint: ${endpoint}`);
                    resolve(endpoint);
                    return endpoint;
                }).catch(err => {
                    reject(Error(err));
                });
        });
    }

    getEnvironnement(): Promise<string> {

        return new Promise((resolve, reject) => {

            const cachedEndpoint = this.cacheService.endpoint;
            if (cachedEndpoint != null) {
                resolve(cachedEndpoint);
            }

            const url = window.location.origin + '/env';
            fetch(url)
                .then((resp) => resp.json())
                .then(res => {
                    const env: string = res.Environnement;
                    this.cacheService.environnement = env;
                    console.log(`Env: ${env}`);
                    resolve(env);
                    return env;
                }).catch(err => {
                    reject(Error(err));
                });
        });
    }
}
