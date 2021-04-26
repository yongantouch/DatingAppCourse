import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent implements OnInit {
  error: any;

  constructor(private router: Router) {
    const navigationExtras = this.router.getCurrentNavigation();
    this.error = navigationExtras?.extras?.state?.error;
    
   }

  ngOnInit(): void {
  }

}
