import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {Utilities} from '../utils/Utilities';
import {FirebaseService} from '../firebase.service';
import {AlertController, ToastController} from '@ionic/angular';
import {User} from '../user/User';
import {Storage} from '@ionic/storage';

class Note {
    title: string;
    content: string;
    author: string;
    screenName: string;
    id: string;
}

@Component({
    selector: 'app-mirror',
    templateUrl: './mirror.page.html',
    styleUrls: ['./mirror.page.scss'],
})
export class MirrorPage implements OnInit {
    userId: string;
    mirrorId: string;
    screenName: string;
    noteTitle: string;
    noteText: string;
    notes: Note [];
    utils = Utilities;
    firebaseService = new FirebaseService();
    toastr = new ToastController();
    user: any;

    constructor(private router: Router, private route: ActivatedRoute,
                private storage: Storage, private alertController: AlertController) {
        this.user = new User(storage, router);
        this.user.sessionCheck().then((response: any) => {
            this.userId = response;
        });
        this.route.queryParams.subscribe(params => {
            // If the parmas are empty, go to previous page
            try {
                this.mirrorId = this.router.getCurrentNavigation().extras.state.mirrorId;
                this.screenName = this.router.getCurrentNavigation().extras.state.screenName;
                this.getNotes();
            } catch (e) {
                const navigationExtras: NavigationExtras = {};
                this.router.navigate(['main'], navigationExtras); // Angular router with param
            }
        });
    }


    getNotes() {
        this.firebaseService.getData(this.mirrorId + '/notes/').then((response: object) => {
            const tempNoteArray = [];
            Object.keys(response).forEach((key) => {
                const tempNote = new Note();
                tempNote.author = response[key]['data']['author'];
                tempNote.title = response[key]['data']['title'];
                tempNote.content = response[key]['data']['content'];
                tempNote.id = response[key]['data']['id'];
                tempNoteArray.push(tempNote);
            });
            this.notes = tempNoteArray;
            this.utils.loadingSpinner(false);
        });
    }

    addNote() {
        this.utils.loadingSpinner(true);
        const noteID = this.utils.randomStringId();
        const note = new Note();
        note.author = this.userId;
        note.title = this.noteTitle;
        note.content = this.noteText;
        note.screenName = this.screenName;
        note.id = noteID;
        this.firebaseService.pushData(this.mirrorId + '/notes/' + noteID, note)
            .then((response: boolean) => {
                this.utils.toggleModal();
                this.utils.loadingSpinner(false);
                if (response) {
                    this.utils.displayToast('Note sent to mirror', 1000, this.toastr, 'success');
                } else {
                    this.utils.displayToast('Error sending note', 1000, this.toastr, 'danger');
                }
            });
    }

    async deleteNote(noteId: string) {
        const alert = await this.alertController.create({
            header: 'Are you sure you want to delete this note?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                }, {
                    text: 'Yes',
                    cssClass: 'Primary',
                    handler: () => {
                        this.firebaseService.deleteData(this.mirrorId + '/notes', noteId);
                    }
                }
            ]
        });

        await alert.present();
    }

    ngOnInit() {
    }
}
