import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.sass',
})
export class FaqComponent {
  @Input() show: boolean = false;
  @ViewChild('panel1') panel1: any;
  @ViewChild('panel2') panel2: any;
  isPanelExpanded: boolean[] = [];
  isIconRotated: boolean[] = [];

  expandPanel(panelIndex: number) {
    this.isPanelExpanded[panelIndex] = !this.isPanelExpanded[panelIndex];
    this.isIconRotated[panelIndex] = !this.isIconRotated[panelIndex];
  }
  
  enquiries: any[] = [
    {
      question: "Disclaimer: Is PCBuild3R fully functional for real-world use?",
      answer: "PCBuild3R is a mockup/prototype designed for educational purposes as part of a Final Year Project (FYP). \
                While it provides an interactive learning experience for PC building, it may not encompass all functionalities required for real-world PC assembly"
    },
    {
      question: "What is PCBuild3R?",
      answer: "PCBuild3R is a web-based gamified platform aimed at facilitating an enjoyable learning process for PC building. \
                It offers features such as build recommendations, 3D simulation, hardware browsing, rewards redemption, progress tracking, and more."
    },
    {
      question: "What features does PCBuild3R offer?",
      answer: "PCBuild3R provides specifications for suitable hardware based on budget and demand, checks compatibility of selected components, \
                offers step-by-step guides in interactive 3D environments, includes a 3D playground for virtual PC building, \
                supports augmented reality (AR) mode for viewing built PCs in real life, offers interactive troubleshooting assistance for common issues,\
                and includes user account management for saving progress and revisiting previous builds."
    },
    {
      question: "What technologies are used in PCBuild3R?",
      answer: "PCBuild3R employs MEAN stack for both front and backend development, Three.js, Babylon.js, A-Frame, or Phaser for JS 3D game engines, \
                Blender for 3D modeling, and Unity and WebGL for additional functionalities."
    },
    {
      question: "How does PCBuild3R assist users in building PCs virtually?",
      answer: "PCBuild3R offers step-by-step guides, visual aids, compatibility checks, and a virtual 3D playground to assist users in the PC building \
                process. Additionally, interactive troubleshooting helps users resolve common issues."
    },
  ];
}
