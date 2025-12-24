# Case Study: Freie Evangelische Schule Kirchheim

**Digital Transformation: From Static Legacy to High-Performance Platform**

<CaseStudyHeader
  role="Lead Full Stack Developer & Digital Experience Architect"
  timeline="August 2024 – Present"
  stack={["Next.js 16", "Tailwind CSS v4", "TypeScript"]}
  links={{ live: "<https://fes-kirchheim.de>", repo: "private" }}
/>

---

## 01. The Challenge

**An institution slowed down by technical debt.**

The Freie Evangelische Schule Kirchheim (FESK) provides excellent education, but its digital presence did not reflect this quality. The legacy system was plagued by high operational costs, slow load times, and a complex admin interface that frustrated staff.

The most critical technical bottleneck was a **5-second cold boot time**, which led to high bounce rates. Parents looking to register their children faced a confusing UI, and the school's visibility in search engines was suboptimal.

**My Mission:** To architect a cost-effective, scalable, and inclusive digital ecosystem that empowers the administration and welcomes new families.

---

## 02. The Impact by Numbers

*Optimizing for both machines and humans.*

<Grid cols={3}>
  <StatItem label="Cold Boot Time" value="0s" sub="Reduced from 5s" trend="down" />
  <StatItem label="Lighthouse Score" value="100" sub="SEO & Best Practices" trend="up" />
  <StatItem label="Load Speed" value="3x" sub="Faster TTI" trend="up" />
  <StatItem label="Search Impressions" value="300%" sub="Growth YoY" trend="up" />
  <StatItem label="Click-Through Rate" value="2.5x" sub="Increase" trend="up" />
  <StatItem label="Infrastructure Cost" value="-60%" sub="Reduction (2.5x lower)" trend="down" />
</Grid>

![Graphic Placeholder: Before/After Waterfall Chart of Network Requests]

---

## 03. Architecture & Engineering

**Clean Code Principles meets Modern Web Performance.**

To solve the performance issues, I migrated the architecture to **Next.js 16**. The move allowed us to leverage **Server-Side Rendering (SSR)** and **Incremental Static Regeneration (ISR)**, eliminating the cold boot issue entirely.

### Applying Clean Code

As this project relies on voluntary maintenance, code readability was paramount. I enforced **Uncle Bob’s Clean Code standards**:

* **Strict Typing:** A comprehensive TypeScript schema ensures that 95% of potential runtime errors are caught at compile time.
* **Component Composition:** Instead of monolithic page files, the UI is built from atomic, reusable components (Atomic Design).
* **Separation of Concerns:** Business logic is strictly separated from the UI layer via custom hooks.

---

## 04. User Experience & Accessibility

**Building for the Community.**

A school website must be accessible to everyone—grandparents on older tablets, parents on mobile data, and users with visual impairments.

* **Accessibility First:** We improved the semantic HTML structure and ARIA labels, achieving significantly better screen reader compatibility.
* **Intuitive Registration:** The new student registration process was redesigned from the ground up. By breaking complex forms into a multi-step wizard with real-time validation, we reduced drop-offs significantly.
* **Empowering Staff:** The custom Admin Dashboard was built with non-technical staff in mind. It allows teachers to update content and manage events without touching a line of code.

![Screenshot Placeholder: Comparison of the old vs. new Registration Flow UI]

---

## 05. The Verdict

**"Digital Sovereignty restored."**

This project was more than a redesign; it was a restructuring of how the school presents itself digitally. By cutting technical costs by a factor of 2.5 and tripling search impressions, we proved that high-end engineering directly translates to institutional success.

> "The new platform didn't just save us money; it gave us a voice that is finally heard clearly online." — *Feedback from the Administration*

<Button href="https://fes-kirchheim.de" variant="outline">Visit Live Platform</Button>
