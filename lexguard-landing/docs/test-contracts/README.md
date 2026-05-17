# Test Contracts for LexGuard

Three contracts designed to exercise every clause type and severity level in the analysis pipeline.

## Files

### `employment-aggressive.txt`
A full employment agreement with deliberately aggressive clauses. Expected HIGH flags:
- Unlimited IP assignment (including personal-time work)
- 36-month global non-compete
- Mandatory arbitration + class action waiver
- Unilateral contract modification by employer

Use this to demo the **employee** persona in onboarding. The IP and non-compete clauses are the strongest demo moments.

### `freelancer-contractor.txt`
Independent contractor agreement. Expected HIGH flags:
- Work-for-hire with portfolio blackout (no right to show work)
- 90-day payment terms with unilateral acceptance gatekeeping
- 18-month non-compete for a freelancer (unusual and aggressive)
- Full indemnification with zero reciprocal liability cap

Use this to demo the **freelancer** persona. The portfolio blackout clause lands well with creative audiences.

### `saas-platform-tos.txt`
Consumer platform Terms of Service modeled on real ride-share / gig platform terms. Expected HIGH flags:
- Binding arbitration + class action waiver
- Perpetual location + data license to third parties and governments
- Auto-renewal with unilateral price increase rights
- Unlimited indemnification obligation on the user
- IP license on user-submitted content (perpetual, royalty-free)

Use this to demo the **other** persona or for a general audience unfamiliar with legal contracts.

## How to Use

1. Open [https://lexguard-landing-alpha.vercel.app/app](https://lexguard-landing-alpha.vercel.app/app)
2. Complete onboarding with the appropriate role
3. Paste the contents of any `.txt` file into the text area
4. Click **Analyze contract**

All three contracts should produce a risk score of 70+ (Critical) and at least 4 HIGH-severity clauses.
