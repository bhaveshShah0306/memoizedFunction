import { Pipe, PipeTransform } from '@angular/core';
import   isEqual from 'lodash-es/isEqual'

// Define a generic type for the function
type GenericFunction<T extends unknown[], R> = (...args: T) => R;

@Pipe({
  name: 'memoize',
  pure: true // Pure pipes are already memoized by Angular
})
export class MemoizePipe implements PipeTransform {
  private lastFunction: GenericFunction<unknown[], unknown> | null = null;
  private lastArgs: unknown[] = [];
  private lastResult: unknown = null;

  transform<T extends unknown[], R>(fn: GenericFunction<T, R>, ...args: T): R {
    // Check if function or arguments changed
    if (
      this.lastFunction !== fn || 
      !this.argsEqual(args, this.lastArgs as T)
    ) {
      // Store current values
      this.lastFunction = fn as GenericFunction<unknown[],unknown>;
      this.lastArgs = [...args];
      this.lastResult = fn(...args);
    }
    
    return this.lastResult as R;
  }

  private argsEqual<T extends unknown[]>(args1:T, args2: T): boolean {
    return isEqual(args1,args2);
  }
}