import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseResourceService<T = unknown> {
  protected readonly http: HttpClient;
  protected readonly apiPath!: string;

  constructor(protected injector: Injector) {
    this.http = injector.get(HttpClient);
  }

  private get params(): HttpParams {
    return new HttpParams();
  }

  protected get options(): {
    headers?: HttpHeaders;
    params?: HttpParams;
  } {
    return {
      params: this.params,
    };
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiPath, this.options).pipe(
      map((data) => this.jsonDataToResources<T>(data)),
      take(1),
    );
  }

  getById(id: string | number): Observable<T> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get<T>(url, this.options).pipe(
      map((data) => this.jsonDataToResource<T>(data)),
      take(1),
    );
  }

  create(resource: T): Observable<T> {
    return this.http.post<T>(this.apiPath, resource, this.options).pipe(
      map((data) => this.jsonDataToResource<T>(data)),
      take(1),
    );
  }

  update(resource: T & { _id: string }): Observable<T> {
    const url = `${this.apiPath}/${resource._id}`;
    return this.http.patch<T>(url, resource, this.options).pipe(
      map(() => resource),
      take(1),
    );
  }

  delete(id: string): Observable<unknown> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url, this.options).pipe(take(1));
  }

  protected jsonDataToResources<Y>(jsonData: unknown): Y[] {
    const data = this.getData(jsonData);
    const resources: Y[] = [];
    if (Array.isArray(data)) {
      data.forEach((element: unknown) =>
        resources.push(Object.assign({}, element) as Y),
      );
    }
    return resources;
  }

  protected jsonDataToResource<Y>(jsonData: unknown): Y {
    const data = this.getData(jsonData);
    return Object.assign({}, data) as Y;
  }

  protected getData(jsonData: unknown): unknown {
    const { data = null } = jsonData as { data: unknown };
    return data ?? jsonData;
  }
}
