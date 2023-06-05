import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../classes/user';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private readonly _cookieService: CookieService) {
    const user: User | null = this._cookieService.getCookieUser();

    this.userSubject = new BehaviorSubject(user);

    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(email: string, password: string): Observable<User> {
    const user = new User({
      id: 'fbe8d304-46b8-413d-b0da-06d123567260',
      email,
      firstName: 'Emerson',
      lastName: 'Costa',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    });

    this._cookieService.setUser(user);
    this.userSubject.next(user);
    return of(user);
    // return this._http
    //   .post<User>(`${environment.apiUrl}/users/authenticate`, {
    //     username,
    //     password,
    //   })
    //   .pipe(
    //     map((user) => {
    //       localStorage.setItem('user', JSON.stringify(user));
    //       this.userSubject.next(user);
    //       return user;
    //     }),
    //   );
  }

  logout(): void {
    this._cookieService.setUser(null);
    this.userSubject.next(null);
  }
}
