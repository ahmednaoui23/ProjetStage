import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  sidebarId = 'sidebar';

  constructor() {}

  ngOnInit(): void {
    // No more article or anomaly logic
  }
}
