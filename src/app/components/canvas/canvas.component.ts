import { Component, ElementRef, ViewChild } from '@angular/core';
import { EngineService } from '../../service/engine.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { OrderService } from '../../service/order.service';
import { Voucher } from '../../interface/voucher.model';
import { SessionService } from '../../service/session.service';
import { Session } from '../../interface/session.model';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
  isVoucherModalActive: boolean = false;
  isSessionOngoing: boolean = false;
  isBudgetAvailable: boolean = true;
  isWorkStationAvailable: boolean = true;
  isGamingAvailable: boolean = true;
  step: number = 0;
  addReviewForm: FormGroup;

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
              "12. Ground Strap (optional)"],
      note: "In this simulation, we will be excluding the assembling of wires.",
      caution: "Chosen parts must be compatible (they are chosen in this case)."
    },
    { stepTitle: "Open and Prepare the Case.", 
      desc: ["Open the computer case by removing side panels. Find the screws that hold the\
                side panels in place.",
              "To prepare the case, remove any packaging materials that may have been shipped.\
                Double check the front panel connections like power switch, audio jacks and usb ports."],
      caution: "Case may have sharp edges. Handle with care to avoid injury. Always wear a grounding\
                strap when assembling."
    },
    { stepTitle: "Install Case Fan", 
      desc: ["Align the mounting holes by holding the fan to mounting pad on the inside of the case.",
            "Insert the screws from the outside of the case and tighten."],
      note: "Ensure that installed case fans are poitning in the correct direction.",
    },
    { stepTitle: "Install Motherboard", 
      desc: ["Install the I/O shield in the opening in the back of the case by pushing in from the inside.",
            "Install standoffs in the cases into mount the motherboard. Note: Each motherboard has different screw \
              hole locations.",
            "Lower motherboard into the case and align with the I/O sheild before securing it with screws."],
      note: "To prevent damage to the motherboard, it must only contact the standoffs and screws.",
    },
    { stepTitle: "Install Processor (CPU)", 
      desc: ["For Intel processor, find corner mark on the processor. For AMD processor, the corner is marked with an arrow.",
            "Lift the small metal rod next to the socket, make sure the markings are aligned correctly.",
            "Push the rod down to lock the procesor in place."],
    },
    { stepTitle: "Install CPU Fan", 
      desc: ["Place thermal compound to the CPU following the instructions provided.",
            "Set the fan assembly on the processor with mounting tabs aligned.",
            "Apply balanced screw pressure into each side of the motherboard.",
            "Connect the fan assembly's power connetor ot the motherboard.",
            "Some CPU fan contact area comes with protective layer, make sure to remove it before installing."],
    },
    { stepTitle: "Install Memory (RAM)",
      desc: ["Check to see the notch in board is in correct location. Turn around 180 degrees otherwise.",
            "Press firmly on both ends of the memory stick into the socket. A click sound is made when tabs\
              are locked into place."],
      caution: "Make sure tabs aligned to prevent causing serious damage to the motherboard."
    },
    { stepTitle: "Install Storage", 
      desc: ["Install M.2 solid state drive into M.2 slot of the motherboard (usally above PCLE slot). \
            Once SSD is fitted in, press down and secure the drive with small M.2 screw."],
    },
    { stepTitle: "Install Graphics Card", 
      desc: ["Gently remove expansion slot cover of both graphics card and case. Line the graphics card up with\
            PCI expansion slot and firmly seat the card in place until a click sound is produced."],
    },
    { stepTitle: "Install Power Supply", 
      desc: ["Align the mounting holes in the case with the power supply.",
            "Insert screws and tighten."],
    },
    { stepTitle: "Connect Cables", 
      desc: ["Motherboard has two power conections, with two connectors specifically for SATA devices. The other\
            connectors are used for funs and other non-SATA devices.\
            Data cables connects drives and front panel devices to the motherboard."],
    },
    { stepTitle: "Wrap Up", 
      desc: ["When all the components are installed, reinstall the side panels of on the case.",
            "The computer is now ready to be turned on to configure the bios and operating system.",
            "This steps are excluded within this simulation as it only covers assembling."],
    },
    { stepTitle: "Maintainence", 
      desc: ["As time goes by, there will be dust occupying the PC. Use an air blower or a vacuum to remove excessive\
            dusts once every year, depending on the usage of the PC. For perform deep cleaning, disassemble the CPU cooler\
            and Graphic Card for thermal paste replacement."],
    },
  ]

  buildTypes = [
    { Type: "Budget PC", case: "b", caseFan: "b", 
      motherboard: "b", cpu: "b", cpuFan: "b", 
      memory: "b", storage: "b", gpu: "b", psu: "b", level: 1, rewardPercent: 5 },
    { Type: "Workstation PC", case: "b", caseFan: "b", 
      motherboard: "b", cpu: "b", cpuFan: "b", 
      memory: "b", storage: "b", gpu: "b", psu: "b", level: 2, rewardPercent: 10 },
    { Type: "Gaming PC", case: "b", caseFan: "b", 
      motherboard: "b", cpu: "b", cpuFan: "b", 
      memory: "b", storage: "b", gpu: "b", psu: "b", level: 3, rewardPercent: 15 },
  ]

  constructor(
    private router: Router, 
    private engServ: EngineService, 
    private authService: AuthService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private toast: NgToastService) {
      
    this.addReviewForm = this.formBuilder.group({
      rating: ['1', [Validators.required, Validators.pattern('[1-5]{1}')]],
      desc: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    const storedUserId = this.authService.getUserId();
    if (storedUserId) {
      this.sessionService.getSessionByUserId(storedUserId).subscribe((session: Session[]) => {
        this.sessions = session;
        if (this.sessions) {
          this.arrangeSession(this.sessions);
        }
      });
    } else {
      this.toast.warning({detail:"FAILED",summary:'Please login to access simulation!', duration:2000, position:'topCenter'});
      this.router.navigate(['/login']);
    }
  }

  arrangeSession(sessions: Session[]) {
    for (const session of sessions) {
      switch (session.level) {
        case 1: // Budget
          this.isBudgetAvailable = false;
          break;
        case 2: // Workstation
          this.isWorkStationAvailable = false;
          break;
        case 3: // Gaming
          this.isGamingAvailable = false;
          break;
        default:
          break;
      }
    }
    
    if (sessions.length === 3) {
      this.toast.error({detail:"FAILED",summary:'You have completed all sessions. Please come again!', duration:3000, position:'topCenter'});
      this.terminateSession('/home');
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
    
    // Render scene level
    if (selectedBuild) {
      this.engServ.createScene(this.rendererCanvas, selectedBuild?.level);
      this.engServ.animate();
    }
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
      this.toast.success({detail:"SUCCESS",summary:'You have completed the step!', duration:2000, position:'topCenter'});
      this.step += 1;
      this.isStepModalActive = true;
    }
  }
  
  openPostSessionModal(): void {
    this.isPostSessionModalActive = true;
    this.isStepModalActive = false
  }

  onSessionComplete(): void {
    const storedUserId = this.authService.getUserId();
    const selectedBuild = this.buildTypes.find(build => build.Type === this.buildOption);
    if (storedUserId && selectedBuild && this.addReviewForm.valid) {
      const rating = this.addReviewForm.get('rating')?.value;
      const desc = this.addReviewForm.get('desc')?.value;
      // create voucher for new session
      this.orderService.createVoucher(selectedBuild.rewardPercent, true).subscribe((voucher: Voucher) => {
        this.earnedVoucherKey = voucher.key;
        
        this.sessionService.createSession(storedUserId, this.earnedVoucherKey, selectedBuild.level, rating, desc).subscribe(() => {
          this.isPostSessionModalActive = false;
          this.isVoucherModalActive = true;
          this.toast.success({detail:"SUCCESS",summary:'You have earned a voucher!', duration:2000, position:'topCenter'});
          
        }, (error) => {
          console.log(error);
        })

      }, (error) => {
        console.log(error);
      })
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }

  terminateSession(dir: string): void {
    this.isPostSessionModalActive = false;
    this.isVoucherModalActive = false;
    this.isSessionOngoing = false;
    this.step = 0;
    this.buildOption = "Budget PC";
    this.router.navigate([dir]);
  }
}
