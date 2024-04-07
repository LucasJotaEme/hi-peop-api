import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const canActivateResult = super.canActivate(context);

    if (typeof canActivateResult === 'boolean') {
      return canActivateResult;
    } else if (canActivateResult instanceof Promise) {
      return canActivateResult;
    } else {
      return canActivateResult.toPromise();
    }
  }
}
