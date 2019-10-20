import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/routes';

@Component({
  selector: 'app-get-start-page',
  templateUrl: './get-start-page.component.html',
  styleUrls: ['./get-start-page.component.scss'],
})
export class GetStartPageComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.apiService.me().subscribe(
      (me: any) => {
        if (me.name === 'superuser') {
          this.router.navigateByUrl(`/${ROUTES.superuser}`);
        } else {
          this.router.navigateByUrl(`/${ROUTES.admin}`);
        }
      },
      () => this.router.navigateByUrl(`/${ROUTES.start}`),
    );
  }
}
