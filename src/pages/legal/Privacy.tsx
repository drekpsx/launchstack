import { LegalLayout } from "@/components/legal/LegalLayout";
import { APP_NAME, SUPPORT_EMAIL } from "@/config/app";

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy">
      <section>
        <h2 className="font-semibold text-lg">1. What we collect</h2>
        <p>
          When you create an account with {APP_NAME}, we collect your email address, first name, and the answers
          you give us in the business questionnaire (your business profile). We also store your favorites, prompt
          history and workflow progress so your workspace stays consistent across sessions.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-lg">2. What we don't do</h2>
        <p>
          We never send your business profile or prompt content to any third-party AI provider. {APP_NAME} does not
          call an AI API — prompts are generated locally from templates and your own answers, and it's you who
          chooses to paste them into your own AI tool of choice.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-lg">3. How we use your data</h2>
        <p>
          [Placeholder] We use your data to operate your account, personalize your workspace, process billing
          through our payment provider, and improve the product. We do not sell your personal data.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-lg">4. Data retention & deletion</h2>
        <p>
          [Placeholder] You can request deletion of your account and associated data at any time from Settings or
          by contacting us at {SUPPORT_EMAIL}.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-lg">5. Contact</h2>
        <p>Questions about this policy: {SUPPORT_EMAIL}.</p>
      </section>
    </LegalLayout>
  );
}
