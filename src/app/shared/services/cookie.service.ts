import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AES, enc } from 'crypto-js';
import { isNil, isString } from 'lodash';
import { environment } from 'src/environments/environment';
import { User } from '../classes/user';

export type SameSite = 'Lax' | 'None' | 'Strict';

export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: SameSite;
}

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  private static _cookieUser: User;
  private readonly documentIsAccessible!: boolean;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    // eslint-disable-next-line @typescript-eslint/ban-types
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly _router: Router,
  ) {
    this.documentIsAccessible = isPlatformBrowser(this.platformId);
  }

  get staticUser(): User {
    return CookieService._cookieUser;
  }

  set staticUser(user: User) {
    CookieService._cookieUser = user;
  }

  private getCookieRegExp(name: string): RegExp {
    const escapedName: string = name.replace(
      // eslint-disable-next-line no-useless-escape
      /([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/gi,
      '\\$1',
    );

    return new RegExp(
      '(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)',
      'g',
    );
  }

  private safeDecodeURIComponent(encodedURIComponent: string): string {
    try {
      return decodeURIComponent(encodedURIComponent);
    } catch {
      return encodedURIComponent;
    }
  }

  private checkCookieKey(name: string): boolean {
    if (!this.documentIsAccessible) {
      return false;
    }
    name = encodeURIComponent(name);
    const regExp: RegExp = this.getCookieRegExp(name);
    return regExp.test(this._document.cookie);
  }

  private getCookie(name: string): string | null {
    if (this.documentIsAccessible && this.checkCookieKey(name)) {
      name = encodeURIComponent(name);

      const regExp: RegExp = this.getCookieRegExp(name);
      const result: RegExpExecArray | null = regExp.exec(this._document.cookie);

      return result && result[1] ? this.safeDecodeURIComponent(result[1]) : '';
    } else {
      return '';
    }
  }

  private setCookie(
    name: string,
    value: string,
    expiresOrOptions?: CookieOptions['expires'] | CookieOptions,
    path?: CookieOptions['path'],
    domain?: CookieOptions['domain'],
    secure?: CookieOptions['secure'],
    sameSite?: SameSite,
  ): void {
    if (!this.documentIsAccessible) {
      return;
    }

    if (
      typeof expiresOrOptions === 'number' ||
      expiresOrOptions instanceof Date ||
      path ||
      domain ||
      secure ||
      sameSite
    ) {
      const optionsBody = {
        expires: expiresOrOptions as CookieOptions['expires'],
        path,
        domain,
        secure,
        sameSite: sameSite ? sameSite : 'Lax',
      };

      this.setCookie(name, value, optionsBody);
      return;
    }

    let cookieString: string =
      encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';

    const options = expiresOrOptions ? expiresOrOptions : {};

    if (options.expires) {
      if (typeof options.expires === 'number') {
        const dateExpires: Date = new Date(
          new Date().getTime() + options.expires * 1000 * 60 * 60 * 24,
        );

        cookieString += 'expires=' + dateExpires.toUTCString() + ';';
      } else {
        cookieString += 'expires=' + options.expires.toUTCString() + ';';
      }
    }

    if (options.path) {
      cookieString += 'path=' + options.path + ';';
    }

    if (options.domain) {
      cookieString += 'domain=' + options.domain + ';';
    }

    if (options.secure === false && options.sameSite === 'None') {
      options.secure = true;
      console.warn(
        `Cookie ${name} was forced with secure flag because sameSite=None.`,
      );
    }
    if (options.secure) {
      cookieString += 'secure;';
    }

    if (!options.sameSite) {
      options.sameSite = 'Lax';
    }

    cookieString += 'sameSite=' + options.sameSite + ';';

    this._document.cookie = cookieString;
  }

  private deleteCookie(
    name: string,
    path?: CookieOptions['path'],
    domain?: CookieOptions['domain'],
    secure?: CookieOptions['secure'],
    sameSite: SameSite = 'Lax',
  ): void {
    if (!this.documentIsAccessible) {
      return;
    }
    const expiresDate = new Date('Thu, 01 Jan 1970 00:00:01 GMT');
    this.setCookie(name, '', {
      expires: expiresDate,
      path,
      domain,
      secure,
      sameSite,
    });
  }

  private isJsonString(value: string | null): User | null {
    let user: User | null = null;
    try {
      if (!isNil(value)) {
        user = JSON.parse(value) as User;
      }
    } catch (error) {
      return null;
    }

    return user;
  }

  private getEncryptUser(value: string): string {
    const cipherHelper = AES;
    return cipherHelper
      .encrypt(value, environment.cryptoJSSecretKey)
      .toString();
  }

  private getDecoded(value: string): string {
    const cipherHelper = AES;
    return cipherHelper
      .decrypt(value, environment.cryptoJSSecretKey)
      .toString(enc.Utf8);
  }

  private decrypt(): string | null {
    let decoded = null;
    try {
      const user = this.getCookie(environment.cookieKey);
      if (!isNil(user)) {
        const decData = enc.Base64.parse(user).toString(enc.Utf8);
        decoded = this.getDecoded(decData);
      }
    } catch (error) {
      return null;
    }

    return decoded;
  }

  private encryptUser(value: unknown): string {
    const decrypted: string = isString(value) ? value : JSON.stringify(value);
    const crypted = this.getEncryptUser(decrypted);
    return enc.Base64.stringify(enc.Utf8.parse(crypted));
  }

  private getUser(): User | null {
    return this.staticUser ?? this.isJsonString(this.decrypt());
  }

  getCookieUser(): User | null {
    const staticUser = this.getUser();
    if (staticUser) {
      this.staticUser = staticUser;
    } else {
      this.setUser(null);
    }

    return staticUser;
  }

  setUser(obj: User | null): void {
    if (isNil(obj)) {
      this.deleteCookie(environment.cookieKey);
      this.staticUser = {} as User;
      void this._router.navigate(['/login']);
    } else {
      this.setCookie(environment.cookieKey, this.encryptUser(obj));
      this.staticUser = obj;
    }
  }
}
