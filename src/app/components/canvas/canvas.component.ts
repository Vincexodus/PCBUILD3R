import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { EngineService } from '../../service/engine.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { OrderService } from '../../service/order.service';
import { Voucher } from '../../interface/voucher.model';
import { Session } from '../../interface/session.model';
import { UserService } from '../../service/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.sass'
})

export class CanvasComponent implements OnDestroy {
  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas!: ElementRef<HTMLCanvasElement>;
  vouchers!: Voucher[];
  sessions!: Session[];
  buildOption: string = "Budget PC";
  earnedVoucherKey: string = "";
  isIntroModalActive: boolean = true;;
  isStepModalActive: boolean = false; 
  isHelpModalActive: boolean = false;
  isPostSessionModalActive: boolean = false;
  isVoucherModalActive: boolean = false;
  isSessionOngoing: boolean = false;
  isBudgetAvailable: boolean = true;
  isWorkStationAvailable: boolean = true;
  isGamingAvailable: boolean = true;
  step: number = 1;
  addReviewForm: FormGroup;
  snapSuccessSubscription!: Subscription;
  
  partType = ["Computer Case", "Case Fan", "Motherboard", "Processor (CPU)", "CPU Fan", "Memory (RAM)", 
              "Storage Drive", "Graphics Card", "Power Supply"];

