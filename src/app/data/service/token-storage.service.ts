import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { AuthService } from './auth.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private memoryStore: any;

  constructor(private authService: AuthService, private router: Router) {}

  signOut(token: string) {
    this.authService
      .logout(token)
      .pipe(delay(500))
      .subscribe(
        (data) => {
          window.localStorage.clear();
          this.router.navigate(['/login']);
        },
        (err) => {
          window.localStorage.clear();
          this.router.navigate(['/login']);
        }
      );
  }

  setMemoryStore(data: any) {
    this.memoryStore = {
      ...data,
    };
  }

  getMemoryStore() {
    return this.memoryStore;
  }

  public saveToken(token: string) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user) {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

  public saveCacheSearch(screen: string, cache: any) {
    window.localStorage.setItem(screen, JSON.stringify(cache));
  }

  public getCacheSearch(screen: string) {
    return JSON.parse(localStorage.getItem(screen));
  }

  public clearCacheSearch(screen: string) {
    window.localStorage.removeItem(screen);
  }
}
