import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/loader/loader.component';
import { ModalPopupComponent } from "./shared/modal-popup/modal-popup.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, ModalPopupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app-fundbook';
}
