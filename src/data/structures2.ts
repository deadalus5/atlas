import type { Structure } from "./types";

/**
 * Second batch of the corpus. Anatomical detail here was compiled against the
 * references in references.ts (StatPearls, Kenhub, TeachMeAnatomy).
 */
export const STRUCTURES_2: Structure[] = [
  {
    id: "trapezius-middle",
    name: "Middle trapezius",
    latin: "Trapezius pars transversa",
    aka: ["the burning bit at my desk"],
    view: "posterior",
    layer: 0,
    plain:
      "The flat sheet between your spine and the inner edge of your shoulder blade. Its job is to hold the shoulder blade back and steady while your arm works out in front of you.",
    feels:
      "A hot, nagging burn between the shoulder blades that builds through the afternoon and eases the moment you stand up.",
    palpation:
      "Reach your right hand across your chest and over your left shoulder, and let your fingertips land in the valley between your spine and the inner edge of the shoulder blade. Squeeze your shoulder blades together — the sheet under your fingers will firm up.",
    angryBecause: [
      "A monitor too far away, so both arms reach forward all day.",
      "No armrests, or armrests set too low — the arms then hang from the shoulder girdle.",
      "Long drives with your hands high on the wheel.",
      "Sustained overhead or forward work: hairdressing, dentistry, drywalling.",
    ],
    realCulprit:
      "Almost never the middle trapezius itself. This is the victim, not the villain. It is usually held long and loaded all day by a short pectoralis minor tilting the shoulder blade forward — or the pain is referred here from infraspinatus, the scalenes, or the lower neck joints. Digging a ball into the sore spot feels wonderful for twenty minutes and changes nothing, because the tissue you are pressing is not the tissue misbehaving.",
    tendsToBe: "weak",
    clinical: {
      origin: "Spinous processes of C7–T3 and the lower nuchal ligament",
      insertion:
        "Medial border of the acromion and the superior lip of the spine of the scapula",
      actions: [
        "Retracts the scapula",
        "Stabilises the scapula against forward pull when you reach or push",
        "Assists upward rotation with upper and lower trapezius",
      ],
      innervation: "Spinal accessory nerve (CN XI), proprioception via cervical plexus",
      roots: ["CN XI", "C3", "C4"],
    },
    antagonists: ["serratus-anterior"],
    synergists: ["rhomboid-major", "trapezius-lower"],
    triggerPoints: [
      {
        label: "Mid-fibre point",
        at: [268, 300],
        refersTo:
          "A superficial, burning ache close to the spine between the shoulder blades, sometimes spreading to the base of the neck.",
        regions: ["scapula-medial", "neck-posterior"],
        note: "The burning quality close to the spine distinguishes this from the deeper, duller rhomboid ache further out.",
      },
      {
        label: "Lateral point near the acromion",
        at: [196, 300],
        refersTo: "Ache over the top of the shoulder, toward the collarbone joint.",
        regions: ["shoulder-top"],
        note: "Frequently mistaken for arthritis of the AC joint — unlike true AC pain, this does not sharpen with a hard cross-body arm hug.",
      },
    ],
    drills: ["doorway-pec", "wall-angel", "prone-y-raise", "trap-ball-wall", "open-book"],
    ergonomics: [
      "Support your forearms. Each unsupported arm is about 4kg hanging off your shoulder girdle for the whole working day.",
      "Bring the keyboard and mouse close enough that your elbows stay by your sides.",
    ],
  },
  {
    id: "trapezius-lower",
    name: "Lower trapezius",
    latin: "Trapezius pars ascendens",
    view: "posterior",
    layer: 0,
    plain:
      "The long V running from the middle of your back up to the inner tip of the shoulder blade. It pulls the shoulder blade down and tilts it so the socket points upward when you raise your arm. It is one of the most commonly weak muscles in the body.",
    feels:
      "Usually nothing at all — it rarely hurts loudly. It just quietly stops working and lets other things hurt instead, most often the front of the shoulder when you reach overhead.",
    palpation:
      "Reach one arm forward and up at about 45 degrees, thumb up. With the other hand, feel a hand's width below the inner tip of that shoulder blade, close to the spine. Lift the arm a little higher against imaginary resistance and a thin diagonal band will tighten under your fingers.",
    angryBecause: [
      "A desk job involves almost no overhead reaching, so it simply de-conditions.",
      "Bench pressing and push-ups with no matching overhead or pulling work.",
      "Sustained shrugging — cold rooms, stress, cradling a phone — which switches it off.",
      "Overhead sport that fatigues it faster than it is trained.",
    ],
    realCulprit:
      "When someone gets a pinch at the front of the shoulder reaching overhead, the lower trapezius is very often the real cause even though it is not where it hurts. Without it the shoulder blade fails to rotate upward, the space under the acromion narrows, and the cuff tendons get squeezed. People chase the painful shoulder for months while the actual failure sits nine inches away.",
    tendsToBe: "weak",
    clinical: {
      origin: "Spinous processes of approximately T4–T12",
      insertion:
        "Via a triangular aponeurosis to the tubercle at the medial end of the spine of the scapula",
      actions: [
        "Depresses the scapula",
        "Upwardly rotates the scapula, which is what opens the space under the acromion",
        "Posteriorly tilts the scapula",
      ],
      innervation: "Spinal accessory nerve (CN XI)",
      roots: ["CN XI", "C3", "C4"],
    },
    antagonists: ["trapezius-upper", "levator-scapulae"],
    synergists: ["trapezius-middle", "serratus-anterior"],
    triggerPoints: [
      {
        label: "Lower fibre point",
        at: [272, 420],
        refersTo:
          "Up to the tip of the shoulder near the collarbone joint, and often into the upper neck and just above the shoulder blade.",
        regions: ["shoulder-top", "neck-posterior", "scapula-medial"],
        note: "A referral pattern that travels a long way upward from a muscle low in the back.",
      },
    ],
    drills: ["prone-y-raise", "wall-angel", "doorway-pec", "open-book"],
    ergonomics: [
      "If you never reach overhead in daily life, you have to train it deliberately — nothing else will.",
    ],
  },
  {
    id: "iliocostalis",
    name: "Iliocostalis",
    latin: "Musculus iliocostalis lumborum",
    aka: ["erector spinae", "the ropes beside my spine"],
    view: "posterior",
    layer: 2,
    plain:
      "The outer of the two long ropes you can feel running up either side of your spine. It slows you down as you bend forward and hauls you back upright.",
    feels:
      "A hot, tight band beside the spine. The ache often spreads down into the buttock, which is why people become convinced their hip is the problem when it is not.",
    palpation:
      "Find the bony knobs down the centre of your low back, then slide two or three finger-widths out toward your flank. Press in — a firm vertical cord about the thickness of your thumb. Arch slightly and it bulges; slump and it should go soft. If it never goes soft, that is guarding, not shortness.",
    angryBecause: [
      "Sitting for two hours, then standing up and immediately bending to pick something off the floor.",
      "Deadlifts, rows or swings where the back rounds and then jerks straight.",
      "Gardening and low-shelf work — long periods of sustained half-bend.",
      "Long drives with the seat reclined and the pelvis rolled back.",
    ],
    realCulprit:
      "Stiff hips. If your hip joints do not fold, your low back folds instead — every shoe you tie, every dishwasher you load. Chasing the tight band with stretching rarely works; teaching the hips to hinge does. And a rock-hard erector after a flare-up is almost always guarding: it softens when the spine feels safe, not when you pull harder on it.",
    tendsToBe: "both",
    clinical: {
      origin:
        "Common erector spinae aponeurosis from the sacrum, posterior iliac crest, sacroiliac and supraspinous ligaments, and the deep thoracolumbar fascia",
      insertion:
        "Inferior borders of the angles of the lower six to nine ribs, and the tips of the lumbar transverse processes",
      actions: [
        "Extends the spine",
        "Side-bends the trunk to the same side",
        "Controls the descent into forward bending eccentrically",
      ],
      innervation: "Lateral branches of the posterior rami",
      roots: ["Segmental, T1–L3"],
    },
    synergists: ["longissimus", "spinalis", "multifidus"],
    fascialLines: ["Superficial Back Line"],
    triggerPoints: [
      {
        label: "Upper lumbar point",
        at: [258, 470],
        refersTo:
          "Downward into the middle of the buttock on the same side, and sometimes forward into the side of the abdomen.",
        regions: ["glute-mid", "lumbar"],
      },
      {
        label: "Lower lumbar point",
        at: [252, 530],
        refersTo:
          "Across the upper buttock and the sacroiliac area, sometimes spilling into the outer hip.",
        regions: ["glute-upper", "si-joint", "hip-lateral"],
      },
    ],
    drills: ["cat-cow", "open-book", "foam-roll-thoracic", "bird-dog", "child-pose-lat"],
    ergonomics: [
      "Learn to hinge at the hips rather than round at the waist. It is the single highest-value movement change for this muscle.",
      "Bring loads close to your body before you lift — distance from your chest is what this muscle pays for.",
    ],
  },
  {
    id: "longissimus",
    name: "Longissimus",
    latin: "Musculus longissimus thoracis",
    aka: ["erector spinae"],
    view: "posterior",
    layer: 2,
    plain:
      "The inner of the two long ropes beside your spine, sitting just outside the bony knobs. It is the tallest muscle in your back, running from the pelvis right up toward the neck, and it holds you upright against gravity.",
    feels:
      "An ache that tends to run downward into the buttock and across the top of the pelvis — even though the sore muscle itself is higher up.",
    palpation:
      "Find the bony knobs, then slide about one finger-width off the midline — closer in than iliocostalis. Hold both arms out in front of you at shoulder height: the cord will firm up immediately, because carrying weight in front of you is exactly this muscle's job.",
    angryBecause: [
      "Holding a load away from your body — a car seat, a box, a bag of compost.",
      "Sitting forward at a laptop with the screen too low, so the whole upper body hangs on these muscles.",
      "Standing for hours at a counter or workbench.",
      "A stiff mid-back that forces the lumbar segments to do all the movement.",
    ],
    realCulprit:
      "Your mid-back and your hips. Longissimus is a middleman — it takes the strain whenever the joints above and below stop sharing the work. A very common driver is simply holding things too far from your body. Bring the load in and half its workload disappears.",
    tendsToBe: "both",
    clinical: {
      origin:
        "Common erector spinae aponeurosis on the sacrum, medial iliac crest and lumbar spinous processes",
      insertion:
        "Transverse processes of the lumbar and thoracic vertebrae, and the ribs between their tubercles and angles",
      actions: [
        "Extends the vertebral column",
        "Side-bends to the same side",
        "Controls forward bending eccentrically",
      ],
      innervation: "Lateral branches of the posterior rami",
      roots: ["Segmental"],
    },
    synergists: ["iliocostalis", "spinalis", "multifidus"],
    fascialLines: ["Superficial Back Line"],
    triggerPoints: [
      {
        label: "Lower thoracic point",
        at: [280, 430],
        refersTo:
          "Downward to the buttock and the top of the pelvic crest on the same side — the classic pattern of pain felt well below the actual trigger point.",
        regions: ["glute-upper", "lumbar"],
      },
    ],
    drills: ["cat-cow", "bird-dog", "foam-roll-thoracic", "open-book", "child-pose-lat"],
  },
  {
    id: "infraspinatus",
    name: "Infraspinatus",
    latin: "Musculus infraspinatus",
    aka: ["rotator cuff"],
    view: "posterior",
    layer: 0,
    plain:
      "A triangular muscle filling the back surface of your shoulder blade, below its bony ridge. It turns your arm outward and holds the ball of the shoulder centred in its socket while you use the arm.",
    feels:
      "Deep pain at the front of the shoulder — which is the confusing part, because the muscle is at the back. Often worse lying on that side, and it can make reaching behind you to a back pocket or a seatbelt painful.",
    palpation:
      "Find the bony ridge across the top of your shoulder blade, then press just below it, in the flat area. Turning your arm outward against resistance will make it firm up under your fingers.",
    angryBecause: [
      "Sleeping on that shoulder.",
      "Repeated overhead work or throwing.",
      "Long hours with the arm reaching forward on a mouse.",
      "Bench pressing without matching external rotation work.",
    ],
    realCulprit:
      "This is one of the great impostors of the upper body. Its referral pattern lands deep in the front of the shoulder and can run down the outside of the arm — so people treat the front of the shoulder, or their neck, for months while the actual tender tissue sits on the back of the shoulder blade.",
    tendsToBe: "both",
    clinical: {
      origin: "Infraspinous fossa of the scapula",
      insertion: "Middle facet of the greater tubercle of the humerus",
      actions: [
        "Externally rotates the arm",
        "Stabilises the head of the humerus in the glenoid",
      ],
      innervation: "Suprascapular nerve",
      roots: ["C5", "C6"],
    },
    antagonists: ["latissimus-dorsi"],
    synergists: ["teres-minor", "supraspinatus"],
    triggerPoints: [
      {
        label: "Main belly point",
        at: [214, 350],
        refersTo:
          "Deep into the front of the shoulder joint, and often down the outer arm to the forearm. Very frequently mistaken for a neck problem or shoulder bursitis.",
        regions: ["shoulder-top", "arm-posterior"],
        note: "One of the most reliably reproducible referral patterns in the body — press it and many people say “that is exactly my pain”, in a place several inches away.",
      },
    ],
    drills: ["doorway-pec", "trap-ball-wall", "wall-angel", "open-book"],
  },
  {
    id: "splenius-capitis",
    name: "Splenius capitis",
    latin: "Musculus splenius capitis",
    view: "posterior",
    layer: 1,
    plain:
      "A strap running diagonally from the upper spine to the base of the skull behind the ear. It extends and turns the head to the same side.",
    feels:
      "A deep ache at the back of the head, often described as pain 'at the top of the head' or behind the eye. Turning to look over one shoulder is stiff.",
    palpation:
      "Place your fingers halfway between the bump at the base of your neck and the bone behind your ear, then turn your head that way against gentle resistance.",
    angryBecause: [
      "A screen off to one side, so you spend the day rotated.",
      "Sleeping face-down with the head turned.",
      "Sustained head-forward posture at a laptop.",
      "Whiplash-type incidents.",
    ],
    realCulprit:
      "Headache that starts at the back of the head and climbs over the top is very often coming from the muscles and joints at the top of the neck rather than from the head itself. Treating it as a headache rather than a neck problem is why paracetamol keeps not working.",
    tendsToBe: "tight",
    clinical: {
      origin: "Ligamentum nuchae and the spinous processes of C7–T3",
      insertion: "Mastoid process and lateral third of the superior nuchal line",
      actions: [
        "Extends the head and neck",
        "Rotates and side-bends the head to the same side",
      ],
      innervation: "Posterior rami of the middle cervical nerves",
      roots: ["C3", "C4", "C5"],
    },
    synergists: ["semispinalis-capitis", "trapezius-upper", "levator-scapulae"],
    triggerPoints: [
      {
        label: "Mid-belly point",
        at: [280, 240],
        refersTo:
          "Up over the back of the skull to the top of the head, on the same side.",
        regions: ["head-occipital", "head-temporal", "neck-posterior"],
      },
    ],
    drills: ["chin-tuck", "upper-trap-stretch", "levator-scap-stretch"],
    ergonomics: [
      "Put the screen directly in front of you. Working rotated for hours is what loads this muscle asymmetrically.",
    ],
  },
  {
    id: "biceps-femoris",
    name: "Biceps femoris",
    latin: "Musculus biceps femoris",
    aka: ["outer hamstring"],
    view: "posterior",
    layer: 0,
    plain:
      "The outer of the hamstrings, running from your sitting bone down to the outside of the knee. It bends the knee and extends the hip, and it is the one most often strained when sprinting.",
    feels:
      "Tightness down the back and outside of the thigh, and often a deep ache right at the sitting bone if the tendon is irritated.",
    palpation:
      "Sit on the edge of a chair and feel the bony sitting bone under one buttock, then trace the thick cord that runs from there toward the outside of the back of the knee.",
    angryBecause: [
      "Sitting on it for hours, compressing the tendon against the sitting bone.",
      "Sudden increases in sprinting or hill running.",
      "Repeated deep stretching of an already irritated tendon, which makes tendon pain worse rather than better.",
    ],
    realCulprit:
      "Hamstrings that feel permanently tight are often not short at all — they are being held protectively long by a pelvis tipped forward, or they are working overtime because the glutes are not extending the hip. Stretching a hamstring that is already lengthened is a common way to keep the problem going.",
    tendsToBe: "both",
    clinical: {
      origin:
        "Long head from the ischial tuberosity; short head from the linea aspera of the femur",
      insertion: "Head of the fibula",
      actions: [
        "Flexes the knee",
        "Extends the hip (long head)",
        "Externally rotates the flexed knee",
      ],
      innervation:
        "Tibial division of the sciatic nerve (long head), common peroneal division (short head)",
      roots: ["L5", "S1", "S2"],
    },
    antagonists: ["psoas-major"],
    synergists: ["hamstrings-medial", "gluteus-maximus"],
    fascialLines: ["Superficial Back Line"],
    drills: ["glute-bridge", "figure-four", "cat-cow"],
    redFlags: [
      "Sudden severe pain with a pop while sprinting, followed by bruising, needs assessment rather than stretching.",
    ],
  },
  {
    id: "soleus",
    name: "Soleus",
    latin: "Musculus soleus",
    view: "posterior",
    layer: 2,
    plain:
      "The broad, flat muscle underneath your calf. Unlike the gastrocnemius above it, it does not cross the knee — so it is the one that works when your knee is bent, which is most of walking, and all of standing.",
    feels:
      "A deep, dull tightness low in the calf, often noticed as difficulty squatting with the heels down or as an ache after long standing.",
    palpation:
      "Sit with your knee bent to 90 degrees and press either side of the lower calf, below the bulge of the gastrocnemius. Push your toes into the floor and the muscle under your fingers firms up.",
    angryBecause: [
      "Heeled shoes, which hold it short all day.",
      "Long standing shifts.",
      "Sudden increases in running volume, particularly hills.",
    ],
    realCulprit:
      "Restricted ankle dorsiflexion from a short soleus quietly changes how you squat, how you land and how much your low back has to compensate when you bend. It is one of the most under-checked contributors to knee and low back complaints.",
    tendsToBe: "tight",
    clinical: {
      origin: "Soleal line of the tibia and the posterior head of the fibula",
      insertion: "Calcaneus via the Achilles tendon",
      actions: [
        "Plantarflexes the ankle",
        "Acts as the peripheral heart, pumping venous blood back up the leg during standing and walking",
      ],
      innervation: "Tibial nerve",
      roots: ["S1", "S2"],
    },
    synergists: ["gastrocnemius"],
    fascialLines: ["Superficial Back Line"],
    drills: ["calf-wall-stretch"],
  },
  {
    id: "thoracolumbar-fascia",
    name: "Thoracolumbar fascia",
    latin: "Fascia thoracolumbalis",
    aka: ["the diamond in my low back"],
    view: "posterior",
    layer: 1,
    plain:
      "A thick diamond-shaped sheet of connective tissue across your low back. It is not a muscle — it is the anchor that ties your lats, your glutes and your deep core into one continuous system, so force from one arm can travel across it to the opposite leg.",
    feels:
      "Broad, diffuse low back tightness that is hard to point at with one finger, often described as a band across the back rather than a spot.",
    palpation:
      "Place a flat hand over your low back either side of the spine, above the pelvis. This is the sheet under your palm.",
    angryBecause: [
      "Prolonged flexed postures.",
      "Heavy repeated lifting.",
      "Sustained lack of movement — fascia responds to being loaded in varied ways, and desk work supplies almost none.",
    ],
    realCulprit:
      "The thoracolumbar fascia is richly supplied with nerve endings and is a plausible source of low back pain in its own right. But it is also the reason a tight lat on one side can translate into low back symptoms on the other — force genuinely crosses here, so problems do not stay local.",
    clinical: {
      origin: "Spinous processes, sacrum and iliac crest",
      insertion:
        "Blends with latissimus dorsi, gluteus maximus, the abdominal muscles and the erector spinae sheath",
      actions: [
        "Transfers load between the trunk and the limbs",
        "Provides attachment and hydraulic support for the erector spinae",
      ],
    },
    fascialLines: ["Back Functional Line", "Superficial Back Line"],
    drills: ["child-pose-lat", "cat-cow", "ql-side-bend", "bird-dog"],
  },
  {
    id: "tensor-fasciae-latae",
    name: "Tensor fasciae latae & IT band",
    latin: "Musculus tensor fasciae latae",
    aka: ["TFL", "IT band"],
    view: "posterior",
    layer: 1,
    plain:
      "A small muscle at the front of your hip that tensions a long, thick sheet of connective tissue running down the outside of your thigh to just below the knee. Together they help stabilise the pelvis when you stand on one leg.",
    feels:
      "Tightness or burning down the outside of the thigh, sometimes with pain on the outside of the knee in runners.",
    palpation:
      "Find the bony point at the front of your hip, then move a couple of centimetres down and out. Lift your knee slightly and rotate the leg inward — the small muscle firming under your fingers is the TFL.",
    angryBecause: [
      "Sitting, which holds it short.",
      "Running, especially with a hip that drops on each step.",
      "Standing hip-shot on one leg for long periods.",
    ],
    realCulprit:
      "The IT band is famously blamed and famously hard to change — it is a dense sheet with roughly the tensile strength of steel, and foam rolling does not lengthen it. The TFL usually tightens because the gluteus medius is not doing its share of stabilising the pelvis. Strengthen the glute and the outer thigh usually settles.",
    tendsToBe: "tight",
    clinical: {
      origin: "Anterior iliac crest and the anterior superior iliac spine",
      insertion: "Iliotibial tract, which inserts at Gerdy's tubercle on the tibia",
      actions: [
        "Abducts and internally rotates the hip",
        "Assists hip flexion",
        "Tensions the iliotibial tract to stabilise the knee",
      ],
      innervation: "Superior gluteal nerve",
      roots: ["L4", "L5", "S1"],
    },
    antagonists: ["gluteus-maximus"],
    synergists: ["gluteus-medius", "gluteus-minimus"],
    fascialLines: ["Lateral Line"],
    drills: ["clamshell", "glute-bridge", "side-plank", "figure-four"],
  },
  {
    id: "gluteus-minimus",
    name: "Gluteus minimus",
    latin: "Musculus gluteus minimus",
    view: "posterior",
    layer: 2,
    plain:
      "The smallest and deepest of the three gluteal muscles, sitting under gluteus medius on the outer pelvis. It abducts the hip and helps keep the pelvis level when you stand on one leg.",
    feels:
      "Deep outer hip and buttock pain that can run a long way down the leg — often the whole outside or back of the thigh and calf.",
    palpation:
      "Hard to isolate by touch, as it sits under gluteus medius. Press deeply on the outer hip just above the bony point at the side and slightly behind.",
    angryBecause: [
      "Prolonged sitting.",
      "Standing with your weight parked on one leg.",
      "Walking or running with a dropping hip.",
    ],
    realCulprit:
      "This muscle produces what is probably the most convincing sciatica impersonation in the body. Its referral runs down the outside or back of the leg all the way to the ankle, and it is regularly investigated as a disc problem. If your leg pain has no numbness, no weakness and no pins and needles, a tender gluteus minimus is well worth checking before anything else.",
    tendsToBe: "weak",
    clinical: {
      origin: "Outer surface of the ilium between the anterior and inferior gluteal lines",
      insertion: "Anterior facet of the greater trochanter",
      actions: [
        "Abducts the hip",
        "Internally rotates the hip",
        "Stabilises the pelvis in single-leg stance",
      ],
      innervation: "Superior gluteal nerve",
      roots: ["L4", "L5", "S1"],
    },
    synergists: ["gluteus-medius", "tensor-fasciae-latae"],
    triggerPoints: [
      {
        label: "Anterior fibres",
        at: [214, 600],
        refersTo:
          "Down the outer thigh and outer calf, sometimes to the ankle. Reproduces a convincing sciatica pattern.",
        regions: ["hip-lateral", "thigh-lateral", "calf"],
      },
      {
        label: "Posterior fibres",
        at: [240, 614],
        refersTo: "Across the lower buttock and down the back of the thigh and calf.",
        regions: ["glute-mid", "thigh-posterior", "calf"],
      },
    ],
    drills: ["clamshell", "side-plank", "glute-bridge", "figure-four"],
    redFlags: [
      "True nerve involvement usually brings numbness, pins and needles or weakness. If you have those, get assessed rather than assuming it is muscular.",
    ],
  },
  {
    id: "sacroiliac-joint",
    name: "Sacroiliac joint",
    aka: ["SI joint", "the dimple in my back"],
    view: "posterior",
    layer: 3,
    plain:
      "The joint where the base of your spine meets your pelvis, one on each side. It is extremely strong and moves only a few millimetres — its job is transferring the entire load of your upper body into your legs.",
    feels:
      "Pain in a small area right over the dimple at the base of the spine, usually one-sided. Often worse standing on one leg, rolling over in bed, or getting out of a car.",
    palpation:
      "Find the two dimples at the base of your spine. The joint sits directly beneath each one.",
    angryBecause: [
      "Pregnancy and the postpartum period, when ligament laxity increases.",
      "A fall onto one buttock.",
      "Prolonged asymmetric loading — standing hip-shot, carrying a child on one hip.",
      "Sudden unexpected loading, like stepping into a hole off a kerb.",
    ],
    realCulprit:
      "You will be told your SI joint is 'out' and needs putting back. It almost certainly is not. Clinicians cannot reliably agree with each other on pelvic position, the joint moves only a couple of millimetres, and nothing has been shown to change its position lastingly. What does help is loading it well — the joint is stabilised by the muscles and fascia crossing it, so glute and trunk strength matters far more than alignment.",
    clinical: {
      origin: "Articulation between the sacrum and the ilium",
      insertion:
        "Reinforced by the anterior and posterior sacroiliac, sacrotuberous and sacrospinous ligaments",
      actions: [
        "Transfers load between the trunk and the lower limbs",
        "Permits a few millimetres of nutation and counter-nutation",
      ],
      innervation: "Posterior rami of L4–S3",
      roots: ["L4", "L5", "S1", "S2", "S3"],
    },
    drills: ["glute-bridge", "clamshell", "side-plank", "bird-dog", "figure-four"],
    redFlags: [
      "Inflammatory back pain — morning stiffness lasting over an hour, improving with exercise and worse with rest, in someone under 45 — is a different pattern and warrants a medical opinion.",
    ],
  },
];
