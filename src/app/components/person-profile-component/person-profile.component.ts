import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NotificationService } from 'src/app/_services/NotificationService';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { BiographyService } from 'src/app/_services/BiographyService';

@Component({
  selector: 'app-person-profile',
  templateUrl: './person-profile.component.html',
  styleUrls: ['./person-profile.component.css']
})

export class PersonProfileComponent implements OnInit {
  constructor(
    public configService: ConfigurationService,
    private api: GraphQLService,
    private fb: FormBuilder,
    private notif: NotificationService,
    public auth: AuthenticationService,
    public biographyService: BiographyService
  ) {
    this.personEditForm = this.fb.group({
      id: '',
      firstName: '',
      lastName: '',
      gender: '',
      yearOfBirth: '',
      birthDate: ''
    });
  }

  @Input() id = '';

  @Input() data: any = {};
  @Input() editable = false;

  personEditForm: FormGroup = null;
  editMode = false;

  image = '';

  getConnectedLogin() {
    return this.auth.getConnectedLogin();
  }

  switchEdit() {
    this.notif.showInfo(`To change profile image, please go to photo gallery and choose 'Set as profile' on the selected image.`);
  }

  getImage() {

    this.configService.getApiEndpoint()
    .then(endpoint => {
      return this.api.getProfilePhoto(endpoint, this.id);
    })
    .then(data => {
      if (data != null) {
        this.image =  data.url;
        return;
      }
      if (this.data?.currentPerson?.gender == 'Female') {
        this.image =  '../../../assets/img/profile_female.jpg';
      } else {
        this.image = '../../../assets/img/profile_male.jpg';
      }
    });

  }

  ngOnChanges() {
    this.getImage();
  }

  getRole(user): string {
    return 'Admin';
  }

  canEditProfile(): boolean {
    const connectedUser = 'daniel';
    const role = this.getRole(connectedUser);
    if (role === 'Admin') {
      return true;
    }
    return false;
  }

  ngOnInit(): void {

  }

  getBiography(data: any){
    return this.biographyService.Generate(data);
    // const currentPerson = data.currentPerson;
    // if(data.father != null )

    // return `${data.currentPerson.gender == 'Male' ? 'Son': 'Daughter'} of ${data.father.firstName} and ${data.mother.firstName}`;
  }

  getDisplayName(person: any) {
    let maidenName = person?.maidenName;
    if (!!maidenName) {
      maidenName = ` (${maidenName})`;
    }
    return `${person?.firstName} ${person?.lastName} ${maidenName ?? ''}`;
  }



  onChange(value: MatSlideToggleChange) {
    this.editMode = value.checked;
  }

  canEdit() {
    return this.editMode && this.editable;
  }
}

