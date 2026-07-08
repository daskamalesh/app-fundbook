import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})

export class LoaderComponent implements OnInit {
  show: boolean = false;

  constructor(private _loaderService: LoaderService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this._loaderService.loadState.subscribe(res => {
      this.show = res;
      this.cdRef.detectChanges();
    });
  }
}


