# THRESHOLD: SYNERGY SYSTEMS

### How Abilities Talk to Each Other

---

## THE DESIGN PROBLEM

The original Conduit Harmonic system was a forced rotation: Mend → Ward → Amplify → Purge, with penalties for staying in one mode too long. It worked mechanically but violated the game's foundational promise — that any class can build any direction and discover their own identity through investment.

A forced rotation says: "Here is the correct way to play this class." A synergy system says: "Here are the ways your abilities interact. Find the pattern that fits your build."

The difference is authorship. In a forced rotation, the designer authors the player's combat loop. In a synergy system, the designer authors the *rules of interaction* and the player authors the loop. The designer's job is to make the interaction rules rich enough that hundreds of viable loops emerge, but coherent enough that none of them feel random.

This document replaces the Harmonic system with something universal: a set of interaction mechanics that apply to every class, every skill, and every build — but produce dramatically different gameplay depending on which skills you've invested in.

---

## PART 1: THE RESONANCE SYSTEM

### Core Concept: Ability Categories and Resonance

Every ability in the game belongs to one of five **Expression Categories** based on what it does, not which skill tree it lives in:

| Category | What It Does | Color Signal | Examples |
|----------|-------------|--------------|----------|
| **Strike** | Deals direct damage (melee, ranged, or Expression) | Red | Overdrive, Hoogsteen Lash, Excitotoxic Spike, Bone Rend |
| **Sustain** | Heals, regenerates, or restores resources | Green | Bloodrush, Renewal Bloom, Second Wind, Field Synthesis |
| **Shield** | Prevents, mitigates, or absorbs incoming damage | Blue | Calcified Response, Interferon Field, Adaptive Barrier, Cryptobiotic Shell |
| **Disrupt** | Applies crowd control, debuffs, or removes enemy capabilities | White | Neural Silence, Cortisol Flood, Neurotoxic Strike, Signal Severance |
| **Augment** | Buffs self or allies, enhances stats, enables capabilities | Gold | Quorum Pulse, Adrenal Dump, Threat Read, Chemical Charm |

Some abilities have a primary and secondary category. Pyroptotic Burst is Strike (primary) + Disrupt (secondary, via the burn debuff). Threat Pulse is Shield (primary) + Augment (secondary, via threat generation). The primary category determines Resonance interactions; the secondary provides bonus synergy in specific builds.

### How Resonance Works

When you use an ability, its category is tracked in a rolling **Resonance Buffer** — a short-term memory of your last 4 ability activations. The buffer creates **Resonance States** based on what combination of categories it contains.

The buffer updates in real time:
```
Action 1: [Strike] → Buffer: [Strike, _, _, _]
Action 2: [Shield] → Buffer: [Strike, Shield, _, _]
Action 3: [Strike] → Buffer: [Strike, Shield, Strike, _]
Action 4: [Sustain] → Buffer: [Strike, Shield, Strike, Sustain]
Action 5: [Disrupt] → Buffer: [Shield, Strike, Sustain, Disrupt] ← oldest entry falls off
```

The buffer is always the **last 4 abilities used**. It is visible to the player as a small HUD element — four colored pips showing the current composition.

### Resonance States

Specific combinations in the buffer produce **Resonance States** — temporary enhancements that last until the buffer changes enough to break the pattern. Resonance States are not exclusive; multiple can be active simultaneously if the buffer satisfies multiple conditions.

---

#### DUAL RESONANCE (2 of same category in buffer)

The simplest Resonance. Using two abilities of the same category within your last four actions produces a minor bonus to that category.

| Dual State | Trigger | Effect |
|------------|---------|--------|
| **Strike Tempo** | 2+ Strike in buffer | +8% damage on next Strike ability |
| **Sustain Flow** | 2+ Sustain in buffer | +10% healing on next Sustain ability, -5% Strand cost |
| **Shield Wall** | 2+ Shield in buffer | +12% shield/mitigation strength on next Shield ability |
| **Disrupt Chain** | 2+ Disrupt in buffer | +15% duration on next Disrupt ability |
| **Augment Stack** | 2+ Augment in buffer | +8% potency on next Augment ability |

