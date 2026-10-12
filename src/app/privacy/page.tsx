import type { Metadata } from "next";

import LegalPage from "@/components/LegalPage";
import { content } from "@/content/content";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Clinician Marketing handles information submitted through this website, including why we do not collect patient or clinical information.",
  alternates: { canonical: "/privacy" },
};

/**
 * DRAFT. Placeholder text for review — see DECISIONS.md.
 */
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy" updated="12 October 2026">
      <p className="rounded-xl border border-[var(--glow)]/30 bg-[var(--glow)]/[0.07] p-5">
        <strong>Draft for review.</strong> This notice is placeholder wording
        prepared to be reviewed and replaced by {content.brand.name} and its
        legal counsel.
      </p>

      <h2>1. Who this covers</h2>
      <p>
        This notice describes how {content.brand.name} handles information
        collected through this website. It covers prospective and current
        business clients. It does not cover information held by our clients
        about their own patients.
      </p>

      <h2>2. No patient or clinical information</h2>
      <p>
        We do not ask for, and ask that you do not send us, any patient or
        clinical information through this website. The contact form collects
        business contact details only: your name, your practice or
        organization, your role, the size of your practice, your email
        address, your phone number and whatever you choose to write in the
        message field. It is not a route for protected health information, and
        it is not a route for anyone seeking care.
      </p>
      <p>
        <strong>If you are looking for treatment</strong>, please contact a
        licensed provider directly. If you are in crisis, call or text 988 in
        the United States to reach the Suicide and Crisis Lifeline, or call
        911.
      </p>

      <h2>3. What we collect</h2>
      <ul>
        <li>
          <strong>What you submit.</strong> The contact form fields listed
          above.
        </li>
        <li>
          <strong>Technical information.</strong> Standard server logs,
          including IP address and browser user agent, used to operate the
          site and limit form abuse.
        </li>
        <li>
          <strong>Analytics.</strong> If analytics is enabled, aggregate
          information about pages visited and how visitors arrive. Analytics
          and advertising tags are not placed on client patient portals or
          clinical pages.
        </li>
      </ul>

      <h2>4. How we use it</h2>
      <p>
        To reply to your enquiry, to prepare for a call, to provide services
        you engage us for, and to operate and improve this website. We do not
        sell personal information.
      </p>

      <h2>5. Who we share it with</h2>
      <p>
        Service providers that help us run the business, such as hosting,
        email delivery and customer relationship management vendors, under
        contract and only for those purposes. Where a vendor could handle
        information that may be protected health information in the course of
        a client engagement, we put a business associate agreement in place
        first. <strong>[Confirm the current vendor list.]</strong>
      </p>

      <h2>6. How long we keep it</h2>
      <p>
        Enquiries are retained for as long as needed to respond and to
        maintain business records.{" "}
        <strong>[Confirm the retention period.]</strong>
      </p>

      <h2>7. Your choices</h2>
      <p>
        You can ask us to access, correct or delete the business contact
        information we hold about you by emailing{" "}
        <a href={`mailto:${content.brand.email}`}>{content.brand.email}</a>.
        Depending on where you live, you may have additional rights.{" "}
        <strong>[Confirm which state privacy laws apply and add the
        required disclosures.]</strong>
      </p>

      <h2>8. Security</h2>
      <p>
        We use reasonable administrative and technical measures to protect the
        information we hold. No method of transmission over the internet is
        completely secure, which is another reason not to send clinical
        information through this form.
      </p>

      <h2>9. Changes</h2>
      <p>
        We will update this notice when our practices change, and will revise
        the date at the top of the page.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about privacy:{" "}
        <a href={`mailto:${content.brand.email}`}>{content.brand.email}</a>.
      </p>
    </LegalPage>
  );
}
