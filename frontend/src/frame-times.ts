import { faro } from '@grafana/faro-web-sdk';
import { pushMeasurement } from '@app/observability';
import { user } from '@app/static-data/static-data';

const MEASURE_FRAME_TIME_INTERVAL = 10_000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const getNow = () => Math.round(performance.now());

class FrameTimes {
  private measurements: number[] = [];
  private interval: NodeJS.Timeout | null = null;
  private isRunning = false;
  private currentAnimationFrame: number | null = null;

  public async init() {
    await delay(10_000);

    if (!document.hidden) {
      this.start();
    }

    document.addEventListener('visibilitychange', () => this.onVisibilityChange());
  }

  private runMeasureLoop(previousTime: number = getNow()) {
    const now = getNow();
    this.measurements.push(now - previousTime);

    if (this.isRunning) {
      this.currentAnimationFrame = requestAnimationFrame(() => this.runMeasureLoop(now));
    }

    return this;
  }

  private onVisibilityChange() {
    if (document.hidden) {
      this.pause();
    } else {
      this.start();
    }
  }

  private pause() {
    if (!this.isRunning) {
      return this;
    }

    this.isRunning = false;

    if (this.currentAnimationFrame !== null) {
      cancelAnimationFrame(this.currentAnimationFrame);
      this.currentAnimationFrame = null;
    }

    this.stopLogging().logMeasurements();

    return this;
  }

  private start() {
    if (this.isRunning) {
      return this;
    }

    this.isRunning = true;
    this.runMeasureLoop();
    this.startLogging();

    return this;
  }

  private startLogging() {
    this.interval = setInterval(() => this.logMeasurements(), MEASURE_FRAME_TIME_INTERVAL);

    return this;
  }

  private stopLogging() {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }

    return this;
  }

  private logMeasurements() {
    if (this.measurements.length === 0) {
      return this;
    }

    const max = Math.max(...this.measurements);
    const avg = Math.round(this.measurements.reduce((a, b) => a + b, 0) / this.measurements.length);
    this.measurements = [];

    this.internalPushMeasurement(max, avg);

    return this;
  }

  private async internalPushMeasurement(max: number, avg: number) {
    const { navIdent } = await user;

    faro.api.setUser({ id: navIdent });

    pushMeasurement({
      type: 'kabal_frame_time',
      values: { kabal_frame_time_max: max, kabal_frame_time_avg: avg },
    });

    faro.api.resetUser();

    return this;
  }
}

export const FRAME_TIMES = new FrameTimes();
