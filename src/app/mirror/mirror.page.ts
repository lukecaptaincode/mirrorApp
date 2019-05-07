import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-mirror',
    templateUrl: './mirror.page.html',
    styleUrls: ['./mirror.page.scss'],
})
export class MirrorPage implements OnInit {
    userId: string;
    mirrorId: string;
    constructor(private router: Router, private route: ActivatedRoute) {
        // Get the userId from the passed state
        this.route.queryParams.subscribe(params => {
            this.userId = this.router.getCurrentNavigation().extras.state.uId;
            this.mirrorId = this.router.getCurrentNavigation().extras.state.mirrorId;
        });

    }

    ngOnInit() {
    }

}
