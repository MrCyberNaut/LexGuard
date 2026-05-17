// Pre-baked analysis of Uber Driver Agreement clauses
// Source: Uber Driver Terms of Service (public document)
// Purpose: Instant demo fallback if live API fails during pitch

const DEMO_RESULT = [
  {
    "id": 1,
    "text": "By entering into this Agreement, you grant Uber a worldwide, perpetual, irrevocable, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display any content you provide through the Platform, including but not limited to images, videos, ratings, and feedback.",
    "type": "IP_Transfer",
    "section": "Section 4 — Intellectual Property",
    "severity": "HIGH",
    "risk_summary": "You permanently give up rights to everything you submit — photos, reviews, feedback — forever.",
    "legal_reasoning": "This is a broad work-for-hire style grant that exceeds what's needed for platform operation. Under 17 U.S.C. §101, a 'perpetual, irrevocable, royalty-free' license is effectively a permanent transfer of economic value without compensation. Standard platform licenses include a termination right and limit scope to 'necessary for platform operation.'",
    "category_flags": ["ip_risk", "financial_risk"],
    "what_it_costs_you": "If you sign this, you lose all rights to any content you create — including photos, performance data, and reviews — with no ability to revoke or receive compensation, even after leaving the platform.",
    "push_back": "Ask them to change 'perpetual, irrevocable' to 'for the duration of your active driver account, terminable by either party with 30 days notice' and add 'solely for the purpose of operating and improving the Platform.'",
    "red_flag_label": "Unlimited IP Grab"
  },
  {
    "id": 2,
    "text": "Any dispute, claim or controversy arising out of or relating to this Agreement or the breach, termination, enforcement, interpretation or validity thereof, including the determination of the scope or applicability of this agreement to arbitrate, shall be determined by arbitration. You waive your right to a jury trial and to participate in a class action lawsuit.",
    "type": "Arbitration",
    "section": "Section 15 — Dispute Resolution",
    "severity": "HIGH",
    "risk_summary": "You're giving up your right to sue in court and join a class action — disputes go to private arbitration instead.",
    "legal_reasoning": "Mandatory arbitration clauses with class action waivers are standard in gig economy contracts but significantly limit your legal options. The EFAA (Ending Forced Arbitration Act, 2022) now bars mandatory arbitration for sexual harassment and assault claims. The FAA governs enforceability. Courts have found class action waivers enforceable under Epic Systems v. Lewis (2018), meaning you cannot join collective suits over wage theft or misclassification.",
    "category_flags": ["employment_risk", "financial_risk"],
    "what_it_costs_you": "If you sign this, you lose the right to sue Uber in court or join other drivers in a class action — even for wage theft or systematic underpayment. Private arbitration favors the repeat player (Uber) over individual claimants.",
    "push_back": "Ask them to remove the class action waiver entirely, or at minimum add a carve-out for statutory wage and labor claims. If they refuse, request that arbitration costs be borne entirely by Uber and that you retain the right to choose the arbitrator.",
    "red_flag_label": "Forced Arbitration"
  },
  {
    "id": 3,
    "text": "Uber may collect location data from your device continuously during an active trip and for 5 minutes after trip completion. Uber may also collect location data at intervals while the app is running in the background, even when you are not actively using the app, for purposes including fraud prevention, safety, and service improvement.",
    "type": "Data_Privacy",
    "section": "Section 9 — Data Collection",
    "severity": "HIGH",
    "risk_summary": "Uber tracks your location constantly — even when you're not driving — with vague justifications.",
    "legal_reasoning": "Continuous background location tracking without clear opt-out likely exceeds what GDPR Article 6 allows (requires lawful basis, limited to stated purpose). Under CCPA §1798.100, you have the right to know what data is collected and request deletion. 'Service improvement' is a broad, open-ended purpose that may not satisfy the GDPR's purpose limitation principle.",
    "category_flags": ["privacy_risk"],
    "what_it_costs_you": "If you sign this, Uber can track your location at all times the app is installed — including personal trips, your home location, and off-platform movements — with no clear limit on how long this data is retained or who it's shared with.",
    "push_back": "Ask them to limit background location collection to when you are actively logged into driver mode, require explicit opt-in for any tracking beyond trip completion, and commit to a data retention limit of 90 days.",
    "red_flag_label": "Always-On Tracking"
  },
  {
    "id": 4,
    "text": "Uber reserves the right to deactivate your account, with or without cause, at any time and without prior notice. Uber's decision to deactivate your account is final and not subject to appeal.",
    "type": "Termination",
    "section": "Section 12 — Account Deactivation",
    "severity": "HIGH",
    "risk_summary": "Uber can shut down your entire income source instantly, without explanation, with no appeal.",
    "legal_reasoning": "A termination clause with no cause, no notice, and no appeal process creates severe power asymmetry. While at-will employment is standard in the US, courts in some jurisdictions apply the implied covenant of good faith and fair dealing even to independent contractor agreements. California AB5 and similar laws increasingly challenge the contractor classification itself. The 'final and not subject to appeal' language removes any procedural protection.",
    "category_flags": ["employment_risk", "financial_risk"],
    "what_it_costs_you": "If you sign this, Uber can permanently eliminate your income overnight with no reason given and no path to reinstatement — leaving you with no legal recourse and no severance.",
    "push_back": "Ask them to add: (1) 14 days written notice for deactivation except in cases of verified safety violations, (2) a written statement of the reason for deactivation, and (3) a one-time appeal process with response within 7 business days.",
    "red_flag_label": "No Exit Clause"
  },
  {
    "id": 5,
    "text": "You shall not, during the term of this Agreement and for a period of twelve (12) months thereafter, provide rideshare, delivery, or transportation services through any competing platform within any metropolitan area where you have completed trips using the Uber platform.",
    "type": "Non_Compete",
    "section": "Section 7 — Restrictive Covenants",
    "severity": "HIGH",
    "risk_summary": "You can't drive for Lyft, DoorDash, or any competitor for a full year after leaving Uber.",
    "legal_reasoning": "This non-compete is unenforceable in California under Labor Code §925 and likely unenforceable in several other states with modern non-compete statutes. The FTC's 2024 non-compete guidance signals federal movement toward banning most non-competes. For independent contractors specifically, broad geographic non-competes are increasingly void as contrary to public policy. The 'any metropolitan area where you completed trips' geographic scope is potentially nationwide.",
    "category_flags": ["employment_risk", "freedom_risk"],
    "what_it_costs_you": "If you sign this, you lose the ability to work on any competing gig platform for an entire year after leaving Uber — effectively making you economically dependent on a single company with no fallback income.",
    "push_back": "Ask them to delete this clause entirely — non-competes for independent contractors are unenforceable in California (Labor Code §925) and several other states. If they insist, demand it be limited to 30 days, your immediate city only, and explicitly carve out part-time work on other platforms.",
    "red_flag_label": "1-Year No Compete"
  },
  {
    "id": 6,
    "text": "Uber may modify the fee structure, surge pricing algorithm, and service fees at any time with 30 days notice by email. Continued use of the platform after such notice constitutes acceptance of the modified terms.",
    "type": "Payment",
    "section": "Section 6 — Compensation",
    "severity": "MEDIUM",
    "risk_summary": "Uber can change how much you get paid with just 30 days notice — your only option is to quit.",
    "legal_reasoning": "Unilateral modification clauses are common in platform agreements and are generally enforceable under contract law. However, 30 days notice is below the industry standard of 60 days for material payment changes. Some courts have found 'use = acceptance' clauses unconscionable when the modification is material (i.e., substantially reduces compensation). The absence of a minimum rate floor is the core risk.",
    "category_flags": ["financial_risk", "employment_risk"],
    "risk_summary": "Uber can cut your pay by changing the algorithm with only 30 days notice — no minimum rate guarantee.",
    "category_flags": ["financial_risk"]
  },
  {
    "id": 7,
    "text": "You agree to maintain, at your own expense, commercial auto insurance with minimum coverage of $1,000,000 per occurrence for bodily injury and property damage while using the Platform. Uber's insurance policy applies only during active trip periods as defined by Uber.",
    "type": "Liability",
    "section": "Section 8 — Insurance Requirements",
    "severity": "MEDIUM",
    "risk_summary": "You bear significant insurance costs, and Uber's coverage only applies during narrow active-trip windows.",
    "legal_reasoning": "The gap between periods — app on/waiting vs. actively carrying a passenger — creates an insurance gray zone. Personal auto policies typically exclude commercial use, and commercial rideshare policies are expensive. The $1M minimum is standard, but the cost burden ($2,400-4,800/yr additional premium) falls entirely on you. Uber's insurance is secondary during 'Period 1' (app on, no match) in most states.",
    "category_flags": ["financial_risk"]
  },
  {
    "id": 8,
    "text": "This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, representations, warranties, and understandings.",
    "type": "Other",
    "section": "Section 18 — General Provisions",
    "severity": "LOW",
    "risk_summary": "Standard entire-agreement clause — this document overrides any verbal promises made to you.",
    "legal_reasoning": "Merger clauses are standard in commercial contracts and courts routinely enforce them. The practical implication is that any verbal representations made during onboarding (e.g., 'you'll earn at least $X/hour') are unenforceable unless written into this agreement.",
    "category_flags": []
  },
  {
    "id": 9,
    "text": "You acknowledge that you are an independent contractor and not an employee of Uber. You are not entitled to employee benefits including health insurance, workers' compensation, unemployment insurance, or paid leave.",
    "type": "Other",
    "section": "Section 2 — Independent Contractor Status",
    "severity": "MEDIUM",
    "risk_summary": "The contractor classification denies you employee protections — this designation is legally contested.",
    "legal_reasoning": "Independent contractor classification in gig work is actively challenged by state labor authorities. California's AB5 (ABC test), Massachusetts's similar standard, and the DOL's 2024 guidance all signal that platform workers may qualify as employees under applicable tests. By signing this, you accept contractor status — though this agreement cannot override statutory classification under applicable state or federal law.",
    "category_flags": ["employment_risk"]
  },
  {
    "id": 10,
    "text": "You agree not to make any public statements or post content that disparages, defames, or otherwise reflects negatively on Uber, its officers, directors, employees, or business partners.",
    "type": "NDA",
    "section": "Section 11 — Non-Disparagement",
    "severity": "MEDIUM",
    "risk_summary": "You can't publicly criticize Uber — this may conflict with your legal right to discuss working conditions.",
    "legal_reasoning": "Broad non-disparagement clauses have been challenged under NLRA §7, which protects workers' rights to engage in concerted activity including public complaints about working conditions. The National Labor Relations Board has found broad non-disparagement clauses in employment agreements to be unlawful. As an independent contractor, NLRA protections may be limited, but public policy arguments remain.",
    "category_flags": ["freedom_risk", "employment_risk"]
  }
];
