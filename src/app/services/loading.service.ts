import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingStates = new Map<string, boolean>();
  private isLoadingSubject = new BehaviorSubject<boolean>(true);

  registerComponent(componentId: string) {
    this.loadingStates.set(componentId, true);
    this.updateLoadingState();
  }

  setComponentLoaded(componentId: string) {
    this.loadingStates.set(componentId, false);
    this.updateLoadingState();
  }

  private updateLoadingState() {
    const isStillLoading = Array.from(this.loadingStates.values()).some(state => state);
    this.isLoadingSubject.next(isStillLoading);
  }

  isLoading(): Observable<boolean> {
    return this.isLoadingSubject.asObservable();
  }
}
