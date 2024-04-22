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
      question: "Is PCBUILD3R fully functional for real-world use?",
      answer: "No. PCBUILD3R is a mockup/prototype designed for the purpose of my Final Year Project (FYP). \
                While it provides an interactive learning experience for PC building, it does not encompass all functionalities required for real-world PC assembly."
    },
    {
      question: "What is PCBUILD3R?",
      answer: "PCBUILD3R is a web-based platform aimed at facilitating an enjoyable learning process for PC building. \
                It offers features such as 3D simulation, hardware browsing, rewards redemption, inventory management and more. Checkout about page to know more."
    },
    {
      question: "What technologies are used in PCBUILD3R?",
      answer: "PCBUILD3R employs MEAN stack for its full stack development together with Three.js for virtual PC building simulation using WebGL."
    },
    {
      question: "How does PCBUILD3R assist users in building PCs virtually?",
      answer: "PCBUILD3R offers a step-by-step guide with auto-snapping assembling in a 3D environment, providing users with an immersive experience. \
                While the assembling simulation offers a streamlined process, it's important to note that in-depth details on assembling are excluded \
                due to time and resource constraints of the project. Additionally, wire connections and steps beyond assembling are also omitted as \
                this simulation serves as a proof of concept (POC) to be used as a template for further development and scaling."
    },
  ];
}
