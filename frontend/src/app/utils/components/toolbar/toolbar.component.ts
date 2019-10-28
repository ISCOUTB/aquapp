import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Input() color = 'primary';
  language = 'es';
  constructor(private translate: TranslateService) {}

  ngOnInit() {}

  toggleLanguate() {
    this.language = this.language === 'es' ? 'en' : 'es';
    this.translate.use(this.language);
  }
}
