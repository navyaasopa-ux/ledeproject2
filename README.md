## Overview
* The project examines how misinformation spread during the pandemic, who was behind it, where it appeared and circulated most frequently, and what distinct patterns emerged from different types of misinformation.
* By combining quantitative analysis of Princeton University's Empirical Studies of Conflict (ESOC) dataset with an interactive scrollytelling visual web app, this project demonstrates how global digital networks and local societal contexts interacted to drive the spread of false narratives.

## Live Project: https://navyaasopa-ux.github.io/ledeproject2/

## Core Questions
* Where did misinformation concentrate globally, and how did narratives adapt locally?
* What kind of misinformation was spread (e.g., conspiracy theories vs. fake cures vs. false reporting)?
* Who was actually spreading misinformation—ordinary individuals, public figures, media, or state actors?
* Were certain platforms (e.g., WhatsApp vs. Twitter vs. Facebook) more prone to specific types of rumors?
* What underlying motives and narratives drove these false claims?

## The Data
* The dataset analyzes 5,613 unique misinformation stories cataloged across 80+ countries and 35 languages during 2020. Each instance is categorized by:
* Source/Actor Type: Individuals, public figures/institutions, media, state-sponsored actors.
* Platform: WhatsApp, Twitter, Facebook, YouTube, private messaging, etc.
* Geographic Origin / Scope: Global hotspots including India, USA, China, Turkey, and others.
* Primary Motive: Fear/Anxiety, Political Gains, False Hope/Profit, etc.
* Misinformation Type: False Reporting, Conspiracy Theories, Fake Remedies, Unverified Health Statuses, etc.

## Data Analysis & Key Findings

## Individuals Drive the Vast Majority (~80%):
* Approximately 80% of unique false claims were spread or amplified by ordinary citizens acting out of fear, confusion, or anxiety. While institutional actors and public figures accounted for a smaller proportion (~17%), their reach was disproportionately wider.

## Platform Specialization:
* Open social networks (Twitter, Facebook) acted as highways for broad political conspiracies and fake news, whereas closed messaging platforms (WhatsApp) carried highly localized, peer-to-peer false cures and unverified remedies.

## Local Context Rules Global Rumors:
* Contrary to expectations of uniform global rumors, misinformation heavily adapted to pre-existing local political tensions, religious divisions, and cultural contexts.
* United States: High political polarization, anti-vaccination rhetoric, and unproven cures.
* India / South Asia: Religious scapegoating and promotion of unverified traditional remedies.
* Turkey: Fake cures and government response rumors.
* China: Concentrated heavily on individual health statuses due to strict state-mediated information environments.

## Visualization & Technical Architecture
* The web application uses a scrollytelling architecture that synchronizes fixed background visual layers with foreground scrolling text chapters:
* MapLibre GL JS: Powers interactive global map transitions. As users scroll through geographic chapters, JavaScript calls map.flyTo() to dynamically adjust camera coordinates (center, zoom, pitch, bearing) across global hotspots.
* Three.js: Renders interactive 3D WebGL elements (such as globes and virus models) in a dedicated background layer.
* Datawrapper Iframe Embeds: Embedded responsive charts that utilize cross-domain messaging (postMessage API) to deliver accessible, auto-resizing visualizations on motives, actors, and platform distributions across devices.

## Tools Used
* HTML5 / CSS3 / JavaScript (ES6+): Core web application framework and scroll-event orchestration.
* MapLibre GL JS: Interactive 3D vector map rendering engine.
* Three.js: 3D WebGL rendering engine.
* Datawrapper: Responsive quantitative data visualizations.
* Excel / Google Sheets: Initial data exploration, filtering, and cleaning.
* GitHub Pages: Web deployment and hosting.

## Design Choices
* Decoupled Scrollytelling Layout: Using CSS position: fixed and z-index layering keeps the 3D and map canvas fixed in the background while text cards float seamlessly in the foreground.
* Contextual Opacity Cross-Fades: JavaScript dynamically toggles opacity between the MapLibre map and the Three.js canvas based on the user's position in the narrative, preventing visual clutter.
* Responsive Visuals: Embedded Datawrapper charts ensure high color contrast accessibility, crisp typography, and touch-friendly tooltips on mobile devices.

## What I’d Do Next
* Regional Expansion: Expand dataset coverage for deeper comparative analysis between regions in South Asia, Sub-Saharan Africa, and Latin America.
* Temporal Breakdown: Analyze how misinformation motives shifted across specific pandemic phases (e.g., initial outbreak vs. lockdown measures vs. vaccine rollouts).
* Detailed Methodology Section: Document the exact fact-checking criteria and NLP categorization pipelines used to index raw misinformation entries.

## Sources & References
* Data Source: Princeton University Empirical Studies of Conflict (ESOC) Project – COVID-19 Misinformation Dataset
* Visualization Tools: Datawrapper & MapLibre GL

## About Me

I’m Navya Asopa, an Output Producer with the Associated Press in India. I'm fascinated by the global patterns of misinformation, and I'm learning data-driven storytelling as part of the Columbia Lede Data Program 2026.

* Portfolio: [https://navyaasopa.com/]
* Contact:[navyaasopa@gmail.com]