Dual Resonance rewards commitment — if you're focusing on damage, your damage gets slightly better. If you're focusing on healing, your heals get slightly more efficient. This is the "spam one thing" state and it's intentionally the weakest Resonance. It works. It's safe. It's boring.

---

#### PAIRED RESONANCE (2 specific different categories in buffer)

Using two abilities from *specific different categories* within your last four actions produces a stronger, more interesting bonus. These are the **synergy pairs** — combinations that the game's biology makes logical and that reward players for mixing disciplines.

| Pair | Categories | Effect | Biological Logic |
|------|-----------|--------|-----------------|
| **Counterflow** | Strike + Sustain | Your next Strike heals you for 15% of damage dealt | Tissue damage triggers regenerative response |
| **Fortification** | Shield + Sustain | Your next Shield ability also applies a HoT to the target | Protective response activates repair pathways |
| **Pressure** | Strike + Disrupt | Your next Disrupt ability deals bonus damage equal to 20% of your last Strike | Cellular damage makes the target vulnerable to systemic disruption |
| **Overwatch** | Shield + Augment | Your next Shield generates 25% bonus threat and grants the shielded target +5% damage for 6s | Defensive positioning enables offensive opportunity |
| **Exploitation** | Disrupt + Strike | Your next Strike against a disrupted target gains +12% crit chance | Compromised systems present vulnerable targets |
| **Stabilization** | Sustain + Disrupt | Your next Sustain ability also cleanses 1 debuff from the target | Healing response purges foreign agents |
| **Catalyst Loop** | Strike + Augment | Your next Strike costs 15% less resource | Enhanced state reduces metabolic cost of exertion |
| **Iron Harmony** | Shield + Disrupt | Your next Shield reflects 10% of blocked damage back to the attacker | Defensive systems convert absorbed force into counterattack |
| **Vital Surge** | Sustain + Augment | Your next Sustain ability also grants the target +8% to their highest attribute for 8s | Healing surplus enhances peak capability |
| **Signal Lock** | Disrupt + Augment | Your next Disrupt ability also reveals the target's current HP, resistances, and active buffs | Disrupted systems leak information |

There are 10 possible pairs from 5 categories. Every single one produces a meaningful synergy. This means that **any two skills from different categories create value when used together** — the system never punishes mixing.

---

#### TRIAD RESONANCE (3 specific different categories in buffer)

Using three different categories within your last four actions produces the strongest standard Resonance. Triads are where build identity really emerges — the three categories you naturally cycle through define your combat personality.

| Triad | Categories | Effect | Build Identity |
|-------|-----------|--------|----------------|
| **Vanguard Triad** | Strike + Shield + Augment | Next ability of any category: +10% effect, +15% threat gen, cost -10% | The aggressive tank. Hits, blocks, and self-buffs in rotation. |
| **Warden Triad** | Shield + Sustain + Disrupt | Next Shield ability: +20% strength. Next Sustain: costs 0 Strand (free cast). | The protective support. Shields, heals, and controls in rotation. |
| **Predator Triad** | Strike + Disrupt + Augment | Next Strike: +15% damage, +10% crit chance, bypasses 10% armor. | The assassin. Debuffs, self-buffs, then executes. |
| **Lifeline Triad** | Sustain + Shield + Augment | Next Sustain: +25% healing, applies to 1 additional nearby ally. | The dedicated healer. Heals, protects, and enhances the group. |
| **Siege Triad** | Strike + Strike + Disrupt | Next Strike: +20% AoE radius, +10% damage. Disrupt duration +20%. | The AoE specialist. Pounds targets then exploits the opening. |
| **Flux Triad** | Any 3 different categories + Phlux > 10 | Next ability: random bonus from any Paired Resonance effect. | The wildcard. High-Phlux characters get chaotic but powerful procs. |

