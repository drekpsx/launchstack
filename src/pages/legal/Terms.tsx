import { LegalLayout } from "@/components/legal/LegalLayout";
import { APP_NAME, SUPPORT_EMAIL } from "@/config/app";

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service">
      <section>
        <h2 className="font-semibold text-lg">1. What {APP_NAME} is</h2>
        <p>
          {APP_NAME} is a personalization and organization tool for e-commerce entrepreneurs. Based on the business
          profile you provide, it selects and personalizes prompt templates and workflows for you to use with an
          AI chat tool of your choice (such as ChatGPT or Claude). {APP_NAME} itself does not generate AI
          responses and is not affiliated with OpenAI, Anthropic, Google or any other AI provider mentioned.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-lg">2. No results guarantee</h2>
        <p>
          [Placeholder] {APP_NAME} is a strategy and content-creation aid. We do not guarantee any specific revenue,
          profit, advertising performance, or business outcome from using the prompts or workflows provided.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-lg">3. Accounts & acceptable use</h2>
        <p>
          [Placeholder] You're responsible for keeping your account credentials secure and for the content you
          generate using prompts from this service in third-party AI tools.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-lg">4. Subscriptions & billing</h2>
        <p>
          [Placeholder] Paid plans are billed on a recurring basis until cancelled. See our Refund Policy for
          details on cancellations and refunds.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-lg">5. Contact</h2>
        <p>Questions about these terms: {SUPPORT_EMAIL}.</p>
      </section>
    </LegalLayout>
  );
}
