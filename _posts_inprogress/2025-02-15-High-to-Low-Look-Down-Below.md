---
layout: post
title: "A Deep Dive into Altimeter Errors #1 - "
date: 2025-02-15
banner_image: cockpit.png
categories: [aviation]
tags: [aviation-theory]
---

## **Introduction**

> **"High to Low, Look Out Below" (Low to High, Clear the Sky)**

This mnemonic device is crucial for pilots when flying across regions with different atmospheric pressures. It highlights the risk associated with not adjusting the **Kollsman Window** when transitioning from a **high-pressure area to a low-pressure area**.

- If the altimeter setting is **not adjusted** when moving into lower pressure, the **indicated altitude (IA)** will read higher than the true altitude (TA), meaning the aircraft is flying lower than expected.
- This can create **terrain clearance hazards**, hence the warning: **Look Out Below**.

To fully understand the implications of **altimeter errors due to pressure changes**, let's break this concept down with a concrete example.


<!--more-->

<br/>

## **Analyzing the High-to-Low Scenario**

Consider a scenario where an aircraft is cruising at **3,500 feet MSL** in an area with a local sea-level pressure of **30.42 inHg**. The aircraft then transitions into a **low-pressure region** where the sea-level pressure is **29.92 inHg**.

### **Assumptions for This Example:**

- **Standard Pressure (29.92 inHg)** is used as a reference for understanding relative high/low pressure.
- The pilot **does not adjust** the Kollsman Window during the transition.

### **What Happens Next?**

### **Case 1: Flying at a Fixed True Altitude (3500 ft MSL)**
(*Theoretical, as pilots fly based on indicated altitude, not true altitude.*)

- Upon entering the **low-pressure area (29.92 inHg)**, the altimeter **detects the lower ambient pressure** and assumes the aircraft has **climbed** (since altitude and pressure are inversely related).
- The **indicated altitude (IA) will now display 4,000 feet**, even though the aircraft is still at **3,500 feet MSL**.
- Since the aircraft is actually flying higher than the indicated altitude, **there is no immediate terrain risk**.

**Conclusion:** This situation is not practically concerning because pilots do not reference true altitude during flight—**they rely on indicated altitude.**

### **Case 2: Flying Based on Indicated Altitude (3500 ft IA) – The Real Concern**
(*This is what actually happens in real-world flying.*)

- The pilot keeps the altimeter set to **30.42 inHg** and maintains **3,500 feet indicated altitude (IA)**.
- As the aircraft moves into the **low-pressure area (29.92 inHg)**, the **ambient pressure decreases**.
- Since the **altimeter is unaware of this pressure change**, it interprets the decrease as **a climb** and starts displaying a higher altitude.
- The pilot, seeing the **altimeter indicating an increase in altitude**, reacts by **descending to maintain 3,500 feet IA**.
- However, in reality, the aircraft is now **descending below the intended 3,500 feet MSL** and could be at **3,000 feet MSL or lower**.

**Conclusion:** The aircraft is now flying lower than expected, creating a **terrain clearance risk**. This is why pilots must adjust the **Kollsman Window** to reflect the local pressure.

---

## **Understanding the Kollsman Window Adjustment**

### **How Adjusting the Kollsman Window Affects Altitude Indication**
(*Assuming no actual altitude change—only pressure setting adjustments.*)

- **Lowering the Kollsman Window setting (e.g., from 30.42 to 29.92)** → **Decreases indicated altitude (IA)**
- **Raising the Kollsman Window setting (e.g., from 29.92 to 30.42)** → **Increases indicated altitude (IA)**

Since an **altimeter relies purely on atmospheric pressure**, it cannot differentiate between pressure changes caused by **actual altitude changes** vs. **weather or regional pressure differences**.

### **Why Adjust the Kollsman Window?**

- **The altimeter does not measure altitude directly**—it measures atmospheric pressure and **infers** altitude.
- Pressure changes occur due to **both altitude and weather conditions**, meaning that at the **same true altitude**, different pressure settings could result in different altitude readings.
- The pilot **must manually adjust** the Kollsman Window to tell the altimeter **what the correct sea-level pressure is**, ensuring that **indicated altitude matches true altitude (MSL).**

---

## **The Science Behind Kollsman Window Adjustments**

### **What Happens When You Increase the Kollsman Window Setting?**
(*For example, adjusting from 29.92 to 30.42 inHg.*)

- This tells the altimeter that **sea-level pressure is higher than standard**.
- Since **higher pressure at sea level means a given pressure exists lower in the atmosphere**, the altimeter **increases the indicated altitude** to compensate.

**Practical Meaning:**
- **If a pilot sets a higher-than-actual pressure**, the indicated altitude will be **higher than true altitude**—risking an **actual lower flight path than expected**.

### **What Happens When You Decrease the Kollsman Window Setting?**
(*For example, adjusting from 30.42 to 29.92 inHg.*)

- This tells the altimeter that **sea-level pressure is lower than standard**.
- Since **lower pressure at sea level means a given pressure exists higher in the atmosphere**, the altimeter **decreases the indicated altitude** to compensate.

**Practical Meaning:**
- **If a pilot sets a lower-than-actual pressure**, the indicated altitude will be **lower than true altitude**, making the aircraft appear lower than it actually is.

---

## **Key Takeaways for Pilots**

- **"High to Low, Look Out Below"** warns pilots that flying from a high-pressure area to a low-pressure area **without adjusting the altimeter** results in a **lower-than-expected true altitude**, creating terrain risks.
- Adjusting the **Kollsman Window** is **not about changing the altimeter’s internal pressure reference**—it’s about aligning **indicated altitude with true altitude (MSL).**
- **If pressure decreases but the altimeter is not updated**, the aircraft **descends below the intended altitude** when the pilot attempts to correct for what appears to be an increase in altitude.
- The **opposite is also true**: flying from **low to high pressure** without adjustment results in the aircraft flying **higher than indicated**—hence the saying:

  > **"Low to High, Clear the Sky."**

By correctly adjusting the **Kollsman Window** and understanding how pressure affects altitude readings, pilots can **avoid critical altitude errors and ensure safer flight operations.**

---

## **Conclusion**

Understanding how **pressure changes impact altitude readings** is essential for safe flying. The **High to Low, Look Out Below** rule is more than a mnemonic—it’s a **life-saving principle** that ensures pilots maintain proper terrain clearance and altitude awareness.

**Always adjust your Kollsman Window to the correct pressure setting, and stay aware of how pressure variations can impact your altitude readings!**  