**Design note on Triads:** Not all possible 3-category combinations are listed as named Triads. Only combinations that represent coherent playstyles get named bonuses. The unnamed combinations still benefit from whatever Dual and Paired Resonances are active — the system never produces a dead state. Named Triads are *additional* bonuses on top of the Paired Resonances already in the buffer.

---

#### FULL SPECTRUM (4 different categories in buffer)

The rarest and most powerful state. Using four different categories in your last four actions triggers **Full Spectrum** — a brief window of universal enhancement.

```
Full Spectrum: All abilities gain +12% effect, -15% cost, and +5% crit chance for 6 seconds.
Cooldown: Cannot trigger again for 30 seconds after activation.
```

Full Spectrum is intentionally hard to maintain. Four different categories in four consecutive abilities means you cannot repeat *anything*. The moment you use a second Strike, you lose Spectrum. This makes it a burst window — you hit Spectrum, you have 6 seconds to capitalize, and then you return to your normal rotation.

Full Spectrum is **not the optimal state**. It's a spike. A player who constantly chases Spectrum will have inconsistent output because they're forcing category diversity at the expense of using the right ability at the right time. A player who plays their build's natural rhythm — cycling through their 2-3 core categories and hitting Spectrum occasionally when the fight allows it — will perform better overall.

This is critical: **the system rewards finding YOUR rhythm, not chasing the maximum Resonance tier.**

---

### What This Produces Per Class

**Sentinel (somatic primer, physical focus):**
Native skills are Melee Combat, Defense, Athletics, Martial Forms. These map primarily to Strike, Shield, and Augment categories.

A Sentinel's natural rotation cycles Strike → Shield → Strike → Augment, producing:
- Strike Tempo (Dual) frequently
- Overwatch (Shield + Augment Pair) regularly
- Vanguard Triad (Strike + Shield + Augment) as their signature state

The Sentinel who cross-trains into Warding (Expression shield) discovers that their Shield category deepens — more Shield options means more Shield Wall uptime and more Overwatch procs. A Sentinel who invests in Mending discovers Fortification (Shield + Sustain Pair) and eventually Warden Triad, becoming a self-sustaining tank who rarely needs external healing.

**Catalyst (cortical primer, Expression focus):**
Native skills are Strand Weaving, Helix Assault, Resonance. These map primarily to Strike and Disrupt categories.

A Catalyst's natural rotation cycles Strike → Strike → Disrupt → Strike, producing:
- Strike Tempo (Dual) constantly
- Pressure (Strike + Disrupt Pair) frequently
- Exploitation (Disrupt + Strike Pair) frequently
- Siege Triad (Strike + Strike + Disrupt) as their signature state

The Catalyst who invests in Psionics gets more Disrupt options, deepening their Pressure/Exploitation loops. A Catalyst who cross-trains into Warding discovers Iron Harmony (Shield + Disrupt Pair) and can build a battle-controller identity that disrupts enemies while shielding themselves.

**Conduit (sympathetic primer, support focus):**
Native skills are Warding, Mending, Genomics. These map primarily to Shield, Sustain, and Augment categories.

A Conduit's natural rotation cycles Sustain → Shield → Augment → Sustain, producing:
- Fortification (Shield + Sustain Pair) regularly
- Vital Surge (Sustain + Augment Pair) regularly
- Lifeline Triad (Sustain + Shield + Augment) as their signature state

This IS the Harmonic rotation — but it's emergent, not forced. The Conduit arrives at this loop because their skill investments naturally produce abilities in these three categories, and the Resonance system rewards cycling between them. But a Conduit who invests in Helix Assault (Opposed, expensive, but possible) discovers Counterflow (Strike + Sustain Pair) and can build an offensive healer identity that deals damage to heal.

