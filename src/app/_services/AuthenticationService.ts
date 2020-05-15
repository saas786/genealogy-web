import { Injectable } from '@angular/core';
import { GraphQLService } from './GraphQLService';
import { ConfigurationService } from './ConfigurationService';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private rest: ConfigurationService,
    private api: GraphQLService,
    private router: Router
  ) {
  }

  login(login: string, password: string) {
    return new Promise((resolve, reject) => this.rest.getApiEndpoint()
      .then((endpoint) => this.api.login(endpoint.toString(), login, password))
      .then((auth) => {
        if (auth.success === true) {
          localStorage.setItem("token", auth.token.toString());
          resolve(auth.token);
          this.router.navigateByUrl('person/' + this.getConnectedProfile());
          return;
        }
        throw new Error('Login failed.');
      })
      .catch((err) => {
        reject(Error(err));
      }));
  }

  register(id: string, login: string, password: string) {
    return new Promise((resolve, reject) => this.rest.getApiEndpoint()
      .then((endpoint) => this.api.register(endpoint.toString(), id, login, password))
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(Error(err));
      }));
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }

  isConnected() {
    return localStorage.getItem('token') != null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getConnectedLogin() {
    if (this.isConnected) {
      let token = this.getToken();
      let data = this.parseJwt(token);
      return data.login;
    }
    return '';
  }

  getConnectedProfile() {
    if (this.isConnected) {
      let token = this.getToken();
      let data = this.parseJwt(token);
      return data.profile;
    }
    return '';
  }

  parseJwt(token) {
    if(token == null){
      return {}
    }
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }
}