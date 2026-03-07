import { Scheme } from "./schemes";

export function generateRTIDraft(
  scheme: Scheme,
  issueDescription: string,
  userName: string = "[Your Name]",
  userAddress: string = "[Your Address]"
): string {
  const authority = scheme.ministry;
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `
APPLICATION UNDER RIGHT TO INFORMATION ACT, 2005
================================================================

To,
The Public Information Officer (PIO)
${authority}
Government of India
New Delhi

Date: ${today}

Subject: Request for Information under RTI Act, 2005 regarding ${scheme.name} (${scheme.fullName})

Sir/Madam,

I, ${userName}, resident of ${userAddress}, hereby submit this application under the Right to Information Act, 2005, and request the following information:

1. Details and current status of my application/beneficiary status under the ${scheme.name} scheme.

2. Regarding the following issue:
   ${issueDescription}

3. Please provide:
   a) The reason for the delay/rejection/issue mentioned above
   b) The name and designation of the officer responsible for processing my application
   c) The expected timeline for resolution
   d) Any documents or records related to my application

4. If this information is not available with your department, please transfer this application to the concerned department as per Section 6(3) of the RTI Act.

I am willing to pay the prescribed fee for obtaining this information.

Application Fee: Rs 10 (attached as Indian Postal Order / Court Fee Stamp / DD)

Yours faithfully,
${userName}
${userAddress}
Phone: [Your Phone Number]
Aadhaar No: [Your Aadhaar Number - optional]

================================================================
NOTES:
- Send to: PIO, ${authority}
- Fee: Rs 10 via postal order, court fee stamp, or DD
- Response deadline: 30 days from receipt
- Helpline: ${Object.entries(scheme.helpline).filter(([,v]) => typeof v === "string").map(([k,v]) => `${k}: ${v}`).join(" / ")}
- Official website: ${scheme.officialUrl}
- If not satisfied, file First Appeal within 30 days to First Appellate Authority
`.trim();
}