The critical difference from the old Harmonic system: **there is no Dissonance penalty for camping one category.** A Conduit who needs to spam heals for 10 seconds because the Sentinel is getting destroyed can do so without punishment. They'll have Sustain Flow (Dual) active, which makes their sustained healing efficient. They miss out on Paired and Triad bonuses, but they're not actively penalized. The old system said "you're playing wrong." The new system says "you could be getting more value, but what you're doing works."

---

## PART 2: PROC CHAINS AND ABILITY INTERACTIONS

### The Interaction Web

Beyond the Resonance buffer, individual abilities have **specific interactions** with other abilities — conditional effects that trigger when used in proximity to specific other abilities. These are not universal category interactions; they are specific skill-to-skill relationships that reward players for understanding how their toolkit fits together.

These are discovered, not documented in tooltips. When a player first triggers an interaction, they receive a notification: *"Interaction Discovered: [Name]."* The interaction is then added to their combat journal with a description. This creates a layer of exploration within the combat system itself — players share discoveries, theory-craft optimal chains, and find interactions that nobody else has found because nobody else has their specific skill combination.

### Example Interaction Chains

**Chain: Thermogenic Cycle** (Helix Assault + Mending)
- Use Pyroptotic Burst (Strike) on an enemy → apply burn debuff
- Use Bloodrush (Sustain) on an ally within 6 seconds
- Interaction: The burn's thermal energy is "redirected" — the HoT on your ally ticks 20% faster for its duration
- Biological logic: Inflammatory energy channeled into accelerated metabolic healing

**Chain: Bone Circuit** (Defense + Melee Combat)
- Use Calcified Response (Shield) → gain temporary armor
- Land a melee attack within the armor buff duration
- Interaction: The hardened tissue adds impact damage — melee hit gains +15% damage as bonus physical
- Biological logic: Calcified subcutaneous layer transmits force more efficiently

**Chain: Strand Siphon** (Strand Weaving + Warding)
- Use Hoogsteen Lash (Strike) on an enemy
- Use Interferon Field (Shield) on yourself or an ally within 4 seconds
- Interaction: The shield absorbs 10% more damage and returns 5% of absorbed damage as Strand to the caster
- Biological logic: Expression energy cycles — projected force returns as absorbed potential

**Chain: Adrenal Cascade** (Athletics + Melee Combat)
- Use Adrenal Dump (Augment) for burst movement
- Land a melee attack within 3 seconds of the movement burst
- Interaction: First melee hit gains +25% damage and cannot be dodged
- Biological logic: Adrenal state carries momentum into the strike — the body is already committed

**Chain: Sympathetic Echo** (Mending + Negotiation)
- Use any Sustain ability on an NPC
- Attempt Negotiation with that NPC within 30 seconds
- Interaction: Negotiation check gains +20% success chance
- Biological logic: Healing builds biochemical trust response — oxytocin, reduced cortisol, parasympathetic activation

**Chain: Toxin Bloom** (Toxigenesis + Alchemy)
- Apply a Toxigenesis debuff (Disrupt) to an enemy
- Use an Alchemy-crafted weapon coating within 6 seconds
- Interaction: The coating's effect stacks with the Toxigenesis debuff multiplicatively instead of additively
- Biological logic: Endogenous and exogenous toxins compound through different metabolic pathways

**Chain: Cryptobiotic Recovery** (Cryptobiology + Mending)
- Activate Cryptobiotic Tun (suspended state on lethal damage)
- Receive a Sustain ability from any source during suspended state
- Interaction: Revival restores 40% HP instead of the standard 20%, and grants 6 seconds of +30% damage reduction
- Biological logic: Suspended metabolic state allows healing to reach deeper tissue layers before full systems restart

**Chain: Dead Channel** (Resonance + Psionics)
- Use Signal Severance (Disrupt) to suppress a target's Expressions
- Use Neural Silence (Disrupt) within 4 seconds
- Interaction: Neural Silence duration doubled against a Severance-affected target, and the target's Strand regeneration is halted for the duration
- Biological logic: Suppressed expression pathways leave neural systems exposed to secondary disruption

