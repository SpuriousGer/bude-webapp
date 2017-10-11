import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { diff } from 'deep-object-diff'

/*

To-Dos:
- glow changed formControl
- Disable the form so replay can happen
- Strip out empty values in form to reduce object size

*/

@Injectable()
export class FormService {
  defaultTime: number = 250;
  defaultAutoSaveTime: number = 60000;
  formSubscription: Subscription;
  formObservable: Observable<any>;
  initialFormObject: Object = {};

  lastListenValue = {};
  lastListenTimestamp: number;
  recordedListeningValues = [];
  recordingRunning: boolean = false;
  replayRunning: boolean = false;
  currentReplayStep: number = 0;
  replayStepper = new BehaviorSubject(0);
  timerValue: number;

  timeToNextReplay: number; //same as timerValue, debatable whether string or number

  constructor() {}

  startListening(obs: Observable<any>, debTime?: number) {
    this.recordingRunning = true;
    if (debTime === undefined) debTime = this.defaultTime;
    this.recordedListeningValues = [];
    this.formObservable = obs
      .skipWhile(() => this.recordingRunning === false)
      .debounceTime(debTime)
      .pairwise()
    
    this.formObservable.first().subscribe(x => this.initialFormObject = x[0]);
    this.formObservable = this.formObservable.map(data => Object.assign({'diff': diff(data[0], data[1]), 'ts': Date.now(), 'data': data[1]}))

    this.formSubscription = this.formObservable.subscribe(x => {
      this.recordedListeningValues[x.ts] = x.diff;
    });
    this.autoSaving(60000).subscribe();
  }

  pauseListening() {
    this.formSubscription.unsubscribe();
    this.recordingRunning = false;
  }

  resumeListening(objectBeforeResume: Object) {
    this.lastListenValue = objectBeforeResume;
    this.lastListenTimestamp = Date.now();
    this.recordingRunning = true;
    this.formSubscription = this.formObservable.subscribe(x => this.recordedListeningValues[x.ts] = x.diff);
  }

  stopListening() {
    this.formSubscription.unsubscribe();
    const recordedValues = this.recordedListeningValues;
    this.recordedListeningValues = [];
    this.recordingRunning = false;
    this.lastListenTimestamp = null;
    this.lastListenValue = {};
    return recordedValues;
  }

  startReplay(replayValues: Object) {
    // Variable setting
    this.replayRunning = true;

    // Setting the base Observable for the replay values
    const obsRepValues = Observable
      .from(Object.keys(replayValues))
      .filter(key => Object.keys(diff(replayValues[key], this.initialFormObject)).length > 0)

    // Create the five different Observables plus the final Observable of values
    const obsTimestamps = obsRepValues.map((x, i) => Number(x));
    const obsValues = obsRepValues.map((x, i) => replayValues[x]);
    const obsIndex = obsRepValues.map((x, i) => i + 1);

    const obsTimeDiff = obsRepValues
      .pairwise()
      .map(key => Math.ceil((Number(key[1]) - Number(key[0])) / 100) * 100)
      .startWith(0);
    const obsTimeElapsed = obsTimeDiff.scan((acc, curr) => acc + curr, 0);

    const obsResult = Observable.zip(obsIndex, obsTimestamps, obsValues, obsTimeDiff, obsTimeElapsed);

    // Construction of the relevant Observables that will be either returned or used for the timer
    // The obsBase Observable is the basis for both the obsTimer (countdown timer) as well as the obsResult (returned to be subscribed to to patchValue() the form)
    const obsBase = obsResult
      .delayWhen(x =>
        Observable.race(
          Observable.interval(10).skipWhile(() => x[0] != this.currentReplayStep),
          Observable.interval(10).skipWhile(() => (x[0] - 1) != this.currentReplayStep).delay(x[3])
        )
      )
      .takeWhile(() => this.replayRunning === true);

    const obsTimer = obsBase.do(console.log).map(x => {
      this.currentReplayStep = x[0];
      const interval: number = 100;
      obsTimeDiff
        .skipWhile(() => x[0] != this.currentReplayStep)
        .elementAt(x[0], 0)
        .switchMap(duration => Observable.timer(0, interval).mapTo(-interval).scan((acc, curr) => acc + curr, duration).map(x => x / 1000))
        .takeWhile(() => this.replayRunning === true && x[0] == this.currentReplayStep)
        .finally(() => this.timerValue = 0)
        .subscribe(y => this.timerValue = y);
    }).subscribe()

    return obsBase
      .map(x => x[2])
      .finally(() => this.stopReplay());
  }

  skipToNext() {
    this.currentReplayStep = this.currentReplayStep + 1;
  }

  stopReplay() {
    this.replayRunning = false;
    console.log('Replay stopped at step: ' + this.currentReplayStep);
    // this.resumeListening(); // Needs the object state before resuming
  }

  autoSaving(autoSaveTime?: number) {
    if (autoSaveTime === undefined) autoSaveTime = this.defaultAutoSaveTime;
    let latestAutoSaveValue = {};
    return Observable  // could be significantly reduced in complexity
      .interval(autoSaveTime)
      .withLatestFrom(this.formObservable.map(x => x.data))
      .switchMap(x => this.recordingRunning ? Observable.of(x[1]) : Observable.never())
      .do(console.log)
      .filter(x => Object.keys(diff(x, latestAutoSaveValue)).length > 0 && Object.keys(diff(x, this.initialFormObject)).length > 0)
      .map(x => {
        latestAutoSaveValue = x;
        return Object.assign(x, {recording: this.recordedListeningValues}, {ts: Date.now()});
      });
  }
}