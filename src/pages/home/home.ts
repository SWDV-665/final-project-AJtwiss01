import { Component } from "@angular/core";
import { NavController, AlertController} from "ionic-angular";
import { ToastController } from "ionic-angular";
import { groceriesServiceProvider } from '../../providers/groceries-service/groceries-service';
import { InputDialogServicesProvider } from '../../providers/input-dialog-services/input-dialog-services';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Camera, CameraOptions } from '@ionic-native/camera';


@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  title = "Groceries Home ";
  items = [];
  errorMessage:string 
  private image: string;

  constructor(
    private camera: Camera,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public dataService: groceriesServiceProvider,
    public InputDialogServices: InputDialogServicesProvider,
    public socialSharing: SocialSharing,
   

  ) {
    dataService.dataChanged$.subscribe((dataChanged: Boolean) => {this.loadItems()});
  }
  
  ionViewDidLoad(){
    this.loadItems()
  }
  loadItems(){
    this.dataService.getItems().subscribe(
      items => this.items = items,
      error => this.errorMessage = <any>error

    )
  }
  
  addItem(){
    console.log('it adding')
    this.InputDialogServices.showPrompt()
  }
 
  removeItem(item, index) {

    let toast = this.toastCtrl.create({
      message: 'Remoiving Item - ' + item.name+ '....',
      duration: 3000,
      position: "top"
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
    this.dataService.removeItem(item._id)
  }

  shareItem(item, index) {

    let toast = this.toastCtrl.create({
      message: 'Share Item - ' + item.name+ '....',
      duration: 3000,
      position: "top"
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });
    let message = "Grocery Item Name : "+ item.name + "Quanity : "+ item.quanity;
    let subject = "Share Via Grocery App"
    toast.present();
    this.socialSharing.share(message, subject).then(() => {
      // Sharing via email is possible
      console.log("Successful")
    }).catch(() => {
      // Sharing via email is not possible
      console.log("Error", Error)

    });
    
  }
  editItem(item, index) {

    let toast = this.toastCtrl.create({
      message: 'Edit Item - ' + item.name+ '....',
      duration: 3000,
      position: "top"
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
    this.InputDialogServices.showPrompt(item,index)
  }
  //camera funcitons 
  onTakePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
    this.image = 'data:image/jpeg;base64,' + imageData;

    //  let base64Image = 'data:image/jpeg;base64,' + imageData;
    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: 'Created Picture' + this.image,
      buttons: ['OK']
    });
    alert.present();
    }, (err) => {
     // Handle error
     this.displayErrorAlert(err);
    });
  }

  displayErrorAlert(err){
    console.log(err);
    let alert = this.alertCtrl.create({
       title: 'Error',
       subTitle: 'Error while trying to capture picture',
       buttons: ['OK']
     });
     alert.present();
  }
}