### Interaction Discovery Rate

At v0.1 launch, there should be approximately **40-50 interactions** across the full skill list. This is enough to ensure that most two-skill combinations have at least one discoverable interaction, but not so many that the system becomes incomprehensible. The design target:

- Every Native skill pair for each class has at least 2 interactions between them
- Every Aligned skill has at least 1 interaction with a Native skill
- Cross-class interactions (using skills from different primer sequence affinities) have at least 1 interaction per viable combination
- Advanced skills (Tier 3) have rare, powerful interactions that require specific setups — these are the "legendary combos" that the community will theory-craft

New interactions can be added with content patches, giving the design team a low-cost way to refresh combat meta without changing base skill numbers.

---

## PART 3: THE PHLUX WILD CARD

### Phlux-Driven Emergent Interactions

High-Phlux characters experience the Resonance system differently. Above specific Phlux thresholds, the system introduces controlled randomness:

**Phlux 8+: Resonance Echoes**
When a Paired Resonance triggers, there is a (Phlux × 1.5)% chance that the Paired Resonance effect also applies to your *next* ability — even if the buffer has changed. At Phlux 12, this is an 18% chance. The echo is a ghost of the previous synergy persisting one action longer than it should.

**Phlux 12+: Phantom Pairs**
When you use two abilities of the *same* category (Dual Resonance), there is a (Phlux × 1.0)% chance that a random Paired Resonance effect activates as if you had used two *different* categories. At Phlux 15, this is a 15% chance. Your repetitive pattern briefly produces diverse synergy — the genome deviating from the expected output.

**Phlux 15+: Expression Mutation**
When you achieve Full Spectrum, there is a (Phlux - 14) × 5% chance that one of your ability cooldowns is instantly reset. At Phlux 18, this is a 20% chance. The reset is random among abilities currently on cooldown. This can produce extraordinary burst windows or waste the proc on a low-value ability — Phlux doesn't care about your priorities.

**Phlux 18+: Cascade Event**
Once per combat encounter (hard lockout), there is a (Phlux - 17) × 3% chance on any ability activation that **every Resonance State currently active has its effect doubled for 4 seconds.** At Phlux 20, this is a 9% chance per ability. When it hits, the Cascade Event is the most powerful thing that can happen in the combat system. When it doesn't hit, you're a slightly squishy character with good crit stats.

This is the Phlux identity: **you trade consistency for moments of transcendence.** Low-Phlux characters have perfectly predictable combat loops. High-Phlux characters have combat loops that occasionally explode into something extraordinary — or occasionally waste a proc on the wrong ability at the wrong time. The Directorate prefers low-Phlux operatives for exactly this reason. The Unbound values high-Phlux Threaded because those moments of transcendence win fights that consistency cannot.

---

## PART 4: BUILD ARCHETYPES (Emergent, Not Prescribed)

The Resonance system does not tell players how to build. But specific skill combinations naturally produce specific Resonance patterns. Here are the archetypes that will emerge — not because the game forces them, but because the math rewards them:

### Sentinel Archetypes

**The Wall** (Defense + Martial Forms + Athletics)
- Primary categories: Shield, Strike, Augment
- Signature Resonance: Vanguard Triad
- Identity: Maximum survivability and threat. Rarely kills anything fast, never dies. The classic tank.
- Key interaction: Bone Circuit (Defense + Melee Combat)

**The Juggernaut** (Melee Combat + Martial Forms + Cryptobiology)
- Primary categories: Strike, Strike, Shield
- Signature Resonance: Strike Tempo + periodic Siege Triad with Disrupt from stuns
- Identity: Aggressive melee DPS with self-sustain through Cryptobiotic survival. Off-tank capable.
- Key interaction: Adrenal Cascade (Athletics + Melee Combat)

