//
// PUBLIC_INTERFACE
// exercises.js
// Curated exercise data for the Android TV Fitness Timer and Workout Guide.
// Exports an array of "category sections", each with an array of "items".
// No external assets or network calls; thumbnails are CSS gradient keys or inline SVG data URLs.
//
// Durations align to common TV workout intervals: 30, 45, 60, 90 (seconds).
//

/**
 * Inline SVG generator for simple gradient badge thumbnails.
 * Returns a data URL string that can be used as <img src={...}> or background-image.
 */
function gradientBadge(start = '#2563EB', end = '#F59E0B') {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='160' viewBox='0 0 240 160'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${start}' stop-opacity='0.9'/>
          <stop offset='100%' stop-color='${end}' stop-opacity='0.85'/>
        </linearGradient>
        <linearGradient id='glow' x1='0.2' y1='0' x2='0.8' y2='1'>
          <stop offset='0%' stop-color='white' stop-opacity='0.22'/>
          <stop offset='100%' stop-color='white' stop-opacity='0'/>
        </linearGradient>
      </defs>
      <rect x='0' y='0' width='240' height='160' rx='18' ry='18' fill='url(#g)'/>
      <circle cx='48' cy='40' r='8' fill='white' opacity='0.35'/>
      <circle cx='76' cy='30' r='5' fill='white' opacity='0.25'/>
      <rect x='0' y='0' width='240' height='64' rx='18' ry='18' fill='url(#glow)'/>
    </svg>`
  );
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

/**
 * A few pre-defined gradient keys that can also be used as CSS classes or inline styles.
 * Consumers may choose to interpret strings starting with "gradient:" as CSS tokens.
 */
const gradientKeys = {
  ocean: 'gradient:ocean', // map to linear-gradient(135deg, var(--color-primary), var(--color-secondary))
  amberWave: 'gradient:amberWave', // map to amber-tinted gradient
  deepBlue: 'gradient:deepBlue',
  tealMint: 'gradient:tealMint',
};

// PUBLIC_INTERFACE
export const EXERCISE_SECTIONS = [
  {
    id: 'warmup',
    title: 'Warm-up',
    description: 'Prepare your body with gentle dynamic movements.',
    items: [
      {
        id: 'wu-jumping-jacks',
        name: 'Jumping Jacks',
        category: 'Warm-up',
        durationDefault: 30,
        description: 'Full-body warm-up elevating heart rate and warming major muscle groups.',
        difficulty: 'Beginner',
        equipment: 'None',
        thumbnail: '/assets/jumping-jacks-poster.jpeg',
        tags: ['cardio', 'dynamic', 'warmup'],
      },
      {
        id: 'wu-arm-circles',
        name: 'Arm Circles',
        category: 'Warm-up',
        durationDefault: 45,
        description: 'Loosen shoulders and upper back with controlled forward/backward circles.',
        difficulty: 'Beginner',
        equipment: 'None',
        thumbnail: '/assets/arm-circles-poster.jpeg',
        tags: ['mobility', 'upper-body', 'warmup'],
      },
      {
        id: 'wu-high-knees',
        name: 'High Knees (Light)',
        category: 'Warm-up',
        durationDefault: 45,
        description: 'March or lightly jog in place lifting knees to hip height.',
        difficulty: 'Beginner',
        equipment: 'None',
        thumbnail: '/assets/high-knees-poster.jpeg',
        tags: ['cardio', 'low-impact', 'warmup'],
      },
      {
        id: 'wu-hip-openers',
        name: 'Hip Openers',
        category: 'Warm-up',
        durationDefault: 60,
        description: 'Controlled hip circles and leg swings to mobilize hips.',
        difficulty: 'Beginner',
        equipment: 'Optional',
        thumbnail: '/assets/hip-openers-poster.jpeg',
        tags: ['mobility', 'lower-body', 'warmup'],
      },
    ],
  },
  {
    id: 'strength',
    title: 'Strength',
    description: 'Build muscle and control with bodyweight moves.',
    items: [
      {
        id: 'st-pushups',
        name: 'Push-ups',
        category: 'Strength',
        durationDefault: 45,
        description: 'Upper body push exercise targeting chest, shoulders, and triceps.',
        difficulty: 'Intermediate',
        equipment: 'None',
        thumbnail: '/assets/push-up-poster.jpeg',
        tags: ['upper-body', 'push', 'bodyweight'],
      },
      {
        id: 'st-squats',
        name: 'Air Squats',
        category: 'Strength',
        durationDefault: 60,
        description: 'Lower body compound move emphasizing quads and glutes.',
        difficulty: 'Beginner',
        equipment: 'None',
        thumbnail: '/assets/air-squats-poster.jpeg',
        tags: ['lower-body', 'glutes', 'quads', 'bodyweight'],
      },
      {
        id: 'st-plank',
        name: 'Plank Hold',
        category: 'Strength',
        durationDefault: 60,
        description: 'Core stabilization—maintain a straight line from head to heels.',
        difficulty: 'Intermediate',
        equipment: 'None',
        thumbnail: '/assets/plank-holder-poster.jpeg',
        tags: ['core', 'isometric', 'stability'],
      },
      {
        id: 'st-lunges',
        name: 'Alternating Bridge',
        category: 'Strength',
        durationDefault: 45,
        description: 'Alternate bridging each side to engage glutes and hamstrings; maintain stable core.',
        difficulty: 'Beginner',
        equipment: 'None',
        thumbnail: '/assets/alternating-bridge-poster.jpeg',
        tags: ['lower-body', 'glutes', 'hamstrings', 'core'],
      },
      {
        id: 'st-glute-bridge',
        name: 'Glute Bridge',
        category: 'Strength',
        durationDefault: 60,
        description: 'Engage glutes and hamstrings by lifting hips and squeezing at the top.',
        difficulty: 'Beginner',
        equipment: 'None',
        thumbnail: '/assets/glute-bridge-poster.jpeg',
        tags: ['posterior-chain', 'glutes', 'hamstrings'],
      },
      {
        id: 'st-tricep-dips',
        name: 'Chair Tricep Dips',
        category: 'Strength',
        durationDefault: 45,
        description: 'Use a stable chair or bench to target triceps with controlled dips.',
        difficulty: 'Intermediate',
        equipment: 'Optional',
        thumbnail: '/assets/chair-tricep-poster.jpeg',
        tags: ['upper-body', 'triceps', 'bodyweight'],
      },
    ],
  },
  {
    id: 'cardio',
    title: 'Cardio',
    description: 'Elevate your heart rate with steady and interval options.',
    items: [
      {
        id: 'ca-burpees',
        name: 'Burpees',
        category: 'Cardio',
        durationDefault: 45,
        description: 'Full-body cardio move combining squat, plank, and jump.',
        difficulty: 'Advanced',
        equipment: 'None',
        thumbnail: '/assets/burpees-poster.jpeg',
        tags: ['hiit', 'full-body', 'intense'],
      },
      {
        id: 'ca-mountain-climbers',
        name: 'Mountain Climbers',
        category: 'Cardio',
        durationDefault: 45,
        description: 'Core and cardio move—drive knees toward chest from plank position.',
        difficulty: 'Intermediate',
        equipment: 'None',
        thumbnail: '/assets/mountain-climbers-poster.jpeg',
        tags: ['hiit', 'core', 'cardio'],
      },
      {
        id: 'ca-fast-feet',
        name: 'Fast Feet',
        category: 'Cardio',
        durationDefault: 30,
        description: 'Quick steps in place, maintain athletic posture and rhythm.',
        difficulty: 'Beginner',
        equipment: 'None',
        thumbnail: '/assets/fast-feet-poster.jpeg',
        tags: ['agility', 'low-impact', 'cardio'],
      },
      {
        id: 'ca-jog-place',
        name: 'Jog in Place',
        category: 'Cardio',
        durationDefault: 60,
        description: 'Steady jog or brisk march in place; keep light on your feet.',
        difficulty: 'Beginner',
        equipment: 'None',
        thumbnail: '/assets/jog-in-place-poster.jpeg',
        tags: ['steady-state', 'low-impact', 'cardio'],
      },
      {
        id: 'ca-skater-hops',
        name: 'Skater Hops',
        category: 'Cardio',
        durationDefault: 45,
        description: 'Lateral hops with soft landings—stabilize through hips and core.',
        difficulty: 'Intermediate',
        equipment: 'None',
        thumbnail: '/assets/skater-hops-poster.jpeg',
        tags: ['lateral', 'balance', 'cardio'],
      },
    ],
  },
  {
    id: 'flexibility',
    title: 'Flexibility',
    description: 'Improve mobility, posture, and recovery with stretches.',
    items: [
      {
        id: 'flx-hamstring',
        name: 'Hamstring Stretch',
        category: 'Flexibility',
        durationDefault: 60,
        description: 'Seated or standing stretch targeting hamstrings; keep back neutral.',
        difficulty: 'Beginner',
        equipment: 'Optional',
        thumbnail: '/assets/hamstring-stretch.jpeg',
        tags: ['lower-body', 'stretch', 'recovery'],
      },
      {
        id: 'flx-quad',
        name: 'Quad Stretch',
        category: 'Flexibility',
        durationDefault: 45,
        description: 'Standing quad stretch holding ankle; keep knees aligned.',
        difficulty: 'Beginner',
        equipment: 'Optional',
        thumbnail: '/assets/quad-stretch.jpeg',
        tags: ['lower-body', 'balance', 'stretch'],
      },
      {
        id: 'flx-shoulder',
        name: 'Shoulder Cross-Body',
        category: 'Flexibility',
        durationDefault: 45,
        description: 'Gently pull arm across body to stretch posterior shoulder.',
        difficulty: 'Beginner',
        equipment: 'None',
        thumbnail: '/assets/shoulder-crossing.jpeg',
        tags: ['upper-body', 'stretch', 'mobility'],
      },
      {
        id: 'flx-hip-flexor',
        name: 'Hip Flexor Stretch',
        category: 'Flexibility',
        durationDefault: 60,
        description: 'Kneeling lunge; tuck pelvis slightly to target hip flexors.',
        difficulty: 'Beginner',
        equipment: 'Optional',
        thumbnail: '/assets/hip-flexor-stretch.jpeg',
        tags: ['hip', 'stretch', 'recovery'],
      },
      {
        id: 'flx-cat-cow',
        name: 'Cat-Cow Flow',
        category: 'Flexibility',
        durationDefault: 90,
        description: 'Spinal flexion/extension sequence to mobilize back and improve posture.',
        difficulty: 'Beginner',
        equipment: 'None',
        thumbnail: '/assets/cat-cow-flow.jpeg',
        tags: ['spine', 'mobility', 'yoga'],
      },
    ],
  },
  {
    id: 'core',
    title: 'Core',
    description: 'Stability and strength for your midline.',
    items: [
      {
        id: 'cr-bicycle-crunch',
        name: 'Bicycle Crunches',
        category: 'Core',
        durationDefault: 45,
        description: 'Alternate elbow-to-knee while extending opposite leg—controlled tempo.',
        difficulty: 'Intermediate',
        equipment: 'None',
        thumbnail: gradientBadge('#1D4ED8', '#34D399'),
        tags: ['core', 'rotation', 'abs'],
      },
      {
        id: 'cr-dead-bug',
        name: 'Dead Bug',
        category: 'Core',
        durationDefault: 60,
        description: 'Opposite arm/leg extension from supine, maintaining neutral spine.',
        difficulty: 'Beginner',
        equipment: 'None',
        thumbnail: gradientBadge('#0EA5E9', '#14B8A6'),
        tags: ['stability', 'control', 'beginner'],
      },
      {
        id: 'cr-side-plank',
        name: 'Side Plank',
        category: 'Core',
        durationDefault: 45,
        description: 'Elbow under shoulder, stack feet or stagger for balance; switch sides halfway.',
        difficulty: 'Intermediate',
        equipment: 'None',
        thumbnail: gradientBadge('#2563EB', '#10B981'),
        tags: ['obliques', 'isometric', 'stability'],
      },
      {
        id: 'cr-flutter-kicks',
        name: 'Flutter Kicks',
        category: 'Core',
        durationDefault: 30,
        description: 'Small, quick leg kicks while bracing core and keeping low back down.',
        difficulty: 'Intermediate',
        equipment: 'None',
        thumbnail: gradientKeys.deepBlue,
        tags: ['lower-abs', 'endurance', 'core'],
      },
    ],
  },
];

// PUBLIC_INTERFACE
/**
 * getAllExercises
 * Returns a flattened list of all exercises across sections.
 */
export function getAllExercises() {
  return EXERCISE_SECTIONS.flatMap((s) => s.items);
}

// PUBLIC_INTERFACE
/**
 * findExerciseById
 * Finds a single exercise by ID across all sections.
 */
export function findExerciseById(id) {
  for (const section of EXERCISE_SECTIONS) {
    const found = section.items.find((i) => i.id === id);
    if (found) return found;
  }
  return null;
}

// PUBLIC_INTERFACE
/**
 * getExercisesByTag
 * Returns all exercises that include the provided tag.
 */
export function getExercisesByTag(tag) {
  return getAllExercises().filter((e) => e.tags?.includes(tag));
}

// PUBLIC_INTERFACE
/**
 * getSectionById
 * Returns a section object by id, or null if not found.
 */
export function getSectionById(id) {
  return EXERCISE_SECTIONS.find((s) => s.id === id) || null;
}
