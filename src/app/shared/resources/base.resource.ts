import { Directive, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Directive()
export abstract class BaseResource {
  private _router!: Router;
  private _activatedRoute!: ActivatedRoute;

  public loading$: Subject<boolean> = new Subject<boolean>();

  constructor(protected injector: Injector) {
    this._activatedRoute = this.injector.get(ActivatedRoute);
    this._router = this.injector.get(Router);
  }

  get router(): Router {
    return this._router;
  }

  get activatedRoute(): ActivatedRoute {
    return this._activatedRoute;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public filter(list: unknown): unknown {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public orderBy(list: unknown, param: string): unknown {
    return;
  }
}
