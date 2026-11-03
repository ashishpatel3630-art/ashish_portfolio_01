# Ashish Mewada — Walkable 3D Portfolio

A first-person, physics-backed portfolio world built with Next.js, React Three Fiber, Three.js, Rapier, and GSAP. Visitors can explore seven connected architectural zones along one continuous, collision-aware world; this is a WebGL environment, not a scroll-driven camera tour.

## Requirements

- Node.js 20.9 or later
- npm
- A modern browser with WebGL enabled

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run the production checks:

```bash
npm run lint
npm run build
npm run start
```

## Controls

| Input | Action |
| --- | --- |
| WASD | Walk |
| Mouse | Look around (pointer lock after starting; click-and-drag fallback) |
| Space | Jump |
| Shift | Sprint |
| E | Inspect the object at the center of the view |
| Escape | Pause / resume |
| R | Reset to the entrance |
| Navigation map | Walk toward a selected room; it does not teleport |
| Touch joystick | Mobile movement |
| Touch buttons | Jump, inspect, sprint, and pause |
| Touch-drag on the world | Look around |

Use the fullscreen and ambient-audio controls in the upper-right. Ambient audio is synthesized locally by the browser and is off by default. Reduced-motion preferences are respected by avoiding entrance-panel motion.

## World layout

`components/WalkableWorld.tsx` contains one persistent R3F Canvas, a Rapier physics world, a cinematic idle camera reveal, the player controller, a sliding entrance gate, room architecture, collisions, lighting, particles, and 3D exhibits. The player is a dynamic capsule rigid body with gravity and solid floor, wall, gate, and exhibit colliders. The seven connected zones are entrance plaza, identity gallery, project museum, AI laboratory, experience center, resume center, and contact center. The room map is an alternative navigation mode that walks the player to a selected destination.

The floor plan is a continuous 18-unit-wide architectural spine, divided by portal walls with a central walk-through opening. Room centers are 18 units apart along the z axis: entrance (0), identity gallery (-18), project museum (-36), AI lab (-54), experience (-72), resume (-90), contact (-108). Project and experience exhibits sit on physical stands; the identity, AI systems, resume, and contact displays are mounted around the gallery walls. The entrance gate is a pair of Rapier kinematic panels that slide aside when visitors use the center sensor or the alternative destination map.

`components/WorldPortfolio.tsx` contains the accessible HTML controls, room map, pause screen, interaction terminals, and contact form. HTML is used for controls and readable interaction panels; the explorable rooms and displays are rendered in Three.js.

Project descriptions and links come from `data/projects.ts`; skill labels come from `data/skills.ts`.

## Assets

```text
public/
  resume.pdf
  portfolio-assets/
    portrait.jpeg                # Supplied personal portrait
    projects/
      patrexo.svg                # Original concept visualization
      karya-ai.svg               # Original concept visualization
      ogi-ride.svg                # Original concept visualization
      rag-assistant.svg           # Original concept visualization
```

The identity gallery and welcome panel use the supplied personal portrait at `public/portfolio-assets/portrait.jpeg`. The project displays use original SVG concept artwork; these are clearly labeled and are not presented as live product screenshots. Replace the portrait by updating its image paths in `components/WorldPortfolio.tsx` and `components/WalkableWorld.tsx`; replace project art with approved screenshots by updating the paths in `data/projects.ts`.

`public/resume.pdf` currently exists but is an empty, invalid file. The world checks the PDF header and disables its open, download, and print links until it is replaced with a valid approved PDF. This avoids presenting a blank file as a working resume.

## Contact email setup

The contact form collects a name, email, subject, and message, validates fields in the browser and on the server, and includes a honeypot field for basic spam protection. It sends mail through Resend; it does not report success unless Resend accepts the message. Without credentials, the API responds with an explicit configuration error and the UI offers the direct email address.

1. Create a Resend account and verify the sender domain/address.
2. Set these server-side environment variables in `.env.local` for local development and in the deployment provider for production:

   ```text
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=Portfolio <portfolio@your-verified-domain.example>
   CONTACT_TO_EMAIL=ashishpatel3630@gmail.com
   ```

3. Restart the Next.js server after changing environment variables.

Do not expose `RESEND_API_KEY` through a `NEXT_PUBLIC_` variable or commit it to source control. The route is `app/api/contact/route.ts`.

## Deployment

Deploy as a standard Next.js App Router application (for example, on Vercel):

1. Import the repository and select the Next.js framework preset.
2. Use `npm install` as the install command and `npm run build` as the build command.
3. Configure the three contact-email environment variables in the deployment project.
4. Ensure the deployment serves `public/resume.pdf` and the optional portfolio assets.
5. Test pointer lock, keyboard movement, touch controls, room collisions, project/repository links, PDF links, and contact delivery on the deployed HTTPS origin.

The contact form requires a server-capable Next.js deployment; static export alone will not provide the API route. The scene uses procedural low-poly architecture and no external model downloads, reducing asset-transfer and runtime setup costs.
# ashish_portfolio_01