  partPrice = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  assemblySteps = [
    { stepTitle: "", 
      desc: [],
      note: "",
      caution: "",
      wait: false,
    },
    { stepTitle: "Picking Parts", 
      desc: ["First you will need these parts to build a computer.",
              "The parts include:",
              "1. Computer Case",
              "2. Case Fan",
              "3. Motherboard",
              "4. Processor(CPU)",
              "5. CPU Fan",
              "6. Memory(RAM)",
              "7. Storage Drive",
              "8. Graphics Card",
              "9. Power Supply"],
      note: "You will need screwdriver and ground strap (optional). In this simulation, \
                we will be excluding the assembling of wires.",
      caution: "Chosen parts must be compatible (they are chosen in this case).",
      wait: false,
    },
    { stepTitle: "Open and Prepare the Case.", 
      desc: ["Open the computer case by removing side panels. Find the screws that hold the\
                side panels in place.",
              "To prepare the case, remove any packaging materials that may have been shipped.\
                Double check the front panel connections like power switch, audio jacks and usb ports."],
      note: "Panel connections are required for I/O operations, power on and off (excluded in this simulation)",
      caution: "Case may have sharp edges. Handle with care to avoid injury. Always wear a grounding\
                strap when assembling.",
      wait: false,
    },
    { stepTitle: "Install Motherboard",
      desc: ["Install the I/O shield in the opening in the back of the case by pushing in from the inside.",
            "Install standoffs in the cases into mount the motherboard. Note: Each motherboard has different screw \
              hole locations.",
            "Lower motherboard into the case and align with the I/O sheild before securing it with screws."],
      note: "In this simulation, position the board into the case.",
      caution: "To prevent damage to the motherboard, it must only contact the standoffs and screws.",
      wait: true,
    },
    { stepTitle: "Install Case Fan", 
      desc: ["Align the mounting holes by holding the fan to mounting pad on the inside of the case.",
            "Insert the screws from the outside of the case and tighten."],
      note: "Ensure that installed case fans are pointing in the correct direction.",
      caution: "",
      wait: true,
    },
    { stepTitle: "Install Processor (CPU)", 
      desc: ["For Intel processor, find corner mark on the processor. For AMD processor, the corner is marked with an arrow.",
            "Lift the small metal rod next to the socket, make sure the markings are aligned correctly.",
            "Push the rod down to lock the procesor in place."],
      note: "Simulation has aligned the orientation of the processor, just position the chip onto cpu socket of motherboard",
      caution: "",
      wait: true,
    },
    { stepTitle: "Install First Memory (RAM)",
      desc: ["Check to see the notch in board is in correct location. Turn around 180 degrees otherwise.",
            "Press firmly on both ends of the memory stick into the socket. A click sound is made when tabs\
              are locked into place."],
      note: "Make sure to install the RAM sticks on 2 & 4th ram slot of motherboard if there are 4 ram slots. ",
      caution: "Make sure tabs aligned to prevent causing serious damage to the motherboard.",
      wait: true,
    },
    { stepTitle: "Install Second Memory (RAM)",
      desc: ["Check to see the notch in board is in correct location. Turn around 180 degrees otherwise.",
            "Press firmly on both ends of the memory stick into the socket. A click sound is made when tabs\
              are locked into place."],
      note: "Make sure to install the RAM sticks on 2 & 4th ram slot of motherboard if there are 4 ram slots. ",
      caution: "Make sure tabs aligned to prevent causing serious damage to the motherboard.",
      wait: true,
    },
    { stepTitle: "Install Storage",
      desc: ["Install M.2 solid state drive into M.2 slot of the motherboard (usally above PCLE slot). \
            Once SSD is fitted in, press down and secure the drive with small M.2 screw."],
      note: "",
      caution: "Make sure the ssd drive is lie flat on the motherboard",
      wait: true,
    },
    { stepTitle: "Install CPU Fan",
      desc: ["Place thermal compound to the CPU following the instructions provided.",
            "Set the fan assembly on the processor with mounting tabs aligned.",
            "Apply balanced screw pressure into each side of the motherboard.",
            "Connect the fan assembly's power connetor ot the motherboard.",
            "Some CPU fan contact area comes with protective layer, make sure to remove it before installing."],
      note: "Processor comes with stock fan, but in this simulation we'll be using air cooler from external brands",
      caution: "",
      wait: true,
    },
    { stepTitle: "Install Graphics Card",
      desc: ["Gently remove expansion slot cover of the graphics card. Unlock PCI expansion slot before lining the graphics card up with\
      it and firmly seat the card in place until a click sound is produced."],
      note: "",
      caution: "Budget Build has no GPU, given the processor chosen must have built-in graphics.",
      wait: true,
    },
    { stepTitle: "Install Power Supply", 
      desc: ["Align the mounting holes in the case with the power supply.",
            "Insert screws and tighten."],
      note: "Cables from power supply are required to power graphics card and motherboard (excluded in this simulation)",
      caution: "Make sure voltage provided by power supply is sufficient for chosen hardware",
      wait: true,
    },
    { stepTitle: "Connect Cables", 
      desc: ["Motherboard has two power conections, with two connectors specifically for SATA devices. The other\
            connectors are used for funs and other non-SATA devices.\
            Data cables connects drives and front panel devices to the motherboard."],
      note: "Connection of cables is excluded in this simulation.",
      caution: "",
      wait: false,
    },
    { stepTitle: "Wrap Up", 
      desc: ["When all the components are installed, reinstall the side panel of the case.",
            "The computer is now ready to be turned on to configure the bios and operating system.",
            "These steps are excluded within this simulation as it only covers assembling."],
      note: "",
      caution: "",
      wait: false,
    },
    { stepTitle: "Maintainence", 
      desc: ["As time goes by, there will be dusts occupying the PC. Use an air blower or a vacuum to remove excessive\
            dusts once every year, depending on the usage of the PC. To perform deep cleaning, disassemble the CPU cooler\
            and Graphics Card for dust cleaning and thermal paste replacement."],
      note: "",
      caution: "",
      wait: false,
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
    private userService: UserService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private toast: NgToastService) {
      
    this.addReviewForm = this.formBuilder.group({
      rating: ['1', [Validators.required, Validators.pattern('[1-5]{1}')]],
      desc: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    const storedUserId = this.authService.getUserId();
    if (storedUserId) {
      this.userService.getSessionByUserId(storedUserId).subscribe((session: Session[]) => {
        this.sessions = session;
        if (this.sessions) this.arrangeSession(this.sessions);
      });
    } else {
      this.toast.warning({detail:"FAILED",summary:'Please login to access simulation!', duration:2000, position:'topCenter'});
      this.router.navigate(['/login']);
    }

    this.snapSuccessSubscription = this.engServ.snapSuccess$.subscribe(() => {
      this.onAssemblyStepComplete();
    });
  }

  ngOnDestroy(): void {
    if (this.snapSuccessSubscription) this.snapSuccessSubscription.unsubscribe();
  }
  
  arrangeSession(sessions: Session[]) {
    if (sessions.length === 3) {
      this.toast.error({detail:"FAILED",summary:'You have completed all sessions. Please come again!', duration:3000, position:'topCenter'});
      this.terminateSession('/home');
    }
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
                        selectedBuild?.psuPrice];
      for (let i = 0; i < this.partPrice.length; i++) {
        totalPrice += this.partPrice[i];
      }
    }
    this.assemblySteps[0].note =  "Total Price - MYR " + totalPrice;

    // render canvas scene based on level
    if (selectedBuild) {
      if (selectedBuild.level === 1) this.assemblySteps[10].wait = false; 
      this.engServ.createScene(this.rendererCanvas, selectedBuild.level);
      this.isStepModalActive = true;
    }
  }

  openHelpModal(): void {
    this.isHelpModalActive = true;
  }

  closeHelpModal(): void {
    this.isHelpModalActive = false;
  }
  
  openStepModal(): void {
    this.isStepModalActive = true;
  }
  
  openNextStepModal(): void {
    const selectedBuild = this.buildTypes.find(build => build.Type === this.buildOption);
    if (this.step < this.assemblySteps.length) {
      this.step += 1;
      this.isStepModalActive = true;
      
      // if step require engine service to trigger
      if (this.assemblySteps[this.step-1].wait) {
        if (selectedBuild) this.engServ.loadNextModel(selectedBuild?.level, this.step);
      }
    }
  }

  closeStepModal(): void {
    this.isStepModalActive = false;
  }

  // trigger from engine only
  onAssemblyStepComplete(): void {
    this.toast.success({detail:"SUCCESS",summary:'You have completed step ' + this.step + '!', duration:2000, position:'topCenter'});
    setTimeout(() => {
      // show step model to proceed
      this.openNextStepModal();
    }, 2500);
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
        
        this.userService.createSession(storedUserId, this.earnedVoucherKey, selectedBuild.level, rating, desc).subscribe(() => {
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
    this.isStepModalActive = false
    this.toast.success({detail:"SUCCESS",summary:'Drag your mouse around to inspect!', duration:2000, position:'topCenter'});
    this.engServ.inspectModel();
  }
  
  terminateSession(dir: string): void {
    this.ngOnDestroy();
    this.engServ.ngOnDestroy();
    this.isPostSessionModalActive = false;
    this.isVoucherModalActive = false;
    this.isSessionOngoing = false;
    this.step = 1;
    this.buildOption = "Budget PC";
    this.router.navigate([dir]);
  }
}
