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
import { ProductService } from '../../service/product.service';

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
  isIntroModalActive: boolean = true;;
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

  partType = ["Computer Case", "Case Fan", "Motherboard", "Processor (CPU)", "CPU Fan", "Memory (RAM)", 
              "Storage Drive", "Graphics Card", "Power Supply"];

  partPrice = [0, 0, 0, 0, 0, 0, 0, 0, 0];

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
      stepImageCategory: "Case",
      stepImage: "",
      desc: ["Open the computer case by removing side panels. Find the screws that hold the\
                side panels in place.",
              "To prepare the case, remove any packaging materials that may have been shipped.\
                Double check the front panel connections like power switch, audio jacks and usb ports."],
      caution: "Case may have sharp edges. Handle with care to avoid injury. Always wear a grounding\
                strap when assembling."
    },
    { stepTitle: "Install Case Fan", 
      stepImageCategory: "Case Fan",
      stepImage: "",
      desc: ["Align the mounting holes by holding the fan to mounting pad on the inside of the case.",
            "Insert the screws from the outside of the case and tighten."],
      note: "Ensure that installed case fans are poitning in the correct direction.",
    },
    { stepTitle: "Install Motherboard",
      stepImageCategory: "Motherboard",
      stepImage: "",
      desc: ["Install the I/O shield in the opening in the back of the case by pushing in from the inside.",
            "Install standoffs in the cases into mount the motherboard. Note: Each motherboard has different screw \
              hole locations.",
            "Lower motherboard into the case and align with the I/O sheild before securing it with screws."],
      note: "To prevent damage to the motherboard, it must only contact the standoffs and screws.",
    },
    { stepTitle: "Install Processor (CPU)", 
      stepImageCategory: "CPU",
      stepImage: "",
      desc: ["For Intel processor, find corner mark on the processor. For AMD processor, the corner is marked with an arrow.",
            "Lift the small metal rod next to the socket, make sure the markings are aligned correctly.",
            "Push the rod down to lock the procesor in place."],
    },
    { stepTitle: "Install Memory (RAM)",
      stepImageCategory: "RAM",
      stepImage: "",
      desc: ["Check to see the notch in board is in correct location. Turn around 180 degrees otherwise.",
            "Press firmly on both ends of the memory stick into the socket. A click sound is made when tabs\
              are locked into place."],
      caution: "Make sure tabs aligned to prevent causing serious damage to the motherboard."
    },
    { stepTitle: "Install Storage",
      stepImageCategory: "Storage", 
      stepImage: "",
      desc: ["Install M.2 solid state drive into M.2 slot of the motherboard (usally above PCLE slot). \
            Once SSD is fitted in, press down and secure the drive with small M.2 screw."],
    },
    { stepTitle: "Install CPU Fan",
      stepImageCategory: "CPU Cooler",
      stepImage: "",
      desc: ["Place thermal compound to the CPU following the instructions provided.",
            "Set the fan assembly on the processor with mounting tabs aligned.",
            "Apply balanced screw pressure into each side of the motherboard.",
            "Connect the fan assembly's power connetor ot the motherboard.",
            "Some CPU fan contact area comes with protective layer, make sure to remove it before installing."],
    },
    { stepTitle: "Install Graphics Card",
      stepImageCategory: "GPU",
      stepImage: "",
      desc: ["Gently remove expansion slot cover of both graphics card and case. Line the graphics card up with\
      PCI expansion slot and firmly seat the card in place until a click sound is produced."],
      caution: "Budget Build has no GPU, given the processor chosen must have built-in graphics."
    },
    { stepTitle: "Install Power Supply", 
    stepImageCategory: "PSU",
      stepImage: "",
      desc: ["Align the mounting holes in the case with the power supply.",
            "Insert screws and tighten."],
    },
    { stepTitle: "Connect Cables", 
      desc: ["Motherboard has two power conections, with two connectors specifically for SATA devices. The other\
            connectors are used for funs and other non-SATA devices.\
            Data cables connects drives and front panel devices to the motherboard."],
      caution: "Conneciton of cables is excluded in this simulation.",
    },
    { stepTitle: "Wrap Up", 
      desc: ["When all the components are installed, reinstall the side panel of the case.",
            "The computer is now ready to be turned on to configure the bios and operating system.",
            "This steps are excluded within this simulation as it only covers assembling."],
      caution: "Reinstallation of side panel is exluded in this simulation.",
    },
    { stepTitle: "Maintainence", 
      desc: ["As time goes by, there will be dust occupying the PC. Use an air blower or a vacuum to remove excessive\
            dusts once every year, depending on the usage of the PC. For perform deep cleaning, disassemble the CPU cooler\
            and Graphic Card for thermal paste replacement."],
    },
  ]

  buildTypes = [
    { 
      Type: "Budget PC",
      case: "NZXT White H510 Compact ATX", casePrice: 238.80,
      caseFan: "White Noname", caseFanPrice: 20,
      motherboard: "ASUS PRIME H510M", motherboardPrice: 365.65,
      cpu: "Intel Core i3-12100 Quad-core", cpuPrice: 584.28,
      cpuFan: "CPU Cooler Noname", cpuFanPrice: 25,
      memory: "Kingston HyperX Fury 2*8GB 2666MHz", memoryPrice: 199.99,
      storage: "HP NVMe M.2 SSD PCle 256GB", storagePrice: 225,
      gpu: "None", gpuPrice: 0, 
      psu: "Cooler Master Elite NEX PN500 (500W)", psuPrice: 149,
      level: 1, rewardPercent: 5 
    },
    { 
      Type: "Workstation PC", 
      case: "Fractal Design Meshify C", casePrice: 659.88,
      caseFan: "Corsair AF120", caseFanPrice: 573.19,
      motherboard: "ARDOR GAMING B550M", motherboardPrice: 398.53,
      cpu: "AMD Ryzen 5 5600X", cpuPrice: 769,
      cpuFan: "COOLER MASTER Hyper H412R Universal Socket", cpuFanPrice: 188.02,
      memory: "Corsair Dominator Platinum RGB White 2*8GB 3200Mhz", memoryPrice: 402.04,
      storage: "HP NVMe M.2 SSD PCle 256GB", storagePrice: 225,
      gpu: "GeForce RTX 3060 Ti Eagle OC 8GB", gpuPrice: 2400, 
      psu: "Cooler Master Elite NEX PN500 (600W)", psuPrice: 165, 
      level: 2, rewardPercent: 10 
    },
    {
      Type: "Gaming PC", 
      case: "DEEPCOOL MATTREXX 55 V3", casePrice: 286.83,
      caseFan: "Tecware Arc Spectrum", caseFanPrice: 123,
      motherboard: "ROG Strix B550-F Gaming", motherboardPrice: 1059,
      cpu: "AMD Ryzen™ 7 7800X3D", cpuPrice: 1909,
      cpuFan: "COOLER MASTER Hyper 212 Spectrum V2", cpuFanPrice: 126.30,
      memory: "G Skill Trident Z Neo DDR4 2*16GB 3600Mhz", memoryPrice: 1198,
      storage: "HP NVMe M.2 SSD PCle 256GB", storagePrice: 225,
      gpu: "GeForce RTX 3080 Founders Edition", gpuPrice: 3057.79,
      psu: "Cooler Master MWE BRONZE V2 Series (750W)", psuPrice: 309, 
      level: 3, rewardPercent: 15 
    }
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
          this.startSession(); // temp
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

    let totalPrice = 0;
    if (selectedBuild) {
      this.assemblySteps[0].stepTitle = "Hardware Parts of " + selectedBuild?.Type;
      this.assemblySteps[0].desc = [selectedBuild?.case, selectedBuild?.caseFan, selectedBuild?.motherboard, selectedBuild?.cpu, 
                                    selectedBuild?.cpuFan, selectedBuild?.memory, selectedBuild?.storage, selectedBuild?.gpu, selectedBuild?.psu ];
      this.partPrice = [selectedBuild?.casePrice, selectedBuild?.caseFanPrice, selectedBuild?.motherboardPrice, selectedBuild?.cpuPrice, 
                        selectedBuild?.cpuFanPrice, selectedBuild?.memoryPrice, selectedBuild?.storagePrice, selectedBuild?.gpuPrice, 
                        selectedBuild?.psuPrice ];
      for (let i = 0; i < this.partPrice.length; i++) {
        totalPrice += this.partPrice[i];
      }
    }
    this.assemblySteps[0].note =  "Total Price - MYR " + totalPrice;

    // render canvas scene based on level
    if (selectedBuild) {
      this.engServ.createScene(this.rendererCanvas, selectedBuild?.level);
      this.isStepModalActive = false; // temp
    }
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

  inspectModel(): void {
    this.engServ.inspectModel();
  }
  

  restartSession(): void {
    this.startSession();
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
