import { Component, ElementRef, ViewChild } from '@angular/core';
import { EngineService } from '../../service/engine.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { OrderService } from '../../service/order.service';
import { Voucher } from '../../interface/voucher.model';
import { SimulationService } from '../../service/simulation.service';
import { Session } from '../../interface/session.model';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.sass'
})

export class CanvasComponent {
  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas!: ElementRef<HTMLCanvasElement>;
  vouchers!: Voucher[];
  sessions!: Session[];
  buildOption: string = "Budget PC";
  earnedVoucherKey: string = "";
  isIntroModalActive: boolean = true;
  isStepModalActive: boolean = false;
  isAboutModalActive: boolean = false;
  isPostSessionModalActive: boolean = false;
  isSessionOngoing: boolean= false;
  step: number = 0;

  assemblySteps = [
    { stepTitle: "", 
      desc: []
    },
    { stepTitle: "Picking Parts", 
      desc: ["First you will need to buy the parts necessary to build a computer.",
              "The parts include:",
              "1. Computer Case",
              "2. Case Fan",
              "3. Motherboard",
              "4. Processor(CPU)",
              "5. CPU Fan",
              "6. Memory(RAM)",
              "7. Storage Drive",
              "8. Graphics Card",
              "9. Power Supply",
              "10. SATA Cables",
              "11. Screwdriver",
              "12. Ground Strap (optional)",
              "Note: In this simulation, we will be excluding the assembling of wires.",
              "Caution: Chosen parts must be compatible (they are chosen in this case)"]
    },
    { stepTitle: "Open and Prepare the Case", 
      desc: ["Open the computer case by removing side panels. Find the screws that hold the\
              side panels in place.",
            "To prepare the case, remove any packaging materials that may have been shipped.\
              Double check the front panel connections like power switch, audio jacks and usb ports.",
            "Caution: Case may have sharp edges. Handle with care to avoid injury. Always wear a grounding\
              strap when assembling."]
    },
    { stepTitle: "Install Case Fan", 
      desc: ["Align the mounting holes by holding the fan to mounting pad on the inside of the case",
            "Insert the screws from the outside of the case and tighten",
            "Note: Ensure that installed case fans are poitning in the correct direction."]
    },
    { stepTitle: "Install Motherboard", 
      desc: ["Install the I/O shield in the opening in the back of the case by pushing in from the inside",
            "Install standoffs in the cases into mount the motherboard. Note: Each motherboard has different screw \
              hole locations.",
            "Lower motherboard into the case and align with the I/O sheild before securing it with screws.",
            "Note: To prevent damage to the motherboard, it must only contact the standoffs and screws."]
    },
    { stepTitle: "Install Processor (CPU)", 
      desc: ["For Intel processor, find corner mark on the processor. For AMD processor, the corner is marked with an arrow",
            "Lift the small metal rod next to the socket, make sure the markings are aligned correctly",
            "Push the rod down to lock the procesor in place."]
    },
    { stepTitle: "Install CPU Fan", 
      desc: ["Place thermal compound to the CPU following the instructions provided.",
            "Set the fan assembly on the processor with mounting tabs aligned.",
            "Apply balanced screw pressure into each side of the motherboard.",
            "Connect the fan assembly's power connetor ot the motherboard.",
            "Some CPU fan contact area comes with protective layer, make sure to remove it before installing."]
    },
    { stepTitle: "Install Memory (RAM)",
      desc: ["Check to see the notch in board is in correct location. Turn around 180 degrees otherwise.",
            "Press firmly on both ends of the memory stick into the socket. A click sound is made when tabs\
              are locked into place.",
            "Caution: Make sure tabs aligned to prevent causing serious damage to the motherboard"]
    },
    { stepTitle: "Install Storage", 
      desc: ["Install M.2 solid state drive into M.2 slot of the motherboard (usally above PCLE slot). \
            Once SSD is fitted in, press down and secure the drive with small M.2 screw"]
    },
    { stepTitle: "Install Graphics Card", 
      desc: ["Gently remove expansion slot cover of both graphics card and case. Line the graphics card up with\
            PCI expansion slot and firmly seat the card in place until a click sound is produced."]
    },
    { stepTitle: "Install Power Supply", 
      desc: ["Align the mounting holes in the case with the power supply",
            "Insert screws and tighten."]
    },
    { stepTitle: "Connect Cables", 
      desc: ["Motherboard has two power conections, with two connectors specifically for SATA devices. The other\
            connectors are used for funs and other non-SATA devices.\
            Data cables connects drives and front panel devices to the motherboard."]
    },
    { stepTitle: "Wrap Up", 
      desc: ["When all the components are installed, reinstall the side panels of on the case.",
            "The computer is now ready to be turned on to configure the bios and operating system.",
            "This steps are excluded within this simulation as it only covers assembling"]
    },
    { stepTitle: "Maintainence", 
      desc: ["As time goes by, there will be dust occupying the PC. Use an air blower or a vacuum to remove excessive\
            dusts once every year, depending on the usage of the PC. For perform deep cleaning, disassemble the CPU cooler\
            and Graphic Card for thermal paste replacement."]
    },
  ]

