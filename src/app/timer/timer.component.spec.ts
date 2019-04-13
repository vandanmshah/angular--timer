import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TimerComponent } from './timer.component';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;
  let minutes: any;
  let seconds: any;
  let startButton: any;
  let stopButton: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    minutes = fixture.debugElement.queryAll(By.css('#minutes'))[0].nativeElement;
    seconds = fixture.debugElement.queryAll(By.css('#seconds'))[0].nativeElement;
    startButton = fixture.debugElement.queryAll(By.css('#start'))[0].nativeElement;
    stopButton = fixture.debugElement.queryAll(By.css('#stop'))[0].nativeElement;
    fixture.detectChanges();
  });

  it('time variables should be pre-assigned', () => {
    expect(component.minutes).toEqual(25);
    expect(component.seconds).toEqual(0);
    expect(component.started).toEqual(false);
  })

  it('check resetVariables', () => {
    component.resetVariables(30, 15, false);
    expect(component.minutes).toEqual(30);
    expect(component.seconds).toEqual(15);
    expect(component.started).toEqual(false);
  })

  it('check time edit functions', () => {
    // should not add or minus five if timer is not started
    component.minusFive();
    expect(component.minutes).toEqual(component.minutes);
    component.addFive();
    expect(component.minutes).toEqual(component.minutes);

    startButton.click();
    // before adding or minus store old value of minutes for checking
    let minsBeforAddOrMinus = component.minutes;
    component.minusFive();
    expect(component.minutes).toEqual(minsBeforAddOrMinus - 5);
    // check seconds are reseting
    expect(component.seconds).toEqual(0);
    minsBeforAddOrMinus = component.minutes;
    component.addFive();
    expect(component.minutes).toEqual(minsBeforAddOrMinus + 5);
    expect(component.seconds).toEqual(0);
  })

  it('check start and stop', () => {
    component.start();
    expect(component.minutes).toEqual(25);
    expect(component.seconds).toEqual(0);
    expect(component.started).toEqual(true);
    component.stop();
    expect(component.minutes).toEqual(25);
    expect(component.seconds).toEqual(0);
    expect(component.started).toEqual(false);
  })

  it('check if minutes and seconds are double digit', () => {
    expect(minutes.innerHTML).toEqual('25');
    expect(seconds.innerHTML).toEqual('00');
  })

  it('check if regular timer is triggered', fakeAsync(() => {
    spyOn(component, 'intervalCallback');
    // To check whether timer is calling intervalCallback or not, we have to start
    // and stop the timer
    // start timer
    startButton.click();
    tick(1000);
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    // stop timer
    stopButton.click();
    fixture.whenStable().then(() => {
      expect(component.intervalCallback).toHaveBeenCalled();
    });
  }))
  it('check multiple clicks on start button', () => {
    startButton.click();
    const intervalValue = component.interval;
    startButton.click();
    expect(component.interval).toEqual(intervalValue);
    stopButton.click();
  });

  it('check 00:00 when timer ends and should stop timer', fakeAsync(() => {
    startButton.click();
    component.minutes = 0;
    component.seconds = 0;
    fixture.detectChanges();
    tick(1000);
    fixture.whenStable().then(() => {
      expect(component.minutes).toEqual(0);
      expect(component.seconds).toEqual(0);
      expect(component.started).toEqual(false);
    });
  }));

  it('check 00:00 when timer ends and should stop timer', fakeAsync(() => {
    startButton.click();
    component.minutes = 0;
    component.seconds = 0;
    fixture.detectChanges();
    tick(1000);
    fixture.whenStable().then(() => {
      expect(component.minutes).toEqual(0);
      expect(component.seconds).toEqual(0);
      expect(component.started).toEqual(false);
    });
  }));

  it('check when we click on -5 button and if it reached to 00:00 it should stick to 00:00 and stop the timer', fakeAsync(() => {
    startButton.click();
    component.minutes = 2;
    component.seconds = 0;
    component.minusFive();
    fixture.detectChanges();
    tick(1000);
    fixture.whenStable().then(() => {
      expect(component.minutes).toEqual(0);
      expect(component.seconds).toEqual(0);
      expect(component.started).toEqual(false);
    });
  }));
});
