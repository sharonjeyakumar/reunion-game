const ostmainMenu = "ost/mainmenu.mp3";
const mainMenuTheme = new Audio(ostmainMenu);
mainMenuTheme.loop = true;

const fxclickSound = "ost/shutter-click.wav";
const clickSound = new Audio(fxclickSound);

const fxchoiceSound = "ost/choicesound.mp3";
const choiceSound = new Audio(fxchoiceSound);

const fxchoiceConfirm = "ost/choiceconfirm.mp3";
const choiceConfirm = new Audio(fxchoiceConfirm);



let audioUnlocked = false;
function unlockAndPlayFirstClick() {
  if (!audioUnlocked) {
    audioUnlocked = true;

    // Preload all sounds
    [mainMenuTheme, clickSound, choiceSound, choiceConfirm].forEach(snd => {
      snd.load();
    });

    // Play click sound first, then theme
    clickSound.currentTime = 0;
    clickSound.play()
      .then(() => {
        setTimeout(() => {
          mainMenuTheme.currentTime = 0;
          mainMenuTheme.play().catch(err => {
            console.warn("Theme failed:", err);
          });
        }, 150); // delay so they don't overlap abruptly
      })
      .catch(err => {
        console.warn("Click sound failed:", err);
      });

  } else {
    playSound(clickSound);
  }
}
function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(err => {
    console.warn("Sound play failed:", err);
  });
}


let titleShown = false;
let isGameScreen = false;

document.body.addEventListener('click', function(e) {
    const effect = document.createElement('div');
    effect.classList.add('click-effect');
    effect.style.left = e.pageX + 'px';
    effect.style.top = e.pageY + 'px';

    // Create dot
    const dot = document.createElement('div');
    dot.classList.add('dot');
    effect.appendChild(dot);

    // Create ring
    const ring = document.createElement('div');
    ring.classList.add('ring');
    effect.appendChild(ring);

    document.body.appendChild(effect);

    // Remove effect after animation ends
    ring.addEventListener('animationend', () => {
      effect.remove();
    });
  });

  function stopMenuTheme() {
    mainMenuTheme.currentTime = 0;
  mainMenuTheme.pause();
}

const app = document.getElementById('app');
const dbox = document.getElementById('dbox');
const env = document.getElementById('env');

const gameScreen = document.getElementById('gameScreen');
const profile = document.getElementById('profile');

const titleContainer = document.querySelector('.title');
const creditsContainer = document.querySelector('.credits');
const backBtn = document.getElementById('backBtn');

app.addEventListener('click', () => {
  if (!isGameScreen) {
    if (!titleShown) {
      unlockAndPlayFirstClick(); // plays clickSound immediately
      titleContainer.classList.add('show');
      creditsContainer.classList.add('show');
      titleShown = true;
    } else {
      playSound(clickSound); // later clicks
      isGameScreen = true;
      stopMenuTheme();
        setTimeout(stopMenuTheme, 50);
      app.style.transition = 'opacity 0.2s ease';
      app.style.opacity = '0';
      setTimeout(() => {
        app.style.backgroundImage = 'none';
        // GAMESCREEN.style.backgroundImage = "url(images/bgf.png)";
        app.style.opacity = '1';
        app.classList.add('gameMode');
        // profile.offsetHeight;
        // profile.classList.add('show');
      }, 300);

      mainMenu.style.opacity = 0;
      setTimeout(() => {
        mainMenu.style.display = 'none';
        gameScreen.style.display = 'block';
        
      }, 500);
      setTimeout(() => {
        addDialogue();
        // backBtn.classList.add('show');
      }, 1000);
    }
  }
});

// const profileNames = [
//     "simson", "sharon", "sharvesh", "tharun", "syed", 
//     "varshan", "dhanush", "vikaas", "vishalr", "vishalkumar", 
//     "yuvaneshar", "subish", "sofiawari", "vel"
// ];

// Preload profile images
// const preloadedProfiles = {};
// profileNames.forEach(name => {
//     const img = new Image();
//     img.src = `profile/${name}.png`;
//     preloadedProfiles[name] = img;
// });

// Optional: preload 'none' as transparent
// const noneImg = new Image();
// noneImg.src = "";
// preloadedProfiles['none'] = noneImg;

let profileActivated = false; // track if profile has been shown once

// function switchProfile(newProfile) {
//     if (!newProfile || newProfile === 'none') {
//         if (!profileActivated) {  
//             // Before first profile, keep hidden
//             profile.style.display = 'none';
//         } else {
//             // After first profile, clear image but stay visible
//             profile.style.backgroundImage = 'none';
//         }
//         return;
//     }

//     const img = preloadedProfiles[newProfile];
//     if (!img) {
//         if (!profileActivated) {
//             profile.style.display = 'none';
//         } else {
//             profile.style.backgroundImage = 'none';
//         }
//         return;
//     }

//     // Show profile with new image
//     profile.style.display = 'block';
//     profile.style.backgroundImage = `url('${img.src}')`;
//     profile.style.backgroundSize = 'cover';
//     profile.style.backgroundPosition = 'center';

//     profileActivated = true; // ✅ lock it as active forever
// }


// Preload environment images
// const envNames = [
//   "email", "hall", "bgf", /* add all your env names here */
// ];

// const preloadedEnvs = {};
// envNames.forEach(name => {
//     const img = new Image();
//     img.src = `env/${name}.png`;
//     preloadedEnvs[name] = img;
// });


//Mainmenu 
const mainMenu = document.getElementById('mainMenu');
const playBtn = document.getElementById('playBtn');


//Game Scene

let currentScene = "intro";
let currentDialogue = 0;
let dialogue = [];
let choicesShown = false;
let suppressClickSound = false;

function renderScene(){
    const scene = scenes[currentScene];
    currentDialogue = 0;
    dialogue = scene.text;
    choicesShown = false;
}

let currentMusic = null;
function musicHandler(ost){
    if(!ost) return;

    if(currentMusic){
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
    currentMusic = new Audio(`ost/${ost}`);
    currentMusic.currentTime = 0;
    currentMusic.play().catch(err => {
        console.warn(`Music "${ost}" failed to play:`, err);
    })
}

function addDialogue(){
    if(currentDialogue <= dialogue.length-1){
        const line = dialogue[currentDialogue];
        const dialogueContainer = document.createElement('div');
        dialogueContainer.classList.add('dialogueContainer');

        const element = document.createElement('h2');
        element.textContent = line.text;
        dialogueContainer.appendChild(element);
        element.classList.add('dialogue');
                                                 
        gameScreen.appendChild(dialogueContainer);

        if (line.music) {
            musicHandler(line.music);
        }

        if (line.musicStop && currentMusic) {
            currentMusic.pause();
            currentMusic.currentTime = 0;
            currentMusic = null;
        }

        if(line.profile){
        //    switchProfile(line.profile);
        } else if(line.profile === 'none'){
            profile.style.backgroundImage = 'none';
        }

        if(line.color){
            dialogueContainer.style.color = line.color;
        }

        if (line.env) {
        // const envImg = preloadedEnvs[line.env];
        // if (envImg) {
        //     // env.style.backgroundImage = `url('${envImg.src}')`;
        // } else {
        //     // env.style.backgroundImage = 'none';
        // }
    }

        setTimeout(() => {
            element.classList.add('show');
            dialogueContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
            if(!choicesShown && !suppressClickSound){

            }
            suppressClickSound = false;
        }, 50);

        currentDialogue++; 
    } else if (!choicesShown){
        choicesShown= true;
        const scene = scenes[currentScene];

        if(scene.continue){
            currentScene = scene.continue[0].next;
            renderScene();
            addDialogue();
        } else if(scene.choices){
            showChoices(scenes[currentScene].choices);
            playSound(choiceSound);
        }
    }
};

function showChoices(choices) {
    const choicesContainer = document.createElement('div');
    choicesContainer.classList.add('choicesContainer');

    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.classList.add('choiceBtn');
        btn.textContent = choice.text;
        setTimeout(()=>{
            btn.classList.add('show');
            choicesContainer.scrollIntoView({ behavior: 'smooth', block: 'end'});
        })
        btn.onclick = ()=>{
            suppressClickSound = true;
            clickSound.pause();
            clickSound.currentTime = 0;
            
            choiceConfirm.play();
            choiceConfirm.currentTime = 0;
            btn.style.pointerEvents = "none";
            const container = btn.parentElement;
            container.querySelectorAll('.choiceBtn').forEach(b => {
            if (b !== btn) {
                b.style.opacity = '0.5'; 
                b.disabled = true;       
            } else {
                b.style.opacity = '1';
            }
        });
            currentScene = choice.next;
            renderScene();
           
        }
        choicesContainer.appendChild(btn);
        
    });
    gameScreen.appendChild(choicesContainer);
}