  buildTypes = [
    { Type: "Budget PC", case: "b", caseFan: "b", 
      motherboard: "b", cpu: "b", cpuFan: "b", 
      memory: "b", storage: "b", gpu: "b", psu: "b", rewardPercent: 5 },
    { Type: "Workstation PC", case: "b", caseFan: "b", 
      motherboard: "b", cpu: "b", cpuFan: "b", 
      memory: "b", storage: "b", gpu: "b", psu: "b", rewardPercent: 10 },
    { Type: "Gaming PC", case: "b", caseFan: "b", 
      motherboard: "b", cpu: "b", cpuFan: "b", 
      memory: "b", storage: "b", gpu: "b", psu: "b", rewardPercent: 15 },
  ]

  constructor(
    private router: Router, 
    private engServ: EngineService, 
    private authService: AuthService,
    private orderService: OrderService,
    private simulationService: SimulationService,
    private toast: NgToastService) {
  }

  ngOnInit(): void {
    const storedUserId = this.authService.getUserId();
    if (storedUserId) {
      this.simulationService.getSessionByUserId(storedUserId).subscribe((session: Session[]) => {
        this.sessions = session.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
      });

      this.engServ.createScene(this.rendererCanvas);
      this.engServ.animate();
    } else {
      this.toast.warning({detail:"FAILED",summary:'Please login to access simulation!', duration:2000, position:'topCenter'});
      this.router.navigate(['/login']);
    }
  }


  startSession() {
    this.isSessionOngoing = true;
    this.isIntroModalActive = false;
    
    const selectedBuild = this.buildTypes.find(build => build.Type === this.buildOption);

    this.assemblySteps[0].stepTitle = "Hardware Parts of " + selectedBuild?.Type;
    this.assemblySteps[0].desc = ["Computer Case: :" + selectedBuild?.case,
                                  "Case Fan       :" + selectedBuild?.caseFan,
                                  "Motherboard    :" + selectedBuild?.motherboard,
                                  "Processor(CPU) :" + selectedBuild?.cpu,
                                  "CPU Fan        :" + selectedBuild?.cpuFan,
                                  "Memory(RAM)    :" + selectedBuild?.memory,
                                  "Storage Drive  :" + selectedBuild?.storage,
                                  "Graphics Card  :" + selectedBuild?.gpu,
                                  "Power Supply   :" + selectedBuild?.psu];
  
    this.isStepModalActive = true;
  }

  openStepModal(): void {
    this.isStepModalActive = true;
  }

  closeStepModal(): void {
    this.isStepModalActive = false;
  }
  
  openHelpModal(): void {
    this.isAboutModalActive = true;
  }

  closeHelpModal(): void {
    this.isAboutModalActive = false;
  }

  openNextStepModal(): void {
    if (this.step < this.assemblySteps.length) {
      this.step += 2;
      this.isStepModalActive = true;
    } else {
      this.onSessionComplete();
    }
  }

  onSessionComplete(): void {
    const selectedBuild = this.buildTypes.find(build => build.Type === this.buildOption);
    if (selectedBuild?.rewardPercent) {
      this.orderService.getVoucherByPercent(selectedBuild?.rewardPercent).subscribe((voucher: Voucher[]) => {
        this.earnedVoucherKey = voucher[0].key;
        this.isPostSessionModalActive = true;
      }, (error) => {
        console.log(error);
      })
    }
  }

  terminateSession(): void {
    this.isPostSessionModalActive = false;
    this.isSessionOngoing = false;
    this.step = 0;
    this.buildOption = "Budget PC";
    this.router.navigate(['/home']);
  }
  
  redirectToShop(): void {
    this.isPostSessionModalActive = false;
    this.isSessionOngoing = false;
    this.step = 0;
    this.buildOption = "Budget PC";
    this.router.navigate(['/shop']);
  }
}
