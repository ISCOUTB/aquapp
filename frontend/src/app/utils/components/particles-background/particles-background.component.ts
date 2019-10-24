import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

export interface Figure {
  update(): void;
  draw(): void;
}

export class Particula implements Figure {
  xOrigin: number;
  yOrigin: number;
  orbit = (Math.random() * window.innerWidth) / 2 + 100;
  previousX: number;
  previousY: number;
  xMousePrevious: number;
  yMousePrevious: number;
  orientation = Math.random() >= 0.5 ? 1 : -1;
  constructor(
    private x: number,
    private y: number,
    private speed: number,
    private color: string,
    private context: CanvasRenderingContext2D,
    private radious: number,
    private radians: number,
    private mouse: { x: any; y: any },
  ) {
    this.radians = Math.random() * Math.PI * 2;
    this.xOrigin = this.x;
    this.yOrigin = this.y;
    this.xMousePrevious = this.x;
    this.yMousePrevious = this.y;
  }

  update() {
    this.xMousePrevious += (this.mouse.x - this.xMousePrevious) * 0.05;
    this.yMousePrevious += (this.mouse.y - this.yMousePrevious) * 0.05;

    this.xOrigin = this.mouse.x;
    this.yOrigin = this.mouse.y;

    this.previousX = this.x;
    this.previousY = this.y;

    this.radians += this.speed;

    this.x = this.xMousePrevious + Math.cos(this.radians) * this.orbit;
    this.y =
      this.yMousePrevious +
      Math.sin(this.radians) * this.orbit * this.orientation;
    this.draw();
  }

  draw() {
    this.context.beginPath();
    this.context.strokeStyle = this.color;
    this.context.lineWidth = this.radious;
    this.context.moveTo(this.previousX, this.previousY);
    this.context.lineTo(this.x, this.y);
    this.context.stroke();
    this.context.closePath();
  }
}

@Component({
  selector: 'app-particles-background',
  templateUrl: './particles-background.component.html',
  styleUrls: ['./particles-background.component.scss'],
})
export class ParticlesBackgroundComponent implements AfterViewInit {
  @ViewChild('canvas', { read: ElementRef, static: false }) lienzo: ElementRef;
  public context: CanvasRenderingContext2D;
  figures: Figure[] = [];
  colors = ['#b5763f', '#3f51b5'];
  numberOfFigures = 250;
  mouse: {
    x: number;
    y: number;
  };
  clean = false;
  constructor() {
    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    window.addEventListener('mousemove', (ev: MouseEvent) => {
      this.mouse.x = window.innerWidth / 2;
      this.mouse.y = window.innerHeight / 2;
    });
  }

  ngAfterViewInit(): void {
    this.context = (this.lienzo.nativeElement as HTMLCanvasElement).getContext(
      '2d',
    );
    this.context.canvas.width = window.innerWidth;
    this.context.canvas.height = window.innerHeight;
    window.onresize = () => {
      this.context.canvas.width = window.innerWidth;
      this.context.canvas.height = window.innerHeight;
      this.inicializar();
    };
    this.inicializar();
    this.context.stroke();
    this.animar();
  }

  inicializar() {
    this.figures = [];
    for (let i = 0; i < this.numberOfFigures; i++) {
      const radious = Math.random() * 5 + 1;
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;
      const background = this.colors[
        Math.floor(Math.random() * this.colors.length)
      ];
      const speed = 0.01 * Math.random() + 0.005;
      this.figures.push(
        new Particula(
          x,
          y,
          speed,
          background,
          this.context,
          radious,
          0,
          this.mouse,
        ),
      );
    }
  }

  animar() {
    requestAnimationFrame(() => this.animar());
    this.context.fillStyle = 'rgba(33, 33, 33)';
    this.context.fillRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height,
    );
    this.context.stroke();

    this.context.beginPath();
    this.context.lineTo(this.context.canvas.width / 2, 0);
    this.context.lineTo(
      this.context.canvas.width / 2,
      this.context.canvas.height,
    );
    this.context.strokeStyle = '#f00';
    // this.contexto.stroke();

    this.context.beginPath();
    this.context.lineTo(0, this.context.canvas.height / 2);
    this.context.lineTo(
      this.context.canvas.width,
      this.context.canvas.height / 2,
    );
    // this.contexto.stroke();

    for (const figura of this.figures) {
      figura.update();
    }
  }
}
