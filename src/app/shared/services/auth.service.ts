import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../classes/user';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private router: Router, private http: HttpClient) {
    const storageUser: string | null = localStorage.getItem('user');
    const user: User | null = storageUser
      ? (JSON.parse(storageUser) as User)
      : null;

    this.userSubject = new BehaviorSubject(user);

    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    const user = new User({
      id: 'jahsdjlhasjdhjasdh',
      email,
      password,
      firstName: 'Emerson',
      lastName: 'Costa',
      token: 'Teste',
    });

    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
    return of(user);
    // return this.http
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
    localStorage.removeItem('user');
    this.userSubject.next(null);
    void this.router.navigate(['/login']);
  }
}
