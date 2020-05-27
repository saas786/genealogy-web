import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ClientCacheService {
 
    personListKey = 'PersonList';
    personListStorage = localStorage;

    isPersonListInCache(){
      return this.personListStorage.getItem('PersonList') != null;
    }

    clearPersonsList() {
        localStorage.removeItem("PersonList")
    }

    set personsList(data) {
        localStorage.setItem('PersonList', JSON.stringify(data));
    }

    get personsList() {
        return JSON.parse(localStorage.getItem('PersonList'));
    }

    set endpoint(name) {
        sessionStorage.setItem('GENEALOGY_API', name);
    }

    get endpoint() {
        return sessionStorage.getItem('GENEALOGY_API');
    }

    set environnement(name) {
        sessionStorage.setItem('Environnement', name);
    }

    get environnement() {
        return sessionStorage.getItem('Environnement');
    }

    createCacheObject(data: any, timestamp: Date) {
        return { "data": data, "timestamp": timestamp.toISOString() }
    }
}