**The Ironclad** (Defense + Warding + Mending)
- Primary categories: Shield, Shield, Sustain
- Signature Resonance: Shield Wall + Fortification
- Identity: Self-healing tank. Cross-trains into Expression defense and healing. Almost impossible to kill solo, but low damage output. Requires heavy investment in Opposed/Misaligned skills.
- Key interaction: Cryptobiotic Recovery (Cryptobiology + Mending)

### Catalyst Archetypes

**The Arc** (Helix Assault + Strand Weaving + Resonance)
- Primary categories: Strike, Strike, Disrupt
- Signature Resonance: Siege Triad
- Identity: Maximum Expression damage. Glass cannon. Burns targets down before they can respond.
- Key interaction: Dead Channel (Resonance + Psionics)

**The Tempest** (Helix Assault + Psionics + Strand Weaving)
- Primary categories: Strike, Disrupt, Disrupt
- Signature Resonance: Pressure + Exploitation cycling
- Identity: Damage-through-debuffs. Applies disruption effects that amplify subsequent damage. Controller-killer hybrid.
- Key interaction: Dead Channel, Prion chain interactions

**The Battleweaver** (Strand Weaving + Warding + Helix Assault)
- Primary categories: Strike, Shield, Strike
- Signature Resonance: Strike Tempo + Iron Harmony
- Identity: Durable Catalyst who shields themselves between bursts. Survives longer than pure glass cannon at the cost of peak damage.
- Key interaction: Strand Siphon (Strand Weaving + Warding)

### Conduit Archetypes

**The Lifeline** (Mending + Warding + Genomics)
- Primary categories: Sustain, Shield, Augment
- Signature Resonance: Lifeline Triad
- Identity: Pure support. Maximum group sustain through cycling heal/shield/buff. The closest thing to the old Harmonic rotation — but arrived at through build choice, not class mandate.
- Key interaction: Fortification, Vital Surge

**The Plague Doctor** (Mending + Alchemy + Toxigenesis)
- Primary categories: Sustain, Augment, Disrupt
- Signature Resonance: Stabilization (Sustain + Disrupt) + Vital Surge
- Identity: Healer-poisoner hybrid. Heals allies while debuffing enemies. Uses crafted compounds alongside Expression healing.
- Key interaction: Toxin Bloom (Toxigenesis + Alchemy), Sympathetic Echo

**The Empath** (Mending + Negotiation + Warding)
- Primary categories: Sustain, Augment, Shield
- Signature Resonance: Lifeline Triad + Signal Lock when debuffing
- Identity: Social-combat hybrid. Strongest in content that mixes combat with NPC interaction. Excels in faction missions.
- Key interaction: Sympathetic Echo (Mending + Negotiation)

### Cross-Class Archetypes (Expensive but Viable)

**The Chimera** (Any class + Bioforming + Conjugation)
- Requires: Genomics 15, two Expression skills at 10, Resonance 10
- Identity: The ultimate generalist. Copies abilities, temporarily reshapes attributes, and adapts to any encounter. Requires massive XP investment across multiple Misaligned/Opposed skills. Endgame prestige build.
- Key interaction: Whatever you steal via Conjugation creates new interaction possibilities unique to your specific loadout. Two Chimeras will play completely differently based on what abilities they've copied.

**The Revenant** (Sentinel base + Helix Assault + Toxigenesis)
- Primary categories: Strike, Strike, Disrupt
- Identity: A Sentinel who abandoned full tank for offensive Expression damage. Rare, expensive (Helix Assault is Misaligned for Sentinel), but produces a melee-Expression hybrid that hits from multiple damage types simultaneously.
- Key interaction: Thermogenic Cycle enables self-healing through Expression damage

---

## PART 5: TUNING PHILOSOPHY

### Three Laws of Resonance Tuning

**Law 1: The floor is always functional.**
A player who ignores Resonance entirely — who uses abilities in whatever order the situation demands without thinking about the buffer — should still be effective. Resonance bonuses are 8-25% enhancements, not 80-250%. A player at zero Resonance awareness does 100% of their base effectiveness. A player at maximum Resonance awareness does ~115-125%. The gap is noticeable in optimized group content and negligible in solo questing.

