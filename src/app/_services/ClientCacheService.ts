import { Injectable } from '@angular/core';
import LoggerService from './logger_service';

@Injectable({
    providedIn: 'root'
})

export class ClientCacheService {

  logger: LoggerService = new LoggerService('clientCacheService');

    getPersonListFromCache() {
      const fileCache  = require('../data/cache/personList.json');
      if (!this.isPersonListInCache()) {
        this.logger.info('Cache from file');
        this.personsList = this.createCacheObject(fileCache.data);
        return fileCache;
      } else {
        const cache = Object.assign(this.personsList);
        if ( cache.timestamp < fileCache.timestamp ) {
          this.logger.info('Cache in storage too old => Cache from file');
          this.personsList = this.createCacheObject(fileCache.data);
          return fileCache;
        } else {
          this.logger.info('Cache from storage');
          return cache;
        }
      }
    }
 
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

    createCacheObject(data: any, timestamp: Date = new Date()) {
        return { "data": data, "timestamp": timestamp.toISOString() }
    }
}

