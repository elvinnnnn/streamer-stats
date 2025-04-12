import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stream',
  imports: [],
  templateUrl: './stream.component.html',
  styleUrl: './stream.component.scss',
})
export class StreamComponent {
  stats: any;
  ccv: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({ stats, ccv }) => {
      this.stats = stats;
      this.ccv = ccv;
    });

    console.log(this.stats, this.ccv);
  }
}
