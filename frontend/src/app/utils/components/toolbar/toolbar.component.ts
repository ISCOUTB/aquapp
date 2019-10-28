import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Input() color = 'primary';
  language = 'es';
  flags = {
    es: '🇺🇸',
    en: '🇨🇴',
  };
  constructor(
    private translate: TranslateService,
    private storage: StorageService,
  ) {
    const savedLanguage = this.storage.get('language');
    this.language = savedLanguage !== null ? savedLanguage : this.language;
  }

  ngOnInit() {}

  toggleLanguate() {
    this.language = this.language === 'es' ? 'en' : 'es';
    this.translate.use(this.language);
    this.storage.save('language', this.language);
  }
}