**Law 2: Natural play produces natural Resonance.**
The system is designed so that playing *sensibly* — using the right ability for the right situation — produces Resonance states without deliberate optimization. A Sentinel who blocks an attack and then counter-attacks is doing Shield → Strike, which triggers Paired Resonance. They don't need to know the system exists. They just played well and got a bonus.

**Law 3: Chasing Resonance should never override tactical sense.**
If the optimal Resonance play is to use a Shield ability when nobody needs shielding, just to fill the buffer — the Resonance bonus should never be large enough to justify that waste. The system rewards good play that also happens to cycle categories, not bad play that forces category diversity.

### Tuning Knobs

The following values are the primary balance levers:

| Parameter | Current Value | Tuning Range | Notes |
|-----------|--------------|--------------|-------|
| Dual Resonance bonus | 8-15% | 5-20% | Floor for spamming one category |
| Paired Resonance bonus | 10-25% | 8-30% | Core synergy reward |
| Triad Resonance bonus | 15-25% | 12-35% | Build-defining reward |
| Full Spectrum bonus | 12% all + 15% cost + 5% crit | 8-18% | Burst window, intentionally brief |
| Full Spectrum duration | 6 seconds | 4-10s | Shorter = spikier, longer = more sustained |
| Full Spectrum cooldown | 30 seconds | 20-45s | How often the burst window is available |
| Buffer size | 4 abilities | 3-5 | Smaller = faster Resonance, larger = more complex patterns |
| Phlux Echo chance | Phlux × 1.5% | 1-2.5% per point | Controls high-Phlux randomness |
| Interaction chain window | 3-6 seconds | 2-8s | How quickly you must chain abilities for proc |

### What This System Gives the Admin Team

Resonance and Interactions are content levers. Without changing any base skill numbers or class balance:

- **New interactions** can be added per patch, refreshing the combat meta by making previously unconnected skills synergize
- **Seasonal Resonance modifiers** can be applied to zones (e.g., Basin Bloom increases all Sustain Resonance by 5% in Threshold Basin)
- **World events** can introduce temporary interactions (e.g., during the Primer Shortage event, Alchemy-based interactions have doubled windows)
- **Boss encounters** can require specific Resonance states (a boss that's only vulnerable during specific Triad windows creates group coordination challenges)
- **Discovery events** — patch notes hint at "new interactions added" without specifying what, driving community experimentation

This is a system that generates content through its own complexity. The admin team curates and expands it; they don't have to invent new mechanics from scratch.

---

## APPENDIX: REVISED CONDUIT IDENTITY

With the Harmonic system removed, the Conduit's class identity is no longer defined by a forced rotation mechanic. It's defined by **skill distribution**.

The Conduit's Native skills (Warding, Mending, Genomics) plus Aligned skills (Alchemy, Cooking, Athletics, Hunting, Negotiation, Tactics) give them the broadest natural access to Sustain, Shield, and Augment categories. They will naturally cycle between these three categories because their cheapest abilities span all three.

The Lifeline Triad (Sustain + Shield + Augment) is the Conduit's *signature Resonance* — not because the game forces it, but because their skill economy makes it the most efficient pattern. It emerges. It's discovered. And when a Conduit player first hits Lifeline Triad and sees the bonus activate, they understand what their class is for.

But a Conduit who invests in Helix Assault (Opposed, 2.0x cost) discovers Counterflow and Pressure Pairs. A Conduit who invests in Psionics (Misaligned, 1.5x) discovers Stabilization and Signal Lock. The class has a center of gravity, not a cage.

The visual feedback from the old Harmonic system is preserved — but now it reflects the Resonance buffer state, not a class-specific mechanic. Every class sees their current buffer composition as colored pips. Every class benefits from the same interaction rules. The Conduit just happens to land on the most beautiful loops because their skill economy was designed to produce them.
