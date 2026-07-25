import type { Structure } from "./types";

/**
 * Seed corpus. Each entry is written twice over: once in plain English for
 * someone who just wants their neck to stop hurting, once clinically for
 * someone who wants origin, insertion and nerve root.
 */
export const STRUCTURES: Structure[] = [
  {
    id: "trapezius-upper",
    name: "Upper trapezius",
    latin: "Trapezius pars descendens",
    aka: ["the shoulder shrug muscle", "where I carry my stress"],
    view: "posterior",
    layer: 0,
    plain:
      "The sloping strap running from the base of your skull to the point of your shoulder. It holds your shoulder blade up and helps carry the weight of your head — which is why it is the first thing to complain when you spend a day at a laptop.",
    feels:
      "A hot, tight band along the top of the shoulder. Often a headache that creeps up the back of the head and settles behind the eye or temple.",
    palpation:
      "Pinch the fleshy ridge between your neck and the point of your shoulder, right now. That thick band between your fingers is it.",
    angryBecause: [
      "A monitor below eye level, so your head hangs forward all day.",
      "A laptop on your actual lap.",
      "A heavy bag on one shoulder — the muscle spends hours shrugging to stop it sliding off.",
      "Cradling a phone between ear and shoulder.",
      "Sleeping with too many pillows, so the neck is side-bent all night.",
      "Sustained stress. This muscle braces when you brace.",
    ],
    realCulprit:
      "It is usually not the villain. The upper trapezius is normally overworking because the lower trapezius and serratus anterior have stopped holding the shoulder blade properly — so stretching the top without strengthening the bottom buys a few hours at most.",
    tendsToBe: "tight",
    clinical: {
      origin:
        "External occipital protuberance, medial third of the superior nuchal line, ligamentum nuchae, spinous process of C7",
      insertion: "Lateral third of the clavicle and the acromion",
      actions: [
        "Elevates the scapula",
        "Upwardly rotates the scapula with serratus anterior and lower trapezius",
        "Extends and side-bends the neck",
      ],
      innervation: "Spinal accessory nerve (CN XI), with proprioception from C3–C4",
      roots: ["CN XI", "C3", "C4"],
    },
    antagonists: ["trapezius-lower"],
    synergists: ["levator-scapulae", "trapezius-middle"],
    fascialLines: ["Superficial Back Line", "Back Functional Line"],
    triggerPoints: [
      {
        label: "TrP1 — mid-belly of the upper fibres",
        at: [212, 268],
        refersTo:
          "Up the side of the neck, behind the ear and into the temple. This is the classic tension-headache pattern.",
        regions: ["neck-lateral", "head-temporal"],
        note: "One of the most frequently found trigger points in the body.",
      },
      {
        label: "TrP2 — deeper and slightly lower",
        at: [188, 285],
        refersTo: "The back of the neck and the base of the skull.",
        regions: ["neck-posterior"],
      },
    ],
    drills: [
      "upper-trap-stretch",
      "trap-ball-wall",
      "chin-tuck",
      "wall-angel",
      "prone-y-raise",
    ],
    ergonomics: [
      "Raise the top of your monitor to eye level. On a laptop, this means a stand and a separate keyboard — there is no other fix.",
      "Set armrests so your forearms are supported. Unsupported arms hang about 4kg from this muscle all day.",
      "Swap the shoulder bag for a backpack, or at minimum swap shoulders every few minutes.",
    ],
    redFlags: [
      "Neck pain with fever, or with unexplained weight loss.",
      "Weakness, clumsiness in the hands, or changes in walking — see someone promptly.",
    ],
  },
  {
    id: "levator-scapulae",
    name: "Levator scapulae",
    latin: "Musculus levator scapulae",
    aka: ["the crick in my neck", "that spot I can never reach"],
    view: "posterior",
    layer: 1,
    plain:
      "A rope running from the top corner of your shoulder blade up to the side of your neck. Its job is to lift the shoulder blade and to tip your head sideways.",
    feels:
      "A sharp, precise ache at the top inner corner of the shoulder blade, plus a stiff neck that will not turn to one side. It is often the muscle behind waking up with a crick.",
    palpation:
      "Find the top inner corner of your shoulder blade, then press just above it toward the neck. It is deep to the trapezius, so press firmly.",
    angryBecause: [
      "Sleeping with the head turned or propped too high.",
      "A monitor placed off to one side, so you spend the day looking slightly across.",
      "Crutches, or carrying anything that makes you shrug.",
      "Sustained mouse use with the arm reaching forward and out.",
    ],
    realCulprit:
      "Almost always paired with a stiff mid-back and a shoulder blade that has stopped rotating properly. Chasing the sore spot alone tends to disappoint.",
    tendsToBe: "tight",
    clinical: {
      origin: "Transverse processes of C1–C4",
      insertion: "Medial border of the scapula, between the superior angle and the spine",
      actions: [
        "Elevates the scapula",
        "Downwardly rotates the scapula",
        "Side-bends and rotates the neck to the same side",
      ],
      innervation: "Dorsal scapular nerve, plus direct branches from C3–C4",
      roots: ["C3", "C4", "C5"],
    },
    antagonists: ["trapezius-lower"],
    synergists: ["trapezius-upper", "rhomboid-major"],
    triggerPoints: [
      {
        label: "TrP at the angle of the neck",
        at: [262, 258],
        refersTo:
          "The angle of the neck and along the medial border of the shoulder blade. Strongly limits turning the head.",
        regions: ["neck-lateral", "scapula-medial"],
      },
    ],
    drills: ["levator-scap-stretch", "trap-ball-wall", "wall-angel", "open-book"],
    ergonomics: [
      "Put your monitor directly in front of you, not off to one side.",
      "Use one pillow that fills the gap between your ear and the mattress — no more.",
    ],
  },
  {
    id: "rhomboid-major",
    name: "Rhomboid major",
    latin: "Musculus rhomboideus major",
    aka: ["the knot between my shoulder blades"],
    view: "posterior",
    layer: 1,
    plain:
      "A sheet running diagonally from your spine to the inner edge of your shoulder blade. It pulls the shoulder blades together and back.",
    feels:
      "A deep, burning ache between the spine and the shoulder blade — the spot you try to dig at with a tennis ball against a doorframe.",
    palpation:
      "Reach across your chest to the opposite side and feel between your spine and the inner edge of the shoulder blade. Rounding your upper back slightly brings it closer to the surface.",
    angryBecause: [
      "Hours of reaching forward — keyboard, steering wheel, phone — which holds the muscle in a long, loaded position all day.",
      "A chest and front-of-shoulder that has shortened, dragging the shoulder blades forward.",
      "Carrying a baby or toddler on the front.",
    ],
    realCulprit:
      "This is a lengthened, overworked muscle far more often than a short one. It aches because it is being pulled on, not because it is tight — which is why stretching it feels good for ten minutes and then does nothing. The fix is usually opening the front and strengthening the mid-back.",
    tendsToBe: "weak",
    clinical: {
      origin: "Spinous processes of T2–T5",
      insertion: "Medial border of the scapula, below the spine of the scapula",
      actions: [
        "Retracts the scapula",
        "Downwardly rotates the scapula",
        "Stabilises the scapula against the ribcage",
      ],
      innervation: "Dorsal scapular nerve",
      roots: ["C4", "C5"],
    },
    antagonists: ["serratus-anterior"],
    synergists: ["trapezius-middle", "levator-scapulae"],
    triggerPoints: [
      {
        label: "TrP along the medial scapular border",
        at: [268, 336],
        refersTo:
          "A local ache along the inside edge of the shoulder blade — one of the few patterns that genuinely stays where the muscle is.",
        regions: ["scapula-medial"],
      },
    ],
    drills: ["doorway-pec", "wall-angel", "prone-y-raise", "trap-ball-wall", "open-book"],
    ergonomics: [
      "Pull your keyboard and mouse close enough that your elbows stay by your sides.",
      "If you feel this every afternoon, the answer is usually a two-minute doorway stretch every hour, not a longer stretch once a day.",
    ],
  },
  {
    id: "latissimus-dorsi",
    name: "Latissimus dorsi",
    latin: "Musculus latissimus dorsi",
    aka: ["the wings", "lats"],
    view: "posterior",
    layer: 0,
    plain:
      "The big fan across your lower and middle back that reaches up under your arm. It pulls your arm down and back — the muscle that does a pull-up.",
    feels:
      "A broad tightness across the side of the back, often noticed as an inability to reach overhead without arching the low back.",
    palpation:
      "Put a hand in your opposite armpit and squeeze the thick back wall of it between fingers and thumb. That cord is the lat.",
    angryBecause: [
      "Heavy pulling training without matching overhead mobility work.",
      "Long periods hunched forward, which parks it short.",
      "Reaching and lifting repeatedly at work.",
    ],
    realCulprit:
      "A short lat is a common hidden reason people cannot lift their arms overhead without their low back arching — and that repeated arching is often what is actually irritating the low back.",
    tendsToBe: "tight",
    clinical: {
      origin:
        "Spinous processes of T7–T12, thoracolumbar fascia, iliac crest, lower three or four ribs, inferior angle of the scapula",
      insertion: "Floor of the intertubercular groove of the humerus",
      actions: [
        "Extends, adducts and internally rotates the arm",
        "Assists forced expiration",
        "Links the arm to the opposite hip through the thoracolumbar fascia",
      ],
      innervation: "Thoracodorsal nerve",
      roots: ["C6", "C7", "C8"],
    },
    fascialLines: ["Back Functional Line", "Superficial Back Line"],
    triggerPoints: [
      {
        label: "TrP in the axillary portion",
        at: [196, 402],
        refersTo:
          "The bottom tip of the shoulder blade and down the back of the arm to the ring and little fingers. Frequently mistaken for a neck problem.",
        regions: ["scapula-inferior", "arm-posterior"],
      },
    ],
    drills: ["child-pose-lat", "ql-side-bend", "foam-roll-thoracic"],
  },
  {
    id: "quadratus-lumborum",
    name: "Quadratus lumborum",
    latin: "Musculus quadratus lumborum",
    aka: ["QL", "the muscle that goes into spasm when my back goes out"],
    view: "posterior",
    layer: 2,
    plain:
      "A deep square of muscle between your bottom rib and the top of your pelvis, either side of the spine. It hitches the hip up and side-bends you, and it works constantly whenever you stand on one leg.",
    feels:
      "A deep, dull ache low and to one side of the back, worse after standing still or sitting for a long time. When it seizes, straightening up from a bend can feel impossible.",
    palpation:
      "Put your thumbs in the soft gap between your lowest rib and the top of your pelvis, a few centimetres out from the spine, then side-bend gently away — you will feel it firm up.",
    angryBecause: [
      "Standing with your weight parked on one leg.",
      "Sitting with a wallet or phone in one back pocket, tilting the pelvis for hours.",
      "Carrying a toddler on one hip.",
      "A leg-length difference, or a habitually dropped hip when walking.",
    ],
    realCulprit:
      "A QL on one side usually overworks because the gluteus medius on the opposite side is not doing its job of levelling the pelvis. Treating the sore QL without waking up the glute is the reason it keeps coming back.",
    tendsToBe: "tight",
    clinical: {
      origin: "Iliolumbar ligament and the posterior iliac crest",
      insertion:
        "Twelfth rib and the transverse processes of L1–L4",
      actions: [
        "Side-bends the trunk",
        "Elevates the hip on the same side",
        "Fixes the twelfth rib during breathing",
        "Stabilises the lumbar spine in the frontal plane",
      ],
      innervation: "Subcostal nerve and lumbar plexus branches",
      roots: ["T12", "L1", "L2", "L3"],
    },
    antagonists: ["gluteus-medius"],
    synergists: ["external-oblique", "iliocostalis", "psoas-major"],
    triggerPoints: [
      {
        label: "Superficial lateral TrP",
        at: [244, 492],
        refersTo:
          "The crest of the hip and the outer part of the buttock — very commonly mistaken for a hip problem.",
        regions: ["hip-lateral", "glute-upper"],
      },
      {
        label: "Deep medial TrP",
        at: [262, 528],
        refersTo:
          "The sacroiliac joint and deep into the buttock. This one is regularly mistaken for sciatica.",
        regions: ["si-joint", "glute-deep"],
      },
    ],
    drills: ["ql-side-bend", "side-plank", "clamshell", "child-pose-lat", "cat-cow"],
    ergonomics: [
      "Take the wallet out of your back pocket. This is not folklore — it tilts the pelvis for as long as you sit on it.",
      "If you stand all day, put one foot on a low rail and swap sides regularly rather than parking on one hip.",
    ],
    redFlags: [
      "Low back pain with fever, or that wakes you every night and is unrelieved by position change, deserves assessment.",
    ],
  },
  {
    id: "gluteus-medius",
    name: "Gluteus medius",
    latin: "Musculus gluteus medius",
    aka: ["the hip stabiliser", "dead butt muscle"],
    view: "posterior",
    layer: 1,
    plain:
      "A fan on the outer surface of your pelvis, above and behind the hip joint. Every single step you take, it stops your pelvis dropping on the unsupported side. It is one of the most important and most neglected muscles in the body.",
    feels:
      "An ache on the outer hip and upper buttock. Often worse lying on that side at night, or after walking. Frequently felt as low back pain rather than hip pain.",
    palpation:
      "Put your hand on the side of your hip, fingers a couple of centimetres below the crest of the pelvis, then stand on that leg. What tightens under your fingers is it.",
    angryBecause: [
      "Prolonged sitting — the muscle simply stops being asked to do anything.",
      "Standing hip-shot on one leg.",
      "Running or walking with a hip that drops on each step.",
      "Sleeping on your side without a pillow between the knees, which parks it in a lengthened, compressed position all night.",
    ],
    realCulprit:
      "This muscle is one of the great impostors: its trigger points refer straight into the low back and down the leg, and it is routinely mistaken for sciatica or a disc problem. If your low back pain is worse after walking and you can feel a tender spot on the side of your hip, start here.",
    tendsToBe: "weak",
    clinical: {
      origin: "Outer surface of the ilium, between the anterior and posterior gluteal lines",
      insertion: "Lateral surface of the greater trochanter",
      actions: [
        "Abducts the hip",
        "Stabilises the pelvis in single-leg stance",
        "Anterior fibres internally rotate, posterior fibres externally rotate the hip",
      ],
      innervation: "Superior gluteal nerve",
      roots: ["L4", "L5", "S1"],
    },
    antagonists: ["quadratus-lumborum"],
    synergists: ["gluteus-minimus", "tensor-fasciae-latae"],
    triggerPoints: [
      {
        label: "Posterior TrP, near the sacrum",
        at: [268, 572],
        refersTo:
          "The low back and the crest of the pelvis. This is the pattern most often misread as a lumbar problem.",
        regions: ["lumbar", "si-joint"],
      },
      {
        label: "Mid TrP",
        at: [222, 588],
        refersTo: "The middle of the buttock and the outer thigh.",
        regions: ["glute-mid", "thigh-lateral"],
      },
    ],
    drills: ["clamshell", "side-plank", "glute-bridge", "figure-four"],
    ergonomics: [
      "Put a pillow between your knees if you sleep on your side.",
      "Stand up every 30 minutes. This muscle switches off with sitting faster than almost any other.",
    ],
  },
  {
    id: "piriformis",
    name: "Piriformis",
    latin: "Musculus piriformis",
    aka: ["the sciatica muscle"],
    view: "posterior",
    layer: 2,
    plain:
      "A short muscle running from the front of your sacrum out to the top of the thigh bone, deep under the buttock. It turns the leg outward. The sciatic nerve passes directly underneath it — and in some people, straight through it.",
    feels:
      "A deep buttock ache, worse with sitting, driving, or crossing the legs. Sometimes with pain, tingling or numbness running down the back of the thigh.",
    palpation:
      "Draw an imaginary line from the top of your hip bone at the back to the bony point at the side of your hip. The muscle sits deep beneath the midpoint of that line — you will have to press firmly through gluteus maximus.",
    angryBecause: [
      "Long drives, especially with a wallet in the back pocket.",
      "Sitting cross-legged for hours.",
      "Sudden increases in running or hill work.",
      "A pelvis that is not being stabilised well by the gluteus medius, so the deep rotators take over.",
    ],
    realCulprit:
      "Genuine piriformis syndrome is less common than the internet suggests. Deep buttock pain with leg symptoms is more often coming from the lumbar spine or from gluteus medius and minimus. It is worth ruling those out before spending months stretching this one muscle.",
    tendsToBe: "tight",
    clinical: {
      origin: "Anterior surface of the sacrum, S2–S4",
      insertion: "Superior border of the greater trochanter",
      actions: [
        "Externally rotates the extended hip",
        "Abducts the flexed hip",
        "Helps stabilise the head of the femur in the socket",
      ],
      innervation: "Nerve to piriformis",
      roots: ["S1", "S2"],
    },
    synergists: ["obturator-internus", "quadratus-femoris", "gluteus-maximus"],
    triggerPoints: [
      {
        label: "Medial TrP, near the sacrum",
        at: [266, 626],
        refersTo: "The sacroiliac region, the buttock, and the back of the thigh.",
        regions: ["si-joint", "glute-deep", "thigh-posterior"],
      },
    ],
    drills: ["figure-four", "sciatic-glide", "clamshell", "glute-bridge"],
    redFlags: [
      "Numbness in the saddle area, or any change in bladder or bowel control, alongside leg symptoms is an emergency — go to hospital now.",
      "Progressive weakness in the leg or foot needs urgent assessment.",
    ],
  },
  {
    id: "psoas-major",
    name: "Psoas major",
    latin: "Musculus psoas major",
    aka: ["the hip flexor", "the sitting muscle"],
    view: "posterior",
    layer: 3,
    plain:
      "The only muscle connecting your spine to your legs. It runs from the sides of your lumbar vertebrae, through the pelvis, to the inside of the thigh bone. It lifts your knee — and it is shortened for every hour you spend sitting.",
    feels:
      "A deep ache in the front of the hip or groin, and often a low back that feels compressed and stiff on standing up after sitting.",
    palpation:
      "It is genuinely deep and not something to dig for. A better test: lie on your back at the edge of a bed and let one leg hang. If that thigh will not drop to level, the hip flexors on that side are short.",
    angryBecause: [
      "Sitting. That is the headline. Hours in hip flexion park the muscle short.",
      "Lots of sit-ups and leg raises, which train it as a hip flexor rather than a spinal stabiliser.",
      "Cycling with a high saddle and long sessions.",
      "Sleeping curled up tightly on your side.",
    ],
    realCulprit:
      "Because it attaches directly to the lumbar vertebrae, a short psoas pulls the low back into extension and can feel exactly like a lumbar problem. Low back pain that is worst when standing up after a long sit points strongly here.",
    tendsToBe: "tight",
    clinical: {
      origin:
        "Transverse processes of L1–L5, and the vertebral bodies and discs of T12–L5",
      insertion: "Lesser trochanter of the femur, with iliacus",
      actions: [
        "Flexes the hip",
        "With the leg fixed, flexes the trunk toward the thigh",
        "Stabilises the lumbar spine segment by segment",
      ],
      innervation: "Direct branches of the lumbar plexus",
      roots: ["L1", "L2", "L3"],
    },
    antagonists: ["gluteus-maximus"],
    synergists: ["iliacus"],
    fascialLines: ["Deep Front Line"],
    drills: ["hip-flexor-half-kneel", "glute-bridge", "bird-dog", "cat-cow"],
    ergonomics: [
      "Set your chair so your hips are slightly above your knees. Deep hip flexion all day is the problem.",
      "Stand up briefly every half hour. Frequency matters far more than duration here.",
    ],
  },
  {
    id: "multifidus",
    name: "Multifidus",
    latin: "Musculus multifidus",
    aka: ["the deep stabilisers"],
    view: "posterior",
    layer: 2,
    plain:
      "Small, short muscles bridging one or two vertebrae at a time, running the length of the spine right up against the bone. They do not produce big movement — they fine-tune and stiffen each joint just before you move.",
    feels:
      "Rarely felt directly. Its failure shows up as a low back that feels unstable, or as pain that keeps returning after each episode settles.",
    palpation:
      "Feel the groove immediately beside the bony bumps of your lower spine. The multifidus fills that groove, deep to the erector spinae.",
    angryBecause: [
      "An episode of back pain. These muscles are switched off reflexively by pain and do not automatically switch back on when it settles.",
      "Prolonged bed rest or inactivity.",
      "Bracing habitually, which recruits the big global muscles instead.",
    ],
    realCulprit:
      "The multifidus is a strong predictor of recurrence rather than a cause of the first episode. If your back keeps going out every few months, retraining this layer matters more than any stretch.",
    tendsToBe: "weak",
    clinical: {
      origin:
        "Sacrum, erector spinae aponeurosis, mamillary processes of the lumbar vertebrae, transverse processes of the thoracic vertebrae, articular processes of C4–C7",
      insertion: "Spinous processes two to four segments above",
      actions: [
        "Segmental stabilisation of the vertebral column",
        "Extension and contralateral rotation of the spine",
      ],
      innervation: "Medial branches of the posterior rami",
      roots: ["Segmental"],
    },
    synergists: ["transversus-abdominis", "longissimus"],
    drills: ["bird-dog", "cat-cow", "side-plank", "glute-bridge"],
  },
  {
    id: "gastrocnemius",
    name: "Gastrocnemius",
    latin: "Musculus gastrocnemius",
    aka: ["the calf"],
    view: "posterior",
    layer: 0,
    plain:
      "The visible diamond-shaped calf muscle. It crosses both the knee and the ankle, so it is involved in every step you take, and it is the top end of a chain that runs all the way to the sole of your foot.",
    feels:
      "Tightness at the back of the lower leg, sometimes cramping at night, and difficulty squatting with the heels down.",
    palpation:
      "Rise onto your toes and feel the two bellies of the calf pop out below the back of the knee.",
    angryBecause: [
      "Heeled shoes, which hold it short for hours at a time.",
      "Sudden increases in running or walking volume.",
      "Long periods with the feet unweighted, such as desk work with the feet tucked back under the chair.",
    ],
    realCulprit:
      "Restricted ankle dorsiflexion from a short calf changes how you squat, how you land, and how much your low back has to compensate when you bend. It is a frequent, easily-missed contributor to low back and knee complaints.",
    tendsToBe: "tight",
    clinical: {
      origin:
        "Medial and lateral heads from the posterior surfaces of the femoral condyles",
      insertion: "Calcaneus via the Achilles tendon",
      actions: ["Plantarflexes the ankle", "Assists knee flexion"],
      innervation: "Tibial nerve",
      roots: ["S1", "S2"],
    },
    synergists: ["soleus"],
    fascialLines: ["Superficial Back Line"],
    drills: ["calf-wall-stretch"],
  },
  {
    id: "gluteus-maximus",
    name: "Gluteus maximus",
    latin: "Musculus gluteus maximus",
    view: "posterior",
    layer: 0,
    plain:
      "The largest muscle in the body. It extends the hip — standing up, climbing stairs, sprinting — and it is the main engine that should be driving those movements instead of your low back.",
    feels:
      "Often nothing at all, which is the problem. When it is not working, the low back and hamstrings take the load and complain instead.",
    palpation:
      "Stand and squeeze your buttocks. What hardens under your hand is it.",
    angryBecause: [
      "Sitting on it for eight hours a day.",
      "Movement habits that let the low back and hamstrings do hip extension instead.",
    ],
    realCulprit:
      "A quiet gluteus maximus is one of the most common findings in persistent low back pain. If you cannot feel your glutes working during a bridge, that is the thread to pull.",
    tendsToBe: "weak",
    clinical: {
      origin:
        "Posterior gluteal line of the ilium, posterior sacrum and coccyx, sacrotuberous ligament",
      insertion: "Iliotibial tract and the gluteal tuberosity of the femur",
      actions: [
        "Extends the hip",
        "Externally rotates the hip",
        "Upper fibres abduct, lower fibres adduct",
      ],
      innervation: "Inferior gluteal nerve",
      roots: ["L5", "S1", "S2"],
    },
    antagonists: ["psoas-major"],
    synergists: ["hamstrings-medial", "biceps-femoris"],
    fascialLines: ["Back Functional Line"],
    drills: ["glute-bridge", "bird-dog", "figure-four", "hip-flexor-half-kneel"],
  },
  {
    id: "sciatic-nerve",
    name: "Sciatic nerve",
    view: "posterior",
    layer: 2,
    plain:
      "The thickest nerve in your body, about as wide as your thumb where it leaves the pelvis. It runs from the low back, under the buttock, and down the back of the leg, supplying almost everything below the knee.",
    feels:
      "Sharp, electric or burning pain travelling down the back of the leg, often with pins and needles or numbness. Usually one-sided. Frequently worse with sitting.",
    palpation:
      "Not something to press on. The useful test is whether symptoms travel below the knee — that is the difference between referred muscle pain and true nerve involvement.",
    angryBecause: [
      "A lumbar disc pressing on a nerve root, most often L5 or S1.",
      "Narrowing of the space the nerve travels through.",
      "Compression under a tight piriformis in a minority of people.",
      "Long periods of sitting on a hard edge or a wallet.",
    ],
    realCulprit:
      "Not everything called sciatica is sciatica. Pain that stops at the buttock or upper thigh is usually referred pain from muscle or joint, not nerve compression. Genuine nerve involvement typically travels below the knee and comes with pins and needles, numbness or weakness.",
    clinical: {
      origin: "Lumbosacral plexus, L4–S3",
      insertion:
        "Divides into the tibial and common peroneal nerves, usually near the top of the popliteal fossa",
      actions: [
        "Motor supply to the hamstrings and all muscles below the knee",
        "Sensation to the posterior thigh, and most of the leg and foot",
      ],
      roots: ["L4", "L5", "S1", "S2", "S3"],
    },
    drills: ["sciatic-glide", "figure-four", "cat-cow"],
    redFlags: [
      "Numbness in the saddle area — the parts that would touch a bicycle seat — is a medical emergency. Go to hospital now.",
      "New difficulty controlling your bladder or bowel, with back or leg pain, is a medical emergency.",
      "Weakness in both legs, or rapidly worsening weakness in one, needs urgent assessment.",
      "Pins and needles or numbness in both legs at once needs urgent assessment.",
    ],
  },
];

export const STRUCTURE_BY_ID = new Map(STRUCTURES.map((s) => [s.id, s]));