function pastDialogues(){
    const allDialogues = gameScreen.querySelectorAll('h2');
    allDialogues.forEach(dialogue => {
        dialogue.style.color = 'gray';
    });
}

gameScreen.addEventListener('click', () => {
    
    addDialogue();
});

const chapterColor = '#ca4646ff';

const scenes = {
    intro: {
        text: [
            {text: `Scene 1 - Everyone's inbox`, color:`${chapterColor}`, env:'email'},
            {text: `Simson\nSubject: PSNA CSE D Batch Reunion – Special Night!`},
            {text: `Simson stares at the screen, adjusting his glasses.` ,profile:"simson"},
            {text: `“Hmm… maybe nvidia will be there… research break for one night won’t hurt.”`},
            {text: `He clicks “Yes,” hiding a tab that definitely isn’t research.`},
            {text: `Sharon\nSubject: Let’s reunite in the Lord’s joy!`,profile:"none"},
            {text: `“This is it… a hall full of sinners ready to be saved. By the end of the night, half of them will be Christians. The other half… well, I’ll work on them next time.”`, profile:'sharon'},
            {text: `“The Lord moves in mysterious ways… so do I 😉.”`},
            {text: `Sharvesh\nSubject: Come meet your old friends!`,profile:`none`},
            {text: `“Murder rate in the city’s low this week. I can afford to attend....Time to seek some revenge”`,profile:'sharvesh'},
            {text: `He doesn’t notice the anonymous sender’s address isn’t PSNA’s usual domain.`,profile:'none'},
            {text: `Tharun\nSubject: Come with your twin spirit! Show us the prime time prime bro`},
            {text: `“Finally… a chance to show them I made it. Time to be the superior twin. It is my PRIME TIME”`, profile:'tharun'},
            {text: `Syed\nSubject: Big gathering, big opportunities.`,profile:'none'},
            {text: `“Maybe I can move some barrels… call it charity work.”`, profile:"syed"},
            {text: `Varshan\nSubject: Old friends new deals!`,profile:'none'},
            {text: `Varshan leans back in his chair at the brothel office, counting cash.`, profile:'varshan'},
            {text: `“Reunion night? Business can wait… or maybe I’ll recruit some talent.”`},
            {text: `Dhanush\nSubject: Bring your family!`,profile:'none'},
            {text: `“Varshan’s coming? Great… just great.”`, profile:'dhanush'},
            {text: `Vikaas\nSubject: Special guest appearance.`,profile:'none'},
            {text: `“Finally, an audience without cameras… I think.”`,profile:'vikaas'},
            {text: `Vishal R\nSubject: See your old batchmates!`,profile:'none'},
            {text: `“Amma, can I get Uber money for this?”`},
            {text: `"Ok ma then i can't go there."`},
            {text: `Vishal Kumar\nSubject: It’s been a while… friends!`,profile:'none'},
            {text: `“I could skip… but Sofa will be there.”`},
            {text: `A faint smirk forms.`},
            {text: `“That’s reason enough.”`},
            {text: `Yuvaneshar\nSubject: A family reunion… or something else?`},
            {text: `Yuvaneshar scrolls through the email, side-eyeing 8 across the room.`},
            {text: `“Married life is… fine. But PSNA reunions?, He exhales.”`},
            {text: `“If the old gang’s coming… I better keep my guard up.”`},
            {text: `Subish\nSubject: We might need your help.`},
            {text: `Subish reads the invite and grins.,`,profile:'subish'},
            {text: `“Sounds ominous… but I’ll bring my medical kit… and drugs."`},
            {text: `He pats his bag, where the paracetamol sits next to syringes of… less-than-legal substances.`},
            {text: `“For… emergencies, of course.”`},
            {text: `Sofiawari\nSubject: Simson will be there.`},
            {text: `"Finally… maybe tonight I’ll tell him.”, She sighs dreamily.`},
            {text: `Vel\nSubject: The King returns.`,profile:'none'},
            {text: `“They’ve forgotten who the Sulerumbu King is. Time to remind them.”`},
            {text: `He adjusts his shades and clicks “Yes” on the RSVP.`},
            {text: `Shri Ram & Sri Dhanush\nSubject: Custody battle can wait… the reunion won’t.`},
            {text: `They look at each other.`},
            {text: `“They haven’t forgotten? Good.”`},
            {text: `Both silently wonder if this is their chance to win over Sri Varshan — or at least ruin the other’s chances.`},
            {text: `Scene 2 – “The Hall, 7:45 PM”`,color:`${chapterColor}`,env:'none'},
            {text: `Camera pans over PSNA’s decorated alumni hall — plastic flowers, banners with "The Reunion of psna family"`},
            {text: `Order of Arrivals`},
            {text: `Sharvesh – walks in first, scanning for threats like he’s on duty. He thinks the “DJ” is a suspect.`},
            {text: `Sharon – carrying a Bible in one hand, He scans the crowd with a preacher’s smile.`},
            {text: `"The Lord moves in mysterious ways… so do I.", he whispers`},
            {text: `Sofiawari – peeks in, spots Simson nowhere yet, clutches her dupatta nervously.`},
            {text: `Tharun – steps in with his brand new adidas, slow motion, clearly trying to outshine his twin (who isn’t even there yet).`},
            {text: `Syed – drops off a suspiciously heavy duffel bag near the snacks table.`},
            {text: `Varshan – flanked by two “assistants” from his “business,” starts networking instantly.`},
            {text: `Yuvaneshar & 8– clearly mid-argument as they ente`},
            {text: `Vishal Kumar – pretends to wave at “everyone,” as he thinks to himself has sofa arrived.`},
            {text: `Subish – wearing a doctor’s coat over party clothes, pockets clinking with contraband.`},
            {text: `Shri Ram & Sri Dhanush – arrive together but clearly not speaking.`},
            {text: `Shri Ram, wearing his Ajith Kumar Makkal Mandram party scarf, scans the room like it’s a political rally.`},
            {text: `“This is not just a reunion… it’s a campaign opportunity.”`},
            {text: `Simson – finally walks in late, laptop bag slung over shoulder, smelling faintly of… not research.`},
            {text: `You catch the faintest sound of footsteps—muted, as though the shoes themselves were fitted with silencers.`},
            {text: `The footsteps cease, and from beyond the door comes a language you don’t recognize—foreign, tribal, neither English nor Tamil.`},
            {text: `You recognize that the door is locked from the inside stopping the strangers from entering.`},
            {text: `As you consider opening the door, a commotion suddenly erupts inside.`}
        ],
        choices: [
            { text: "Open the door", next: "zuru_twins_arrives" },
            { text: "Check what the commotion is about", next: "pistol_monkey_game" }
        ]
    },

    zuru_twins_arrives: {
        text: [
            { text: "You open the lock."},
            { text: `The double doors slam open so hard they rattle on their hinges.`,music:'sulleraiya.mp3'},
            { text: `Deep drumbeats echoes across the hall — BOOM.`},
            { text: `Two midgets in glittery red vests march in.`},
            { text: `One bangs tiny golden drums in a pounding rhythm`},
            { text: `The other carries something wrapped in red silk on a golden cushion.  `},
            { text: `"The King is coming! The Sulerumbu King is coming!" they shout in unison`},
            { text: `The DJ freezes mid-scratch.`},
            { text: `Lights drop to a dim red glow.`},
            { text: `A smoke machine hisses, filling the floor with low clouds. `},
            { text: `In the distance, a slow sitar riff begins, weaving with the drumbeats.`},
            { text: `From the haze, Vel emerges.`},
            { text: `He wears black shades, his expression unreadable.`},
            { text: `A long red silk shawl trails behind him like a comet’s tail.`},
            { text: `The first midget walks ahead of him, scattering **sugar crystals** onto the floor with every step — crunch, crunch, crunch.`},
            { text: `Vel stops in the center of the hall. `},
            { text: `The music dips into silence except for the slow thump of the drums.`},
            { text: `The second midget steps forward.`},
            { text: `With a dramatic flourish, he whips away the red silk to reveal…`},
            { text: `A crown carved entirely from sugarcane, shaped into the head of a giant ant, its mandibles sharp, the round butt jutting proudly out at the back like a strange royal seal.`},
            { text: `The crowd gasps. The midget rises on tiptoe, lifting the heavy crown, and gently lowers it onto Vel’s head.`},
            { text: `The drums stop.`},
            { text: `A beat of silence.`},
            { text: `Vel grips the mic.`},
            { text: `He looks over the crowd, smirks, and says:`},
            { text: `"Tonight… the kingdom of Sulerumbu extends to PSNA Hall! All who kneel before the ant shall rise as legends!"`, musicStop: "sulleraiya.mp3"},
            { text: `For a split second, there’s stillness.`},
        ],
        choices: [
            { text: "Clap", next: "vel_ally" },
            { text: "Mock him", next: "vel_enemy" }
        ]
    },

    vel_ally: {
        text: [
            {text: `You clap loudly. Vel locks eyes with you and nods approvingly.`},
            {text: `You’ve gained +2 Respect from the Sulerumbu King.`}
        ],
        continue: [
            { next: "pistol_monkey_game"}
        ]
    },

    vel_enemy: {
        text: [
            {text: `"Oi, is this an erumbu circus or what?"`},
            {text: `Vel’s grin fades. You’ve gained +2 Rivalry with Vel.`}
        ],
        continue: [
            { next: "pistol_monkey_game"}
        ]
    },

    pistol_monkey_game: {
        text: [
            { text: "Sharvesh is mid-argument when suddenly—" },
            { text: "Sriram swoops in from behind, locking both of Sharvesh’s arms at the elbows." },
            { text: "Sriram (laughing): \"Unga appan Ramesh-ta thirudniya—\"" },
            { text: "Dhanush (cutting in): \"Illa mama, avan IV ku trekking poren. Forest la protection venum nu sollirupa… Apdiya pa, department la IV la kuptu porangala nu DSP yum nambirupan.\"" },
            { text: "Varshan joins in, grabbing Sharvesh’s shoulders and pinning him tighter so he can’t twist away." },
            { text: "Varshan (grinning at Dhanush): \"Dei, time waste pannaama eduda punda!\"" },
            { text: "Sharvesh (struggling): \"Dei! Adhu government property da, loosu!\"" },

            { text: "Sri Dhanush yanks the pistol from Sharvesh’s holster with a flourish, then flicks it through the air toward Sriram." },
            { text: "The pistol spins, glinting under the disco lights—but before Sriram’s hands can close around it, Sri Varshan dives in from the side, snatching it mid-flight." },
            { text: "His grip falters; his finger slips onto the trigger—" },
            { text: "A deafening BANG echoes." },
            { text: "Clutching his chest silently, then slowly collapses to the floor without a sound." },
            { text: "Pandi lies motionless on the floor," },
            { text: "The entire hall falls into a stunned, breathless silence." },

            { text: "The loud BANG sends the hall into chaos." },
            { text: "People shout, pushing and shoving as all eyes turn to Sri Varshan — the one holding the smoking pistol." },
            { text: "Crowd member 1: \"un payan veliya katitan da sriram!\"" },
            { text: "Crowd member 2: \"Edhuku ivan gun eduthan\"" },

            { text: "Suddenly, Subish pushes through the people, wearing his doctor’s coat over party clothes. His pockets clink with paracetamol bottles and syringes." },
            { text: "Subish (shouting): \"dei punda nagaruda, I’m a doctor! I’ll take care of him!\"" },
            { text: "He lunges toward Pandi, who’s lying on the floor." },
            { text: "Subish (muttering): \"Paracetamol for anesthesia… not exactly ideal, but it’s all I have! hope i had acetophenone with me\"" },
            { text: "He fumbles with the bottle and syringe, trying to prepare the injection as the crowd keeps yelling and pushing." },
            { text: "The chaos intensifies as Dhanush and Sriram lock eyes across the hall." },
            { text: "Sriram (grinning): \"Enna da, Dhanush? Un payan veliya katitan\"" },
            { text: "Dhanush (snarling): \"Un paiyan unna maariye pannitan!\"" },
            { text: "Dhanush: yenda arivu iruka da punda (points at Sri Varshan)" },
            { text: "Tharun: Super bro ungala vitu master shifu va kalyana pannathu nala avana sootutinga" },
            { text: "Sri Varshan: Brooooo apdilam illa" },
            { text: "Tharun: Neenga master shifu va than bro kondrukanum" },
            { text: "Syed: Therinchite nadipa poduran paaru" },
            { text: "Dhanush: Varshan vai potu vai potu avana maariye pesuringale bro" },
            { text: "Tharun: dei epa enda enna gang bang panna varinga. Annaiya yenna achu" },
            { text: "Sriram: ava sethu ta annaiya" },
            { text: "Vishal kumar: Oh my god eppo?" },
            { text: "Sri Dhanush: Already avanga la relationship irukanga. family ya murder pannirukanga" },
            { text: "Sri Varshan: Unga appana maari illa seriya" },
            { text: "Syed: Avaru appa kudaiyum irukiya da varsha. Inno DILF fantasy ya vidalaiya da" },
            { text: "Sri Varshan: Unga appa rizwan maari illa" },

            { text: "Subish (determined): \"Wait, da! I need to check something.\"" },
            { text: "(Subish unbuttons Pandi’s shirt slowly, revealing multiple stab wounds.)" },
            { text: "Subish (shocked): \"Ayyo! punda Pandi, inga paaru... stabbing marks irruku!\"" },
            { text: "Everyone freezes for a moment, the realization sinking in." },
            { text: "Sharvesh (wide-eyed): \"Pandi ya already stab panirukanga da!\"" },
            { text: "Tharun: Atha thanda avanu sonna." },
            { text: "Syed: Ippo tha process panni mudikuran" },
            { text: "Sharvesh (stammering): \"otha sethuta na da?\"" },
            { text: "Sharon: \"Uyir irukanu paruda mairu\"" },
            { text: "Syed: \"We have to get him help, immediately!\"" },
            { text: "With trembling hands, Subish places the stethoscope on Pandi’s chest—and the silence confirms the worst: he’s already dead." },
        ],
        choices: [
            { text: "Twin Trouble", next: "twin_trouble" },
            { text: "Family Fight", next: "family_fight" },
        ]
    },

    twin_trouble: {
    text: [
        { text: "Hollow man panics, her eyes widen, her breath quickening as the tension in the room spikes." },
        { text: "She moves across the room quickly and leans over Tharun’s shoulder, her face close as she tries to grasp the situation." },
        { text: "Syed watches silently from a distance, his eyes narrowing, sensing the growing unease between them." },
        { text: "Syed’s face twists with rage. Without warning, he lunges forward and throws a powerful punch at Tharun." },
        { text: "Thud!" },
        { text: "Tharun staggers back, clutching his jaw, shocked by the sudden attack." },
        { text: "Syed (breathing heavily): \"En pondati kuda nee yenada kudumpo panra\"" },
        { text: "Hollow man (screaming): \"Syed! stop it!\"" },
        { text: "Tharun (recovering, glaring): \"Ava vanthu hug pannathuku naa yenna da pannuven.\"" },
        { text: "Syed: \"nee ethuku d ivana hug panna. ithu evalo naala nadakuthu\"" },
        { text: "Tharun: \"Dei panic la pannita da\"" },
        { text: "Hollow man: \"No Naa panic la lam pannala. I always preferred the superior twin\"" },
        { text: "Tension in the room spikes as others rush in to break the fight before it turns worse." },

        { text: "Snake akka stands in the corner, her eyes sharp and filled with simmering jealousy as she watches hollow man lean over Tharun." },
        { text: "Snake akka (thinking bitterly): \"Tharun en kuda date pannitu, ipdi ennake cheat pannurane?\"" },
        { text: "She clenches her fists, memories flashing through her mind." },
        { text: "Snake akka (quietly, to herself): \"Ippo naan Perumal kooda married, aana en manasu eppaiyum Tharun-ku tha.\"" },
        { text: "Thirupathi stands beside her, noticing her distant gaze but says nothing." },

        { text: "Snake akka approaches Tharun, her steps hesitant but determined. Her voice trembles slightly as she tries to hold her composure." },
        { text: "Snake akka (quiet but intense): \"Tharun... Ivakudatha enna cheat panniya?\"" },
        { text: "Syed (interjecting): \"Neenga date pannigala? Yennaku apdi theriyum da, ithu love-hate relationship-nu.\"" },
        { text: "Tharun (surprised, cautious): \"Snake, ithu apdi illa. Naan cheat pannala ivakuda.\"" },
        { text: "Snake akka (looking away, then back): \"How could you do this to me?\"" },
        { text: "Thirupathi (stepping forward): \"Atha naan sollanum di punda mavale. Yenna cheat pannita?\"" },
        { text: "Snake akka (angry, furious): \"Atha nee sollatha! Fuck panna poralam, Yogert, Yogert-nu mourn pannura. Threesome Yogert kuda pannalam-nu sollura, thotta ipditha Yogert thoduvan-nu sollura!\"" },
        { text: "Tharun (softly): \"Snake, this is complex. Let me explain.\"" },
        { text: "Syed (sharply): \"Otha, ennaku explanation kudu da!\"" },
        { text: "Snake akka (hurt, voice cracking): \"Complex? Naan ippo thriupathi kooda married... aana en manasu unakku mattum thaan.\"" }
    ],
    continue: [
            { next: "fight_breaks_out"}
        ]
},

    family_fight: {
    text: [
        { text: `Tharun: "Yaaruda ivana konurupa?"` },
        { text: `Sriram (wild-eyed, furious): "Dei Vishal, neethan da pannirupa!"` },
        { text: `Vishal Kumar (snarling): "Annaiya, enna sollura?"` },
        { text: `Sriram (shouting): "Posting ketan nu unga annan than kolla sollirupan!"` },
        { text: `Vishal Kumar (mocking): "Unga ak un post ta kudakaporaru-nu nee than kondrupa. Ippo enna plan da?"` },
        { text: `Sriram (scornful): "Antha punda mavan fluke-la jeichutan. Real election 2030 than. Appo paakalam enga thala than jeiparu."` },
        { text: `Vishal Kumar (gritting teeth): "2030-la race-ku poiruvan, gbu part 3 shooting ga vitutu. Appa-yum enga annan than jeiparu.."` },
        { text: `Simson (interjecting): "Yaaruda neenga inga vanthu politics panuringa."` },
        { text: `Sharvesh: "Ithalam Sri Danush mastermind da."` },
        { text: `Sri Danush: "Ungoppa mastermind. Dei kiruku punda, neelam epdi da adsp aana?"` },
        { text: `Sharvesh: "Appa thanda ADSP na A-DSP. Neethanda pannirupa ennaku theriyum."` },
        { text: `Syed: "Company-ya thival pannitanu konnutiya da Danush."` },
        { text: `Sri Danush: "Sapitan. 5 varsham annalu technique mathama sapitan."` },
        { text: `Syed: "Nee konnutu un paiyan mela case sa podapatha. Enna appa da nee?"` },
        { text: `Sri Danush: "Pandi Pandi nu, Pandi poola pudichutu irupa college la."` },
        { text: `Syed: "Unna thanda family nu sollitu irupan college la. Ippadi konnutiye da."` },
        { text: `Sriram: "Avana konnutu rage bait nu solla poriya da Syed?"` },
        { text: `Sri Danush: "Dei DSP, master shifu va thukitan nu avana konnutiya da."` },
        { text: `Sri Danush: "Athulla Simson. Family-ya konnurukanuga plan potu."` },
        { text: `Sriram: "Yen nee konuraka kudatha?"` },
        { text: `Sri Danush: "Ithu yenna da puthusa sollura? Nee un paiyan thana shoot panniga."` },
        { text: `Sriram: "Dei kiruka, avan sethathu gun fire-la illa stab-la da."` },
        { text: `Sharvesh: "Sonnen la, ivan tha konnutu case sa mathuran. Mastermind."` },
        { text: `Sri Danush: "Dei punda naa panna yena reason nu sollura."` },
        { text: `Sharvesh: "Athalam theriyathu, neetha pannirupa yennaku theriyum."` },
        { text: `Syed: "Un company ya bankrupt pannita plus unna tvk vitu anupchan nu pannita. Plus, un paiyana vitutu avala kalyanam pannita."` },
        { text: `Sri Danush: "Marupadi marupadi blow job kudukatha da. Yen ivan," (points sharply at Sharvesh) "konurka kudatha. Ivan GF ta thana thiruduna."` },
        { text: `Sharvesh: "Dei punda, ava-la naa love pannave illa da."` },
        { text: `Syed: "Class la pudicha ponu yaaru nu ketathuku Master Shifu nu sonnathu nee thanda."` },
        { text: `Sharvesh: "Dei, athu Vishal ketanu sonne da. Yen avan konnuruka kudatha Soba kaga?"` },
        { text: `Narration: Suddenly, everyone starts pointing fingers at each other, voices rising into a deafening roar. Fingers jab, accusations fly like daggers. The tension snaps—shoves and punches erupt as the crowd descends into a violent brawl, chaos swallowing the room whole.` }
    ],
    continue: [
        {next: "fight_breaks_out"}
    ]
},


   fight_breaks_out: {
    text: [
        { text: `As tempers flare, the room descends into utter chaos—shouts echo, fists fly, and the air thickens with tension.` },
        { text: `People push and shove, their anger unleashed in a frenzy of violence.` },
        { text: `Suddenly, cutting sharply through the cacophony, a piercing screech rends the air—an eerie, haunting sound that forces everyone to momentarily freeze.` },
        { text: `From above, a massive hawk descends with terrifying grace.` },
        { text: `Nearly 2 feet tall, its wings spread wide—stretching over 4 feet—casting a vast shadow over the crowd.` },
        { text: `Its powerful talons reach out like iron claws, ready to seize its prey.` },
        { text: `Gasps ripple through the crowd as all eyes fixate on the unbelievable sight: Pranav, perched atop the giant hawk, gripping tightly with fierce determination.` },
        { text: `The bird’s muscles tense as it swoops down, snatching Vel into its grasp with swift precision.` },
        { text: `The hawk soars higher, Vel’s frantic cries fading into the wind.` },
        { text: `Two small, wiry figures burst from the crowd—bare-chested, smeared in streaks of ochre paint, each wearing a necklace of carved bone. They are the Zuru Twins—King Vel’s most loyal servants. They throw their spears to the ground, plant their feet wide, and scream to the sky in their native tribal tongue:` },
        { text: `Zuru #1 (howling): "Gurra! Gurra Vel-kai! Sulleraiya tor’mak! Tor’mak!"` },
        { text: `Zuru #2 (pounding chest): "Haiyya! Nai-vel! Sulleraiya kra’thum! Kra’thum!"` },
        { text: `Their voices crack with fury—the syllables raw and jagged, like words carved from stone, carrying across the stunned silence.` },
        { text: `Translation: Gurra! Gurra Vel-kai! — Leave my King Vel! Sulleraiya tor’mak! — Sky spirit, help him! Haiyya! Nai-vel! — Oh no! My king! Sulleraiya kra’thum! — Sky spirit, strike the beast!` },
        { text: `Tharun (shouting): "Vel! Vel da! Dei Pranav, edhuku ippadi pannara!"` },
        { text: `Simson (furious): "Leave my baby da!"` },
        { text: `Vel (screaming): "Simson! Darling! Save me!"` },
        { text: `The fight halts abruptly, eyes turning skyward as Pranav and the giant hawk disappear into the distance.` }
    ],
    choices: [
        { text: "Shoot the hawk", next: "shoot_hawk" },
        { text: "Throw Spear at Hawk", next: "throw_spear" }
    ]
},

   shoot_hawk: {
    text: [
        { text: `Sharvesh pushes forward, eyes locked on the giant hawk circling above.` },
        { text: `In his hands — a battered hunting rifle, its barrel glinting under the harsh lights.` },
        { text: `The air seems to tighten, every heartbeat syncing to the slow, deliberate motion of him raising the weapon.` },

        { text: `He exhales.` },
        { text: `Finger on the trigger.` },
        { text: `The hawk’s wings carve the air like scythes, Vel still dangling helplessly by his stretched underwear.` },

        { text: `**BANG!**` },
        { text: `The shot cracks through the night — a thunderclap that echoes off the walls.` },
        { text: `The crowd flinches, a few people scream.` },

        { text: `But the bullet slices nothing but empty sky.` },
        { text: `The hawk twists in mid-air with effortless grace, dodging the shot as if it saw it coming an eternity ago.` },

        { text: `A single feather flutters down, catching the light as it drifts into the stunned crowd.` },

        { text: `Sharvesh lowers the rifle, jaw tight, eyes burning with frustration.` },
        { text: `"Next time… I won’t miss."` },

        { text: `The hawk lets out a triumphant screech, climbing higher into the darkness.` }
    ],
    continue: [
        { next: "sharon_comes_out" }
    ]
},

    throw_spear: {
    text: [
        { text: `The midget's midget — the Zuru Twins, Vel's guardians — plant their bare feet firmly into the dirt, eyes blazing like coals in a fire.` },
        { text: `Their chests rise and fall rapidly, the ochre paint smeared across their bodies streaked with sweat.` },

        { text: `Zuru #1 (bellowing to the heavens): "Thara! Thara zul’kai! Ner’vatha surra kra’tham!"` },
        { text: `Zuru #2 (slapping the ground twice before raising his spear): "Kroth! Vel-kai zul’kai! Sulleraiya kor’mak torra!"` },

        { text: `Without breaking eye contact with the giant hawk, they raise their spears — weapons forged in tradition, carved from sacred wood, and blessed by their tribe’s sky spirits.` },
        { text: `To them, these are blades of destiny. To everyone else, they are barely the size of toothpicks.` },

        { text: `The twins launch their “spears” with all the fury of warriors avenging their king.` },
        { text: `The spear projectiles spin through the air in slow, cinematic arcs, as if the world itself is holding its breath.` },

        { text: `They strike the hawk’s feathers with a faint *tink*… and bounce away, drifting lazily to the floor.` },
        { text: `Not a single feather is ruffled. The hawk doesn’t even blink.` },

        { text: `Gasps ripple through the crowd — not from fear, but from the sheer commitment these two pint-sized warriors display.` },

        { text: `The twins, however, puff out their chests and grin with pride, certain they have delivered a mortal wound to the sky beast.` },

        { text: `**Translation:**` },
        { text: `Thara! Thara zul’kai! Ner’vatha surra kra’tham! — *Strike, strike the sky demon! Tear its heart apart!*` },
        { text: `Kroth! Vel-kai zul’kai! Sulleraiya kor’mak torra! — *Protect King Vel! Sky spirit, guide our aim!*` }
    ],
    continue: [
        { next: "sharon_comes_out" }
    ]
},

   sharon_comes_out: {
    text: [
        {text: `Shamlee (firmly): "Leave my husband alone!"`},
        {text: `Sharon’s eyes flash with jealousy, her heart pounding painfully as she steps forward, voice trembling but determined.`},
        {text: `Sharon (softly, almost whispering): "Simson… what do you mean by 'baby'?"`},
        {text: `Simson (annoyed): "Yeppa dei, ippo class edukatha da."`},
        {text: `He looks down briefly, then meets her eyes with raw honesty.`},
        {text: `Sharon (barely holding back tears): "College days-la nee enakku romba special. Ippo ippadi nee Vel-ku fight panradha paartha… apo yellame poi ya Simson."`},
        {text: `Simson (taken aback, quietly): "Yen na da olarura…" `},
        {text: `Sofiawari (mocking): "Appo enkuda irunthathum poi ya Simson."`},
        {text: `Simson (frustrated): "Dei yennada, alukualu ennanomo solluringa. unkuda epoo di irunthen. My heart is only for og."`},
        {text: `Sharon (swallowing hard): "Enna sollurathu nu theriyala, ana ennala sollama irukavum mudiyala."`},
        {text: `Sharon: "Apo college la en kaipudichu kutitu poniyee atha maranthutiya? Unna impress panna num website create panniyeye atha maranthutiya? Unna kaga college nai maari alanjene atha maranthutiya?"`},
        {text: `Simson: "Ithalam eppo da nadanthuchu?"`},
        {text: `Sofiawari: "Sollu Simson, unakaga fake id lam create pannene athalam poi ya. Sofia Sofia nu solluviye. En reels ku heart la potiye. Kerala IT job vitu tu un college professor ra serthathu yethuku ellam unnakaga tha, unna love pannurathu nala tha."`},
        {text: `Simson: "Aiyo please enna love torture pannathiga."`},
        {text: `Sharon: "Marry me Simson."`},
        {text: `Sofiawari: "No, marry me Simson."`},
        {text: `Sharon (emotional): "I WILL LOSE 1000 BUJIMA FOR YOU SIMSON. MY DADDY."`},
        {text: `Sofiawari (challenging): "I will lose 1000 pounds for you Simson."`},
        {text: `Simson (exasperated): "Sharon, it’s against Christianity—you are a pastor da. Yenna da panra?"`},
        {text: `Sharon (smirking): "It’s all a cover for my homosexuality. My heart is only for you."`},
        {text: `Simson (backing away): "Aiyo please… leave me alonee."`},
        {text: `Just as the brawl reaches its peak—shouts and fists flying—a commanding voice cuts through the chaos.`},
        {text: `Vikaas (calm, authoritative): "Enough! This madness ends now."`,music:'rainbowstar.wav'},
        {text: `Everyone freezes, turning to see Vikaas stepping into the room with an air of confidence and control.`},
        {text: `Vikaas (surveying the crowd): "You all are letting petty grudges blind you from the bigger picture."`},
        {text: `He walks steadily to the center, locking eyes with Sri Danush, Sriram, Syed, Sharvesh, and the others.`},
        {text: `Vikaas (firm): "Pandi's death isn’t just a simple murder. It’s a calculated move, none of you are fully prepared for."`},
        {text: `He pauses, letting the weight of his words sink in.`},
        {text: `Vikaas (strategizing): "This changes everything. We need to stay calm and figure out who’s behind this."`},
        {text: `The room slowly calms, the fight dissolving into attentive silence.`},
        {text: `Vikaas (nodding): "Now, let’s plan the next move. Together."`},
        {text: `Syed (checking phone): "No network... it’s jammed."`},
        {text: `Sharvesh (frustrated): "Signal illa da. Enna panrathu?"`},
        {text: `Sriram (looking around nervously): "The only exit... it’s locked tight. No signs of anyone outside."`},
        {text: `Tharun (tense): "We’re trapped... all of us, here together."`},
        {text: `hollow man (whispering): "Ippo namma ellarum oru team maadhiri irukkanum."`},
        {text: `The room grows heavy with the weight of their predicament—no escape, no outside help.`},
        {text: `Vikaas (serious): "Pandi bail-la irundhaan master shifu murder case-ku. Case ippodhum nadakudhu."`},
        {text: `Syed (nodding): "Aama, Shenba’s dad tha judge-a irunthu adha handle panra."`},
        {text: `Sharvesh (uneasy): "Adhu nala tha avanuku TVK la pressure irukku, appo avan akmm join panna plan pannaan."`},
        {text: `Sriram (thoughtful): "Shenba appa case mela influence panna mudiyuma?"`},
        {text: `Tharun (firm): "Case proper-a investigate pannala, oj Simpson case maari thaan."`},
        {text: `Sharvesh: "Department laiyum atha pathi pesuvanga. Andha judge ku bribe pannita pandi nu."`},
        {text: `Tharun (angry): "He fucked his own daughter. Do you expect him to be sane?"`},
        {text: `Vikaas (decisive): "Indha info wisely use pannanum. Ithaan real truth kandupidikka key."`}
    ],
    choices: [
        {text: "Deeper Investigation", next: "deeper_investigation"},
        {text: "investigate the Guest", next: "investigate_guests"},
    ]
},

    deeper_investigation: {
    text: [
        {text: "Sri Danush: 'Dei punda, unta avan varen nu sonnana?'", musicStop:'rainbowstar.wav'},
        {text: "Sri Varshan: 'Dei avanta naa pesa ve ilada.'"},
        {text: "Sriram: 'Mama, avan phone na paaru.'"},
        {text: "Narrator: 'Varshan spoke for 30 minutes yesterday.'"},
        {text: "Sri Danush: 'Un magan vaila unmaiye varatha da.'"},
        {text: "Sriram: 'Ipathanada illa nu sonna.'"},
        {text: "Sri Danush: 'Appana maari tha son irupan.'"},
        {text: "Sriram: 'Un paiyan than.'"},
        {text: "Tharun: 'Varshan bro, yenna pesuna pandi?'"},
        {text: "Sri Varshan: 'Ila bro, na reunion vantha onnu judge panna matangala nu keta. Vaada punda pathukalam nu sonne.'"},
        {text: "Sharon: 'Yepdi da judge panna ma irupanga? He's an alleged murderer.'"},
        {text: "Syed: 'So pandi varathu unnaku matum tha theriyum, yen nee murder panniruka kudathu.'"},
        {text: "Sri Varshan: 'Yen unga appa pannirupan. Oru bridge vidama pannuvan la, athu maari pannirupan.'"}
    ],
    continue: [
        { next: "maharaja_investigation" }
    ]
},

   investigate_guests: {
    text: [
        {text: "Narrator: 'You scan the hall. Conversations are tense, eyes dart around, and secrets hang in the air.'"},
        {text: "Sharvesh: 'Seri da ippo yaruta investigate panna start panna'"},
        {text: "Sri Danush: 'Un paiyan ta arambi'"},
        {text: "Sharvesh: 'Yenna nu da keka. Nee than pannirupa nu ennaku doubt ta iruku'"},
        {text: "Syed: 'Pannitu payana solliruruvan'"},
        {text: "Sriram: 'Yeppa dei varshan ta kelu mothala'"},
        {text: "Sri Danush: 'Ana syed avan summa irunthalu nee sappama iruka matra da'"},
        {text: "Simson: 'Yen da first tu avanta investigate panna solra'"},
        {text: "Sri Danush: 'Avan tha daily tvk kela nadakuratha pandi ta solluva. Ella plan naiyu sollirathu kuda paravala ana yenna nadathathu ne theriyama nadipan paaru.'"},
        {text: "Sharvesh: 'Neeye Tvk'la irunthu veliya vanthutu. Ava sollura'"},
        {text: "Sriram: 'Avan yenda avaniye veliya yaara vaipan'"},
        {text: "Sharvesh: 'Appo tha unkuda akmm la sera mudiyum'"},
        {text: "Sri Danush: 'Yeppa dei nantha da konne. Intha cuff fa potu kutitu po'"},
        {text: "Sharvesh: 'Cuff poda kita vantha gun na holster la irunthu yeduthu yennaiye soduva'"},
        {text: "Sriram: 'Otha iruda varsha na investigate pannuvom'"},
        {text: "Syed: 'Starting la irundhu nee pannurathu pathi doubt irundhudhu.'"},
        {text: "Tharun: 'First gun shoot aparam itha nadandhuchu.'"},
        {text: "Sharon: 'Ama, un gun epdi da? Safety on illa? Usually safety on irundha trigger pull pannina fire aagathu, right? Enna nadandhuchu?'"},
        {text: "Simson: 'Safety already off pannirukan. Sharvesh gun, trigger pull pannina instant fire aayiduchu.'"},
        {text: "Syed: 'Yen da, safety off la iruku?'"},
        {text: "Sharvesh: 'Dei, theriyala da, atha naan pakala. Pls, avan sethathu knife stab la thana.'"},
        {text: "Vishal Kumar: 'Avana vidunga da, stab pannathu yaaru nu paruda.'"},
        {text: "Tharun: 'Avan inga vanthathuku aaparam pesuningala bro.'"},
        {text: "Sri Varshan: 'Illa bro pesala.'"},
        {text: "Simson: 'Yaaru da first inga vantha?'"},
        {text: "Syed: 'Nantha da hollow first te povom nu torch panni kutitu vantha.'"},
        {text: "Sri Varshan: 'Bro Maharaja tha ivanta inga pesitu irunthan.'"}
    ],
    choices: [
        {text: "Investigate Maharaja", next: "maharaja_investigation"},
        {text: "Investigate Varshan", next: "varshan_investigation"},

    ]
},

varshan_investigation: {
 text: [
     {text: "You decide to question Sri Varshan closely. Sri Varshan claims he didn’t say anything after the incident, but some report seeing him near the victim before the fight broke out."},
     {text: "Tharun: Vera yaaru bro ivanta pesunathu"},
     {text: "Sri Varshan: Yaarum pesala bro"},
     {text: "Simson: Dei antha DJ pesitu irunthan da pandi ta"},
     {text: "Vishal Kumar: Oh my god eppo"},
     {text: "Simson: Vel vaara pora avanum ivanum pesitu irunthaga"},
     {text: "Sri Danush: Dei punda un paiyana nambalama (points at Sriram)"},
     {text: "Sriram: Un family ya neeye nambala, naa epdi da namba mudiyum"},
     {text: "Sharvesh: Antha DJ ta kepom da"},
     {text: "You check Varshan’s phone and call logs. There’s a call to a customer around the same time as the incident."},
     {text: "Does Varshan know more than he’s saying? Or is he trying to cover for someone?"},
     {text: "You push Varshan harder."},
     {text: "Tharun: Bro neenga solluratha namburone vachurupom neenga last ta call pesunathu vel entrance time la. Neengale murderer ta ithan correct time nu solliruka kudatha yenna"},
     {text: "Varshan: Dei naa pannala da"},
     {text: "Syed: Unga appa Karthi pannara da"},
     {text: "Varshan: Ila rizwan tha oru bridge vidama ellariyum pannan"},
     {text: "Simson: Yaaruta ta kadaisiya pesuna"},
     {text: "Varshan: Theriyala da wrong number."},
     {text: "Sriram: Wrong Number ta yenda 1 minute pesiruka"},
     {text: "Varshan: Customer nu nenaichen da"},
     {text: "You note down his statement, but still feel something is off."}
 ],
 continue:[
     {next:"maharaja_investigation"}
 ]
},

    maharaja_investigation: {
    text: [
        {text: "Maharaja was seen talking near the scene just moments before the gunshot. Witnesses say he looked anxious and kept glancing towards the exit. Was he trying to warn someone? Or was he involved in setting up the incident? His fingerprints are found near the knife. Need to interrogate him further."},
        {text: "Subish: Dei, ennada pesuna pandi ta? Neenga enna panninga?"},
        {text: "Maharaja shifts nervously, avoiding eye contact."},
        {text: "Maharaja: Yo, yennaiya sarakku potiya? Naan enga enna panna sollu?"},
        {text: "Sharvesh (stepping forward, voice cold): Yennada pesuniga rendu perum? Inga straight-a sollu"},
        {text: "Sharvesh suddenly pulls out a gun and points it sharply at maharaja’s chest."},
        {text: "Sharvesh: yenna pesuninganu olunga sollu da."},
        {text: "Maharaja gulps, hands trembling."},
        {text: "Tharun: Neethana kadaisiya avanoda pesuna?"},
        {text: "The room falls silent except for the heavy breathing of those watching."},
        {text: "Maharaja’s hands tremble as the gun remains trained on him. He takes a deep breath, deciding to speak the truth."},
        {text: "Maharaja: Case epdi poguthu nu keten"},
        {text: "Sharvesh (eyes narrowing): atha yen ne keta?"},
        {text: "Maharaja: ithu yenna da kelvi. avanta yenna pesurathu"},
        {text: "Sri danush: Mama avan phone na thooku"},
        {text: "Sharvesh (lowering the gun slowly): Thank you, maharaja. This is important information for us."},
        {text: "Sriram quietly grabs maharaja’s phone. His eyes widen. On the contact list, Pandi’s number is saved as “Baby.”"},
        {text: "Sri danush: Neelam yennada police su avan sonna odane thank you for the info nu sollura"},
        {text: "Sriram: Pandi number ra yenda baby nu save panni vachuruka?"},
        {text: "Maharaja looks away, guilt flooding his face."},
        {text: "Sharvesh (steps closer, eyes locked): Yenda daily avanta pesura, Maharaja?"},
        {text: "Maharaja (hesitant, voice low): Neenga neikura maari illa da…"},
        {text: "Subish (mocking tone): Appo “Baby” Ashika illaiya da? Baby, baby nu ivanta pesitu irunthiya?"},
        {text: "Syed (pointing): So nee tha Master Shifu va kill panna?"},
        {text: "Sharvesh: Apparam… Pandi yayum konruka?"},
        {text: "Maharaja (angrily): Dei… yennada ollarura?"},
        {text: "Sriram (throws Maharaja's phone on the table): Apparam yenda “Baby” nu save panniruka?"},
        {text: "Maharaja (sighs, looking away): He… was more than a friend."},
        {text: "Sharvesh (leaning in, voice sharp): Ennada nadanthuchu? Tell me the full story."},
        {text: "Maharaja’s eyes glisten. He takes a deep breath, his voice shaking as he speaks."},
        {text: "Maharaja: Naanum Pandi-yum college days la irundhe love pannom… aana avan appa ku athu pudikala. So, he acted like he loved Master Shifu. Marriage ku apparamum… adikadi meet pannipom."},
        {text: "Maharaja’s hands clench as he continues."},
        {text: "Maharaja: Oru time… Master Shifu vitula illathapo."}
    ],
    continue: [
        { next: "real_incident"}
    ]
},

real_incident: {
    text: [
        {text: "The scene fades into a memory — Maharaja sitting alone in his dimly lit room, phone pressed to his ear. Pandi’s voice is soft, almost teasing."},
        {text: "Pandi: (low tone) Dei… miss pannura da un voice-ah."},
        {text: "Maharaja: (smiling faintly) Naanum da… indha rendu naalum un kitta pesala nu romba kashtam."},
        {text: "Pandi: (playfully) Seri… then come over tomorrow."},
        {text: "Maharaja: (hesitating) Tomorrow? But… Master Shifu?"},
        {text: "Pandi: (whispering) She won’t be here. Namma rendu perum thaniya irupom… just like old times."},
        {text: "Maharaja’s breathing gets heavier, his grip on the phone tightening."},
        {text: "Maharaja: (half-smiling) Dei… neeyum indha maari pesunana… naan wait panna mudiyathu da."},
        {text: "Maharaja: (laughs softly) Appo done. Naalu maniku vaa… naan door open-a vechiruken."},
        {text: "Maharaja’s footsteps echo as he walks down the quiet lane toward Pandi’s house. It’s late afternoon, the golden light spilling through the trees — but his heart races for a different reason."},
        {text: "The door is already open, just like Pandi promised."},
        {text: "Pandi: (smiling) I knew you’d come."},
        {text: "Without another word, Maharaja steps inside. They stand close… too close. A moment of silence — eyes locking — the air between them thick with unspoken years."},
        {text: "Pandi’s hand grazes Maharaja’s cheek. Maharaja exhales shakily. They lean in — lips meeting in a desperate, hungry kiss. Hands move, pulling each other closer, breaths quickening. It feels reckless… intoxicating."},
        {text: "The afternoon sun spills through the curtains in Pandi’s bedroom. Maharaja lies on the bed beside him, shirt half-open, the two of them tangled together in the warmth of the moment. Laughter fades into quiet breathing… then into slow, deliberate touches."},
        {text: "Pandi: (whispering) I told you she’s not home."},
        {text: "Maharaja smiles faintly, leaning in. Their lips meet again — deeper, slower this time. Pandi’s hand slides behind Maharaja’s neck, pulling him closer, until they’re almost lost in each other."},
        {text: "A sound breaks the spell. Keys at the front door. A faint clink of bangles."},
        {text: "They freeze. Pandi sits up halfway, eyes darting toward the bedroom door."},
        {text: "Before either of them can move — the door bursts open."},
        {text: "Master Shifu stands there, framed in the doorway, eyes wide in horror. Her gaze flicks from Maharaja’s flushed face to the disheveled bedsheets, then to Pandi’s bare chest."},
        {text: "Master Shifu: (voice shaking) …neenga rendu peru?"},
        {text: "The grocery bag in her hand slips to the floor — fruit spilling and rolling under the bed. Her breathing grows ragged, the shock quickly turning into rage."},
        {text: "Master Shifu: oomala nee ajakada?"},
        {text: "Neither of them answers. The silence says more than words ever could."},
        {text: "Shifu stands frozen for a moment, then takes a sharp breath. Her hands clench at her sides."},
        {text: "Master Shifu: Pandi…? (pauses, voice trembling with fury) un family ta solla poren. I’m telling them everything — that you’ve been lying… that you’re gay."},
        {text: "Pandi’s eyes widen, panic flashing across his face."},
        {text: "Pandi: Shifu, no—"},
        {text: "Master Shifu: (cutting him off) illa avangaluku kandipa therinje aganum. —"},
        {text: "Pandi takes a step forward, desperation creeping into his tone."},
        {text: "Pandi: Shifu please di… enga appan babu ku thericha avalo tha di… please di. tire ra mulikiruvan di kiruku paya."},
        {text: "But Shifu’s voice only grows louder, sharper."},
        {text: "Master Shifu: Enna use pannitu… ippo—"},
        {text: "The heavy glass flower vase from the table is suddenly in Maharaja’s hands. His eyes are a storm of desperation and fear."},
        {text: "Master Shifu: Sharvesh is the only one who loved me truly. I should have been with him."},
        {text: "Pandi: Shifu, I’ll give you divorce… but please, appa ta sollatha."},
        {text: "Master Shifu: No. For the life you ruined, I’m going to tell him."},
        {text: "A sudden swing — THUD! The vase smashes against her head. A thin line of blood begins to ooze from her forehead."},
        {text: "Shifu’s body slides off the bed’s edge… A dull thump as she hits the floor. Eyes wide open… unmoving."},
        {text: "Pandi’s hands tremble. He quickly kneels, touches the side of her neck."},
        {text: "Pandi: (low, panic) Dei… breath illa da… pulse illa da…"}
    ],
    continue: [
        {next: "present_situation"}
    ]
},

present_situation: {
    text: [
        {text: "Maharaja: Master Shifu sethuta da... so we plan to cover it up."},
        {text: "Sharvesh’s face twists with pure rage — she was someone he once loved. His finger tightens on the trigger, but the others grab his arms, holding him back before the shot can fire."},
        {text: "Tharun: Otha, ithula oru flashback pundai da."},
        {text: "Syed: Pandi uyiroda irundha nee mathipa nu avana konutiya da?"},
        {text: "—SUDDENLY—"},
        {text: "A sudden *BANG!* — fire from DJ’s side. Shocked, everyone turns."},
        {text: "*BANG!* Maharaja staggers, a red bloom spreading across his shirt. He collapses to the ground, lifeless. Gasps fill the hall."},
        {text: "It’s Ram. His eyes cold, jaw clenched — the man who once dated Master Shifu in the past."},
        {text: "Sharvesh, overcome with fury, twists free and fires at him — *BANG!* But the bullet whizzes past, smashing into the wall behind. A misfire."},
        {text: "Sharvesh: Ram, ava unakku epdi mukkiyamo, athu maari tha ennakum."},
        {text: "Ram: Avan en kaila thaan sethan. Ipo neeyum en kaila thaan sagapora."},
        {text: "Sharvesh: Gun keela pottu olunga surrender agiru, Ram."},
        {text: "Sharvesh tries to reason, voice shaking — but Ram steps forward, eyes locked, hand twitching near his weapon. A heartbeat passes."},
        {text: "Sharvesh raises his gun again — *BANG!*"},
        {text: "The shot lands. Ram’s body jerks back, eyes wide, before he collapses lifeless onto the floor."},
        {text: "Silence. The air turns heavy — no one dares breathe."},
        {text: "Sharon swallows hard, Syed’s fists clench, and somewhere in the corner, a phone slips from someone’s trembling hand, hitting the floor with a dull thud."}
    ],
    continue: [
        {next: "saving_vel"}
    ]
},

    saving_vel: {
    text: [
        {text: "In that suffocating stillness — THUD! Shamlee’s phone slips from her trembling hand, clattering onto the cold floor."},
        {text: "The cracked screen lights up with a single pulsing notification. A WhatsApp voice note. From Pranav."},
        {text: "The group stares at it like it’s a live grenade. No one breathes. No one blinks."},
        {text: "The audio plays, Pranav’s voice dripping with threat, low and deliberate: 'Three ton of sugarcane... or your love dies.'"},
        {text: "The words stab through the air like a knife."},
        {text: "Sharvesh’s face twists — a violent mixture of grief, rage, and disbelief. His scream shatters the silence: 'SHIFUUUUU! ahhhhhhhhhh'"},
        {text: "It echoes, raw and unrestrained, like an animal that’s just been wounded beyond repair."},
        {text: "Vishal Kumar, voice low but steady: 'Vidu da... ava la maranthudu.'"},
        {text: "Tharun steps forward, eyes locked on Sharvesh: 'Man up. It's time to be professional.'"},
        {text: "Sharvesh is trembling — his entire body caught between breaking down and exploding. His fists clench so tight that his knuckles turn white. His chest heaves with every breath, eyes glassy with unshed tears."},
        {text: "Sharon steps into his line of sight, voice urgent but gentle: 'We have to save Vel... Sharvesh, we need you.'"},
        {text: "Sri Danush joins in, tone firm and commanding: 'Yes... we need Ramesh’s son.'"},
        {text: "Vikaas, his voice almost breaking: 'We need you da.'"},
        {text: "Sharvesh’s jaw tightens. His breathing steadies. The storm in his eyes doesn’t fade — it just turns inward, forging something harder."},
        {text: "In that moment, he locks his grief away. Personal loss is shoved into the deepest corner of his heart. What’s left is a man with one mission: Save Shanmugavel... no matter the cost."},
        {text: "The team watches as Sharvesh straightens his back, the weight of his pain still heavy but hidden. A dangerous calm replaces his despair."},
        {text: "Sharvesh: 'Let’s finish this.'"},
        {text: "Sharvesh breathes deep. His jaw sets. Personal pain is shoved into the shadows — replaced by the crushing weight of duty."},
        {text: "And so, in the dying light of the day, they come together. Not just as friends. Not just as survivors. But as a force bound by one mission — to reach Vettikilli Nagaram… and bring Shanmugavel home."},
        {text: "Sharvesh: 'Epdi anga poga porom? This place is locked!'"},
        {text: "They swarm to Ram's pockets — searching desperately for keys. Empty. The hollow jingle of nothing sends a wave of frustration across the room."},
        {text: "Syed: 'Ithu ivan plan maari theriyala… it's Pranav's plan. Plus… avana ethuku da save pannanum?'"},
        {text: "Simson steps forward, voice steady but heavy: 'Because he's my better half.'"},
        {text: "Sharon and Sofiwari, in unison, their words like a synchronized gunshot: 'AND YOU'RE MINE!'"},
        {text: "The room falls silent. The air thickens. No matter how many times they tried, the door refused to give way — stubborn as fate itself."},
        {text: "Syed's eyes narrow. Something clicks. Syed: 'Wait here.'"},
        {text: "He vanishes into the corner — crouching, digging under the heavy wooden table. Metal scrapes. Canvas shifts. Then, with a grunt, he drags out a heavy duffel bag, the zipper straining against its own burden."},
        {text: "The smell hits first — sharp, chemical, dangerous. Oil."},
        {text: "Syed lifts his head, smirking just enough to be dangerous. Syed: 'If the door won’t open… we’ll make it open.'"},
        {text: "Syed drops the duffel at their feet. The canvas thuds like a ticking time bomb. The others exchange glances — they know what's inside, and they know what comes next."},
        {text: "Simson: 'WE need fire.'"},
        {text: "Sofiawari: 'I can light it up if you like.'"},
        {text: "Syed turns to the corner. 'Subish, lighter iruka da?'"},
        {text: "Subish pats his pockets — a frantic rustle of cloth, the tiny clink of coins, but no spark of salvation. Subish: 'Illa ivane.'"},
        {text: "A tense silence falls, broken only by the faint glug-glug as Syed begins splashing oil across the stubborn wooden door. The smell swallows the air, thick and suffocating."},
        {text: "Sharvesh steps forward — calm, unnervingly calm. He slides the pistol from his belt, the cold metal whispering against the leather holster."},
        {text: "Sharvesh: 'Athuku avasiyam illa.'"},
        {text: "Time slows. The group stares. He raises the gun, eyes locked on the oil-soaked wood."},
        {text: "Sri Danush: 'Dei ADSP, olunga shoot pannuviya da?'"},
        {text: "Sharvesh: 'Yaaruda ADSP? Yenga appan thanda ADSP. Naa A-DSP.'"},
        {text: "BANG."},
        {text: "The spark is instant — a violent kiss between metal and flammable vapors. The door erupts, flames crawling up its frame like a living thing hungry for freedom."},
        {text: "The heat hits their faces, fierce and alive. The lock gives a tortured scream before surrendering."},
        {text: "The door falls away. Fire roars behind them. And they don’t run."},
        {text: "No — they walk. Side by side, in perfect slow motion, silhouettes carved against a wall of fire. Eyes forward. Shoulders squared. Every step a promise."},
        {text: "Together — gangsters in purpose, brothers in war — they stride into the night, heading straight for Vettikilli Nagaram… and for Shanmugavel."},
        {text: "****The end****"}
    ]
}
};

renderScene();
