import { Component, OnInit } from "@angular/core";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: [
    "./contact.component.scss",
    "./contact.component.responsivity.scss",
  ],
})
export class ContactComponent implements OnInit {
  name: string;
  email: string;
  phone: string;
  location: string;

  faEnvelope: IconDefinition;
  faPhone: IconDefinition;
  faMapMarkerAlt: IconDefinition;

  constructor() {}

  ngOnInit(): void {
    const personalData = environment.personal;
    this.name = personalData.name;
    this.email = personalData.email;
    this.phone = personalData.phone;
    this.location = personalData.location;

    this.faEnvelope = faEnvelope;
    this.faPhone = faPhone;
    this.faMapMarkerAlt = faMapMarkerAlt;
  }
}
