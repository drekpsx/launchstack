import { LegalLayout } from "@/components/legal/LegalLayout";
import { SUPPORT_EMAIL } from "@/config/app";

export default function Refund() {
  return (
    <LegalLayout title="Refund Policy">
      <section>
        <h2 className="font-semibold text-lg">1. Free plan</h2>
        <p>The Free plan never requires payment, so there's nothing to refund.</p>
      </section>
      <section>
        <h2 className="font-semibold text-lg">2. Pro subscription</h2>
        <p>
          [Placeholder] You can cancel your Pro subscription at any time from Settings; you'll keep access until the
          end of your current billing period and won't be charged again.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-lg">3. Refund requests</h2>
        <p>
          [Placeholder] If something went wrong with a charge, contact us at {SUPPORT_EMAIL} within 14 days of the
          charge and we'll review it.
        </p>
      </section>
    </LegalLayout>
  );
}
