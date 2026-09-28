-- ============================================================================
-- AI E-commerce OS — seed content
-- 12 modules, 44 prompt templates, 5 guided workflows.
-- All prompts are static text with {{variable}} placeholders — no AI API
-- is called anywhere in this file or by the product itself.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Modules
-- ----------------------------------------------------------------------------
insert into public.modules (id, slug, name, description, icon, sort_order) values
('00000000-0000-0000-0000-000000000001', 'product-research', 'Product Research', 'Find and analyze winning product ideas for your store.', 'search', 1),
('00000000-0000-0000-0000-000000000002', 'product-validation', 'Product Validation', 'Stress-test a product idea before you invest time or money.', 'circle-check', 2),
('00000000-0000-0000-0000-000000000003', 'product-page', 'Product Page', 'Write a high-converting product page from title to CTA.', 'file-text', 3),
('00000000-0000-0000-0000-000000000004', 'offer', 'Offer', 'Build an offer people can''t say no to.', 'gift', 4),
('00000000-0000-0000-0000-000000000005', 'meta-ads', 'Meta Ads', 'Angles, hooks, primary text and creative testing for Facebook & Instagram ads.', 'megaphone', 5),
('00000000-0000-0000-0000-000000000006', 'tiktok', 'TikTok', 'Video ideas, hooks, scripts and UGC briefs built for TikTok.', 'video', 6),
('00000000-0000-0000-0000-000000000007', 'content', 'Content', 'Plan and write organic content across every channel.', 'calendar-days', 7),
('00000000-0000-0000-0000-000000000008', 'seo', 'SEO', 'Keywords, articles and product-page SEO that compounds over time.', 'globe', 8),
('00000000-0000-0000-0000-000000000009', 'email', 'Email', 'Welcome, abandoned cart and lifecycle sequences that sell while you sleep.', 'mail', 9),
('00000000-0000-0000-0000-000000000010', 'store-optimization', 'Store Optimization', 'Audit and improve your store''s UX, trust and conversion rate.', 'gauge', 10),
('00000000-0000-0000-0000-000000000011', 'competitor-analysis', 'Competitor Analysis', 'Understand competitors and find the gap you can win in.', 'users-round', 11),
('00000000-0000-0000-0000-000000000012', 'customer-research', 'Customer Research', 'Get inside your customer''s head: pains, desires and language.', 'user-search', 12);

-- ----------------------------------------------------------------------------
-- Prompt templates
-- ----------------------------------------------------------------------------

-- Module 1: Product Research (all free)
insert into public.prompt_templates
  (id, module_id, title, description, objective, difficulty, content, required_variables, tags, business_types, channels, goals, problems, premium, sort_order)
values
('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000001',
 'Find Winning Product Ideas',
 'Generate a list of promising product ideas inside your niche.',
 'Get 15 product ideas worth testing, each with a reason it could work.',
 'beginner',
$c$Act as an experienced e-commerce product researcher who has helped launch hundreds of winning products.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Generate 15 product ideas inside the "{{niche}}" niche that would appeal to {{target_customer}}.

Requirements:
- Mix "hero" products and complementary/add-on products.
- Prioritize products that solve a real, specific problem rather than novelty items.
- Favor products with clear visual or demonstrable appeal (important for video content).
- Avoid saturated, generic ideas without a twist.

For each idea, provide:
1. Product name
2. The specific problem it solves
3. Why it fits {{target_customer}}
4. A rough price range
5. A 1-10 "wow factor" score with a one-line reason$c$,
 array['niche','target_customer','business_summary'],
 array['beginner','research','product'],
 array[]::text[], array[]::text[], array['find_product']::text[], array[]::text[],
 false, 1),

('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001',
 'Analyze a Product Idea',
 'Get a full breakdown of one specific product before you commit to it.',
 'Decide, with real reasoning, whether this product is worth pursuing.',
 'beginner',
$c$Act as a senior e-commerce product analyst.

BUSINESS CONTEXT
{{business_summary}}

PRODUCT TO ANALYZE
{{product}}

OBJECTIVE
Give me a full analysis of this product before I commit resources to it.

Cover, with clear headings:
1. Target audience fit — does it match {{target_customer}}?
2. Problem-solution fit — how well does it solve "{{customer_problem}}"?
3. Perceived value vs. likely cost ({{product_cost}}) — is there room for a healthy margin at {{average_price}}?
4. Marketability — is it easy to show in a video or photo?
5. Repeat-purchase or upsell potential
6. Red flags and risks I should know about
7. A final verdict: Go / Test cautiously / Pass, with one sentence why$c$,
 array['product','target_customer','customer_problem','product_cost','average_price','business_summary'],
 array['beginner','research','product','analysis'],
 array[]::text[], array[]::text[], array['find_product']::text[], array[]::text[],
 false, 2),

('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001',
 'Market & Demand Research',
 'Understand how big and how real the demand is before you launch.',
 'Get a realistic read on market size, trends and buying intent.',
 'intermediate',
$c$Act as a market research analyst specialized in e-commerce and consumer trends.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Help me understand the real demand for "{{product}}" in the "{{niche}}" niche, targeting {{target_country}}.

Give me:
1. Signals that suggest genuine, sustained demand (vs. a short-lived trend)
2. The likely search and social intent behind this product (what are people actually trying to solve?)
3. Adjacent or substitute products competing for the same buyer
4. Seasonality or timing considerations for {{target_country}}
5. A demand verdict: Growing / Stable / Declining / Trend-only, with reasoning
6. Three follow-up questions I should research myself to confirm this$c$,
 array['product','niche','target_country','business_summary'],
 array['intermediate','research','market'],
 array[]::text[], array[]::text[], array['find_product']::text[], array[]::text[],
 false, 3),

('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000001',
 'Find Marketing Angles',
 'Uncover the different emotional and rational angles you can sell this product with.',
 'Get a list of distinct marketing angles to test across your ads and content.',
 'intermediate',
$c$Act as a direct-response marketing strategist.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Generate 8 distinct marketing angles for "{{product}}", each one a different way to make {{target_customer}} care.

For each angle, provide:
1. Angle name (short label)
2. The core emotion or logic it plays on (e.g. fear of missing out, convenience, status, pain relief)
3. A one-sentence pitch using this angle
4. Which channel it would work best on (ads, TikTok, email, organic) and why

Make sure the angles are genuinely different from each other — not just reworded versions of the same idea. Anchor at least one angle in "{{customer_problem}}" and one in "{{unique_selling_point}}".$c$,
 array['product','target_customer','customer_problem','unique_selling_point','business_summary'],
 array['intermediate','research','marketing','angles'],
 array[]::text[], array[]::text[], array['find_product','launch_store']::text[], array[]::text[],
 false, 4);

-- Module 2: Product Validation
insert into public.prompt_templates
  (id, module_id, title, description, objective, difficulty, content, required_variables, tags, business_types, channels, goals, problems, premium, sort_order)
values
('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000002',
 'Product Validation Checklist',
 'Run your product through a structured go/no-go checklist.',
 'Get a clear-eyed validation score before you invest in inventory or ads.',
 'beginner',
$c$Act as a pragmatic e-commerce advisor who has seen many products succeed and fail.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Validate whether "{{product}}" is worth pursuing right now.

Score it out of 10 on each of these criteria, with one line of reasoning each:
1. Problem urgency — how badly does {{target_customer}} need this solved?
2. Margin health — cost {{product_cost}} vs. price {{average_price}}
3. Differentiation — strength of "{{unique_selling_point}}" vs. alternatives
4. Marketability — how easy is it to make compelling content/ads for it?
5. Objection risk — how serious is "{{main_objection}}" as a blocker?
6. Repeatability — likelihood of repeat purchase or referrals

Finish with a total score /60 and a one-paragraph verdict: launch as-is, tweak first, or pass.$c$,
 array['product','target_customer','product_cost','average_price','unique_selling_point','main_objection','business_summary'],
 array['beginner','validation'],
 array[]::text[], array[]::text[], array['find_product','launch_store']::text[], array[]::text[],
 false, 1),

('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0000-000000000002',
 'Risks & Objections Analysis',
 'List every reason a customer might NOT buy, so you can pre-empt it.',
 'A ranked list of objections and how to neutralize each one.',
 'intermediate',
$c$Act as a conversion rate optimization expert.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
List every realistic objection {{target_customer}} could have before buying "{{product}}" at {{average_price}}.

For each objection:
1. State it in the customer's own words
2. Rate how damaging it is (Low / Medium / High)
3. Give a concrete way to neutralize it (copy, guarantee, proof, pricing change, etc.)

Pay special attention to "{{main_objection}}" — give it three different counters, not just one. End with the single objection I should address first and why.$c$,
 array['target_customer','product','average_price','main_objection','business_summary'],
 array['intermediate','validation','objections'],
 array[]::text[], array[]::text[], array[]::text[], array['offer','positioning']::text[],
 true, 2),

('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0000-000000000002',
 'Differentiation Statement',
 'Nail down, in one paragraph, why you and not a competitor.',
 'A crisp differentiation statement you can reuse across your marketing.',
 'intermediate',
$c$Act as a brand positioning strategist.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Write a clear differentiation statement for "{{product}}", built around "{{unique_selling_point}}".

Deliver:
1. A one-sentence positioning statement ("For [customer] who [need], {{product}} is the [category] that [key benefit], unlike [alternative] which [limitation].")
2. Three supporting proof points I could use to back up the claim
3. Three ways competitors likely try to compete, and why my angle still wins
4. A short (2-3 sentence) version I could use directly in ad copy or on my homepage$c$,
 array['product','unique_selling_point','business_summary'],
 array['intermediate','validation','positioning'],
 array[]::text[], array[]::text[], array['grow_brand']::text[], array['positioning']::text[],
 true, 3);

-- Module 3: Product Page
insert into public.prompt_templates
  (id, module_id, title, description, objective, difficulty, content, required_variables, tags, business_types, channels, goals, problems, premium, sort_order)
values
('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0000-000000000003',
 'Product Title & Subtitle',
 'Write a title and subtitle that hook and clarify in one glance.',
 'A set of title/subtitle options ready to A/B test.',
 'beginner',
$c$Act as an e-commerce copywriter specialized in high-converting product pages.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Write 5 title + subtitle combinations for the product page of "{{product}}".

Rules:
- The title should be clear about what the product is, not just clever.
- The subtitle should communicate the core benefit tied to "{{customer_problem}}".
- Keep titles under 60 characters and subtitles under 120 characters.
- At least one version should lead with "{{unique_selling_point}}".

Present each option numbered, with the title and subtitle on separate lines.$c$,
 array['product','customer_problem','unique_selling_point','business_summary'],
 array['beginner','copywriting','product-page'],
 array[]::text[], array[]::text[], array[]::text[], array[]::text[],
 false, 1),

('00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0000-000000000003',
 'Benefit-Driven Description',
 'Turn features into benefits customers actually care about.',
 'A full product description structured around benefits, not specs.',
 'intermediate',
$c$Act as a direct-response e-commerce copywriter.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Write a benefit-driven product description for "{{product}}" targeting {{target_customer}}.

Structure:
1. A 2-sentence hook that names the problem ("{{customer_problem}}") and promises the transformation
2. 4-6 bullet points, each formatted as "Feature → Benefit → Why it matters to you"
3. A short paragraph addressing "{{main_objection}}" without sounding defensive
4. A closing line that reinforces "{{unique_selling_point}}" and nudges toward the CTA

Tone: confident, specific, no generic marketing fluff ("premium quality", "amazing", etc.).$c$,
 array['product','target_customer','customer_problem','main_objection','unique_selling_point','business_summary'],
 array['intermediate','copywriting','product-page'],
 array[]::text[], array[]::text[], array[]::text[], array[]::text[],
 true, 2),

('00000000-0000-0000-0002-000000000010', '00000000-0000-0000-0000-000000000003',
 'Product Page FAQ',
 'Answer the questions that stop people from clicking "Buy".',
 'A ready-to-publish FAQ section for your product page.',
 'beginner',
$c$Act as an e-commerce customer experience expert.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Write an FAQ section (8 questions) for the product page of "{{product}}", priced at {{average_price}}.

Include at minimum:
- One question directly addressing "{{main_objection}}"
- One about shipping/delivery expectations for {{target_country}}
- One about how the product solves "{{customer_problem}}"
- One about returns/guarantee
- One comparing it to doing nothing / the status quo

Keep answers short (2-3 sentences), reassuring, and specific — no vague corporate language.$c$,
 array['product','average_price','main_objection','target_country','customer_problem','business_summary'],
 array['beginner','copywriting','product-page','faq'],
 array[]::text[], array[]::text[], array[]::text[], array[]::text[],
 true, 3),

('00000000-0000-0000-0002-000000000011', '00000000-0000-0000-0000-000000000003',
 'Objection-Handling Section',
 'A dedicated section that pre-empts the #1 reason people bounce.',
 'Copy for a "why you can trust this" or objection-handling block.',
 'intermediate',
$c$Act as a conversion copywriter.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Write a short objection-handling section for the product page of "{{product}}" that directly addresses "{{main_objection}}".

Deliver:
1. A section headline that names the concern without being defensive
2. 2-3 short paragraphs or bullets that reframe or resolve the concern with specifics (guarantee, proof, process, materials, etc. — infer reasonable specifics from the business context)
3. One trust-building closing line

Keep the tone empathetic, not salesy — like a knowledgeable friend answering honestly.$c$,
 array['product','main_objection','business_summary'],
 array['intermediate','copywriting','product-page','objections'],
 array[]::text[], array[]::text[], array[]::text[], array['offer']::text[],
 true, 4),

('00000000-0000-0000-0002-000000000012', '00000000-0000-0000-0000-000000000003',
 'CTA & Urgency Copy',
 'Write calls-to-action and urgency elements that convert without feeling scammy.',
 'A set of CTA button copy and urgency/scarcity microcopy options.',
 'beginner',
$c$Act as an e-commerce CRO copywriter.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Write CTA and urgency copy for the product page of "{{product}}" (goal: {{primary_goal}}).

Give me:
1. 5 CTA button copy options (2-4 words each, action-oriented, not just "Buy Now")
2. 3 urgency/scarcity microcopy lines I could honestly use (e.g. tied to real stock, seasonal demand, or limited-time launch pricing — flag if something requires real data to back it up)
3. One short line to place under the CTA to reduce last-second hesitation (e.g. referencing the guarantee or "{{main_objection}}")

Avoid fake countdown-timer language or anything misleading.$c$,
 array['product','primary_goal','main_objection','business_summary'],
 array['beginner','copywriting','product-page','cta'],
 array[]::text[], array[]::text[], array[]::text[], array[]::text[],
 true, 5);

-- Module 4: Offer
insert into public.prompt_templates
  (id, module_id, title, description, objective, difficulty, content, required_variables, tags, business_types, channels, goals, problems, premium, sort_order)
values
('00000000-0000-0000-0002-000000000013', '00000000-0000-0000-0000-000000000004',
 'Value Proposition Generator',
 'Turn your product into a clear, compelling value proposition.',
 'A value proposition statement plus 3 supporting variations.',
 'beginner',
$c$Act as an offer strategist for e-commerce brands.

BUSINESS CONTEXT
{{offer_summary}}

OBJECTIVE
Write a strong value proposition for "{{product}}" aimed at {{target_customer}}.

Deliver:
1. A primary value proposition (1-2 sentences) connecting "{{customer_problem}}" to the outcome {{target_customer}} really wants
2. 3 alternate phrasings I can test (different tone: emotional, practical, aspirational)
3. A one-line summary of why "{{unique_selling_point}}" makes this believable, not just a claim$c$,
 array['product','target_customer','customer_problem','unique_selling_point','offer_summary'],
 array['beginner','offer','value-proposition'],
 array[]::text[], array[]::text[], array[]::text[], array[]::text[],
 false, 1),

('00000000-0000-0000-0002-000000000014', '00000000-0000-0000-0000-000000000004',
 'Offer & Bundle Builder',
 'Design bundle, pricing and upsell structure for a stronger offer.',
 'A structured offer with base product, bundle and upsell options.',
 'intermediate',
$c$Act as a pricing and offer-structure consultant for e-commerce.

BUSINESS CONTEXT
{{offer_summary}}

OBJECTIVE
Design an offer structure for "{{product}}" (cost {{product_cost}}, current price {{average_price}}).

Provide:
1. Base offer — what's included at {{average_price}}
2. One bundle idea (2-3 complementary items) with suggested bundle price and the logic behind the discount
3. One upsell to present after purchase, with a reason it's a natural next step
4. One cross-sell to present on the product page itself
5. A short note on how this structure protects margin given the {{product_cost}} cost base$c$,
 array['product','product_cost','average_price','offer_summary'],
 array['intermediate','offer','pricing','bundle'],
 array[]::text[], array[]::text[], array['increase_revenue','improve_profitability']::text[], array['offer']::text[],
 true, 2),

('00000000-0000-0000-0002-000000000015', '00000000-0000-0000-0000-000000000004',
 'Irresistible Bonuses',
 'Add perceived value without eating into your margin.',
 'A list of bonus ideas ranked by perceived value vs. real cost.',
 'intermediate',
$c$Act as an e-commerce offer strategist.

BUSINESS CONTEXT
{{offer_summary}}

OBJECTIVE
Suggest 6 bonus ideas to add to the "{{product}}" offer that increase perceived value without significantly increasing cost.

For each bonus:
1. What it is
2. Why it matters to {{target_customer}}
3. Estimated cost to deliver (Low / Medium / High)
4. Perceived value to the customer (Low / Medium / High)

Sort the list by best value-to-cost ratio first, and mark your top pick.$c$,
 array['product','target_customer','offer_summary'],
 array['intermediate','offer','bonuses'],
 array[]::text[], array[]::text[], array[]::text[], array['offer']::text[],
 true, 3),

('00000000-0000-0000-0002-000000000016', '00000000-0000-0000-0000-000000000004',
 'Risk-Reversal Guarantee',
 'Craft a guarantee that removes the last reason not to buy.',
 'Guarantee copy that reduces risk perception around your main objection.',
 'intermediate',
$c$Act as a conversion and trust specialist for e-commerce.

BUSINESS CONTEXT
{{offer_summary}}

OBJECTIVE
Write a risk-reversal guarantee for "{{product}}" that directly counters "{{main_objection}}".

Provide:
1. Three guarantee options of different strength (e.g. satisfaction guarantee, money-back window, replacement guarantee) with the trade-offs of each
2. Final recommended guarantee wording (2-3 sentences, plain language)
3. A short "why this works" note tying it back to "{{main_objection}}"

Flag clearly that the actual terms (return window, conditions) must be confirmed against real store policy before publishing.$c$,
 array['product','main_objection','offer_summary'],
 array['intermediate','offer','guarantee','trust'],
 array[]::text[], array[]::text[], array[]::text[], array['offer']::text[],
 true, 4),

('00000000-0000-0000-0002-000000000017', '00000000-0000-0000-0000-000000000004',
 'Final Offer Messaging',
 'Package everything into one clear, punchy offer statement.',
 'A final, ready-to-use offer summary for ads and the product page.',
 'advanced',
$c$Act as a senior direct-response marketer.

BUSINESS CONTEXT
{{offer_summary}}

OBJECTIVE
Combine everything into one final offer statement for "{{product}}" that I can use across ads, email and the product page.

Deliver:
1. A "stack" summary: base product + bundle/bonus + guarantee, written as a scannable list
2. A one-paragraph version for the product page (persuasive but not hypey)
3. A one-sentence version short enough for an ad headline
4. A recommended price anchor (what to compare {{average_price}} against) and why it makes the offer feel like a clear win$c$,
 array['product','average_price','offer_summary'],
 array['advanced','offer','messaging'],
 array[]::text[], array[]::text[], array[]::text[], array['offer']::text[],
 true, 5);

-- Module 5: Meta Ads (channel: meta_ads)
insert into public.prompt_templates
  (id, module_id, title, description, objective, difficulty, content, required_variables, tags, business_types, channels, goals, problems, premium, sort_order)
values
('00000000-0000-0000-0002-000000000018', '00000000-0000-0000-0000-000000000005',
 'Meta Ads Angle Brainstorm',
 'Generate distinct ad angles to test on Facebook & Instagram.',
 'A list of testable ad angles for your Meta Ads campaigns.',
 'beginner',
$c$Act as a Meta Ads media buyer and direct-response copywriter.

BUSINESS CONTEXT
{{marketing_context}}

OBJECTIVE
Generate 8 distinct ad angles for "{{product}}" to test on Facebook & Instagram, targeting {{target_customer}}.

For each angle:
1. Angle name
2. The hook idea behind it (what stops the scroll)
3. Which ad format fits best (single image, carousel, video/UGC)
4. Which part of the funnel it's best for (cold / warm / retargeting)

Ground at least two angles in "{{customer_problem}}" and one in "{{main_objection}}" reframed positively.$c$,
 array['product','target_customer','customer_problem','main_objection','marketing_context'],
 array['beginner','ads','meta','angles'],
 array[]::text[], array['meta_ads']::text[], array[]::text[], array['acquisition','ads']::text[],
 false, 1),

('00000000-0000-0000-0002-000000000019', '00000000-0000-0000-0000-000000000005',
 'Meta Ads Primary Text & Headlines',
 'Write ready-to-launch primary text and headline variations.',
 '5 complete ad copy sets (primary text + headline + description).',
 'intermediate',
$c$Act as a Meta Ads copywriter who writes high-CTR direct-response ads.

BUSINESS CONTEXT
{{marketing_context}}

OBJECTIVE
Write 5 complete ad copy sets for "{{product}}", priced at {{average_price}}.

Each set must include:
1. Primary text (2-4 short lines, scroll-stopping opener, benefit-led, soft CTA)
2. Headline (under 40 characters)
3. Description line (under 30 characters)

Vary the angle across the 5 sets (problem-focused, benefit-focused, social proof style, urgency, and a question hook). Reference "{{unique_selling_point}}" in at least two sets.$c$,
 array['product','average_price','unique_selling_point','marketing_context'],
 array['intermediate','ads','meta','copywriting'],
 array[]::text[], array['meta_ads']::text[], array[]::text[], array['acquisition','ads']::text[],
 true, 2),

('00000000-0000-0000-0002-000000000020', '00000000-0000-0000-0000-000000000005',
 'Meta Ads Video Hook Scripts',
 'Write hook-first scripts for UGC or talking-head video ads.',
 '5 short video ad scripts optimized for the first 3 seconds.',
 'intermediate',
$c$Act as a performance video ad scriptwriter for e-commerce.

BUSINESS CONTEXT
{{marketing_context}}

OBJECTIVE
Write 5 video ad scripts (30-45 seconds each) for "{{product}}", built for Meta Ads.

For each script, structure it as:
1. Hook (first 3 seconds — must stop the scroll, tied to "{{customer_problem}}" or "{{main_objection}}")
2. Problem/agitation (5-10 seconds)
3. Product as the solution + "{{unique_selling_point}}" (10-15 seconds)
4. Proof or demonstration beat (5-10 seconds)
5. CTA (final 5 seconds)

Write it as a scene-by-scene outline (spoken line + what's shown on screen), not just a paragraph.$c$,
 array['product','customer_problem','main_objection','unique_selling_point','marketing_context'],
 array['intermediate','ads','meta','video','script'],
 array[]::text[], array['meta_ads']::text[], array[]::text[], array['acquisition','ads','content_creation']::text[],
 true, 3),

('00000000-0000-0000-0002-000000000021', '00000000-0000-0000-0000-000000000005',
 'Creative Testing Plan',
 'Structure a disciplined creative testing process instead of guessing.',
 'A testing plan: what to test, in what order, and how to judge results.',
 'advanced',
$c$Act as a performance marketing strategist specialized in creative testing.

BUSINESS CONTEXT
{{marketing_context}}
Monthly marketing budget: {{marketing_budget}}

OBJECTIVE
Build a creative testing plan for "{{product}}" Meta Ads campaigns.

Include:
1. A testing priority order (angle first, then hook, then format — explain why)
2. How many creatives to test per batch given a budget of {{marketing_budget}}
3. A simple framework for deciding "kill / iterate / scale" per creative (name the metrics to watch, e.g. hook rate, CTR, CPA — without requiring any specific ad platform)
4. A suggested weekly cadence for refreshing creatives to avoid fatigue$c$,
 array['product','marketing_budget','marketing_context'],
 array['advanced','ads','meta','testing'],
 array[]::text[], array['meta_ads']::text[], array[]::text[], array['acquisition','ads']::text[],
 true, 4),

('00000000-0000-0000-0002-000000000022', '00000000-0000-0000-0000-000000000005',
 'Retargeting Campaign Plan',
 'Turn warm traffic into buyers with a structured retargeting plan.',
 'A retargeting funnel with messaging for each audience stage.',
 'advanced',
$c$Act as a Meta Ads retargeting specialist.

BUSINESS CONTEXT
{{marketing_context}}

OBJECTIVE
Design a retargeting plan for "{{product}}" covering website visitors, add-to-cart and past customers.

For each audience segment, provide:
1. Who's in it and the likely reason they didn't convert
2. The message angle to use (different for each segment — don't repeat the cold-traffic ad)
3. A suggested offer or nudge (e.g. addressing "{{main_objection}}", a bonus, social proof, or a gentle reminder)
4. Ideal ad format for that segment

Finish with a suggested sequence/timing across the segments.$c$,
 array['product','main_objection','marketing_context'],
 array['advanced','ads','meta','retargeting'],
 array[]::text[], array['meta_ads']::text[], array['increase_revenue']::text[], array['acquisition','conversion']::text[],
 true, 5);

-- Module 6: TikTok (channel: tiktok)
insert into public.prompt_templates
  (id, module_id, title, description, objective, difficulty, content, required_variables, tags, business_types, channels, goals, problems, premium, sort_order)
values
('00000000-0000-0000-0002-000000000023', '00000000-0000-0000-0000-000000000006',
 '20 TikTok Video Ideas',
 'Never run out of things to film — 20 concrete video concepts.',
 '20 TikTok video concepts mapped to formats that actually perform.',
 'beginner',
$c$Act as a TikTok content strategist for e-commerce brands.

BUSINESS CONTEXT
{{marketing_context}}

OBJECTIVE
Generate 20 TikTok video ideas for "{{product}}".

Mix these formats: problem/solution, "get ready with me"-style demo, unboxing, before/after, myth-busting, day-in-the-life, POV, and reaction-bait.

For each idea give:
1. A one-line concept
2. The format it uses
3. A suggested first line of the hook

Anchor at least 4 ideas directly in "{{customer_problem}}" and at least 2 in "{{unique_selling_point}}".$c$,
 array['product','customer_problem','unique_selling_point','marketing_context'],
 array['beginner','tiktok','content','video'],
 array[]::text[], array['tiktok']::text[], array[]::text[], array['content_creation']::text[],
 false, 1),

('00000000-0000-0000-0002-000000000024', '00000000-0000-0000-0000-000000000006',
 'Create 20 TikTok Hooks',
 'Write scroll-stopping hooks — the single most important 2 seconds of a TikTok.',
 '20 ready-to-use hooks with the angle and concept behind each.',
 'intermediate',
$c$Act as an expert direct-response TikTok copywriter for e-commerce.

BUSINESS CONTEXT
Product: {{product}}
Niche: {{niche}}
Target customer: {{target_customer}}
Customer problem: {{customer_problem}}
Unique selling proposition: {{unique_selling_point}}
Country: {{target_country}}

OBJECTIVE
Create 20 TikTok hooks designed to stop {{target_customer}}'s attention in the first 2 seconds.

Requirements:
- Short and natural — the way a real person would talk, not an ad
- Curiosity-driven, specific to the product
- Avoid generic marketing language ("You NEED this!")
- Cover different angles: problem-first, curiosity, bold claim, relatable complaint, "nobody talks about this"

For each hook, provide:
1. Hook (the exact line to say/show)
2. Angle
3. Why it could work
4. Suggested video concept to pair with it$c$,
 array['product','niche','target_customer','customer_problem','unique_selling_point','target_country'],
 array['intermediate','tiktok','hooks','copywriting'],
 array[]::text[], array['tiktok']::text[], array[]::text[], array['content_creation','acquisition']::text[],
 true, 2),

('00000000-0000-0000-0002-000000000025', '00000000-0000-0000-0000-000000000006',
 'TikTok Video Scripts',
 'Turn a hook into a full 20-30 second script.',
 '3 complete, shot-by-shot TikTok scripts ready to film.',
 'intermediate',
$c$Act as a TikTok scriptwriter for direct-to-consumer brands.

BUSINESS CONTEXT
{{marketing_context}}

OBJECTIVE
Write 3 complete TikTok scripts (20-30 seconds each) for "{{product}}".

For each script, break it down as:
1. Hook (0-2s) — spoken line + on-screen text
2. Build-up (2-10s) — agitate "{{customer_problem}}" or build curiosity
3. Reveal/demo (10-20s) — show the product solving it, mention "{{unique_selling_point}}"
4. CTA (last few seconds) — natural, not salesy (e.g. "link in bio" style)

Write actual dialogue/voiceover lines, not just instructions, plus a short note on what to visually show at each beat.$c$,
 array['product','customer_problem','unique_selling_point','marketing_context'],
 array['intermediate','tiktok','script','video'],
 array[]::text[], array['tiktok']::text[], array[]::text[], array['content_creation']::text[],
 true, 3),

('00000000-0000-0000-0002-000000000026', '00000000-0000-0000-0000-000000000006',
 'UGC Creator Brief',
 'A brief you can hand straight to a UGC creator or affiliate.',
 'A complete creative brief for a UGC video partner.',
 'intermediate',
$c$Act as a UGC (user-generated content) producer for e-commerce brands.

BUSINESS CONTEXT
{{marketing_context}}

OBJECTIVE
Write a UGC creator brief for "{{product}}" that I can send directly to a content creator.

Include:
1. Brand and product one-liner
2. Target customer description ({{target_customer}}) so the creator can match tone/persona
3. Key talking points to hit (must include "{{unique_selling_point}}" and a natural way to address "{{main_objection}}")
4. 3 suggested hooks they can choose from or riff on
5. Do's and don'ts (tone, claims to avoid, required disclosures)
6. Deliverable specs (length, format, how many variations)$c$,
 array['product','target_customer','unique_selling_point','main_objection','marketing_context'],
 array['intermediate','tiktok','ugc','brief'],
 array[]::text[], array['tiktok']::text[], array[]::text[], array['content_creation']::text[],
 true, 4);

-- Module 7: Content
insert into public.prompt_templates
  (id, module_id, title, description, objective, difficulty, content, required_variables, tags, business_types, channels, goals, problems, premium, sort_order)
values
('00000000-0000-0000-0002-000000000027', '00000000-0000-0000-0000-000000000007',
 '30-Day Content Calendar',
 'A month of organic content mapped out, no more blank page.',
 'A 30-day content calendar mixing formats, pillars and CTAs.',
 'intermediate',
$c$Act as a social media content strategist for e-commerce brands.

BUSINESS CONTEXT
{{marketing_context}}

OBJECTIVE
Build a 30-day content calendar for "{{product}}" across {{content_types}}.

For each week, define:
1. A content pillar/theme for the week
2. 4-5 specific post ideas with format (video, image, carousel, story) and a one-line concept each
3. One clear call-to-action to rotate through the week (follow, shop, comment, share)

Make sure the calendar balances: pure entertainment/relatable content, educational content about "{{customer_problem}}", behind-the-scenes/brand content, and direct product/offer content — not just sales posts.$c$,
 array['product','content_types','customer_problem','marketing_context'],
 array['intermediate','content','calendar'],
 array[]::text[], array[]::text[], array[]::text[], array['content_creation','organization']::text[],
 false, 1),

('00000000-0000-0000-0002-000000000028', '00000000-0000-0000-0000-000000000007',
 '10 Instagram Reel Ideas',
 'Concepts built specifically for Instagram Reels performance patterns.',
 '10 Reel concepts with hooks and a trending-audio note.',
 'beginner',
$c$Act as an Instagram content strategist for e-commerce brands.

BUSINESS CONTEXT
{{marketing_context}}

OBJECTIVE
Generate 10 Instagram Reel ideas for "{{product}}" targeting {{target_customer}}.

For each idea:
1. Concept (one line)
2. Hook (first line of text-on-screen or voiceover)
3. Suggested reel style (trending audio + fast cuts / talking-to-camera / satisfying process shot / etc.)

Include at least 3 ideas that don't feature the product directly for the first few seconds (pattern-interrupt style) to boost watch time before the reveal.$c$,
 array['product','target_customer','marketing_context'],
 array['beginner','content','instagram','video'],
 array[]::text[], array[]::text[], array[]::text[], array['content_creation']::text[],
 true, 2),

('00000000-0000-0000-0002-000000000029', '00000000-0000-0000-0000-000000000007',
 'Carousel Post Script',
 'Write a swipe-worthy educational or story carousel.',
 'A complete slide-by-slide carousel script.',
 'beginner',
$c$Act as a social media copywriter specialized in carousel posts.

BUSINESS CONTEXT
{{marketing_context}}

OBJECTIVE
Write a 7-slide Instagram/TikTok carousel about "{{customer_problem}}" that naturally leads to "{{product}}".

Structure:
- Slide 1: Hook (bold statement or question, makes people want to swipe)
- Slides 2-5: Value/story/educational content — genuinely useful even if they never buy
- Slide 6: Soft transition into the product and "{{unique_selling_point}}"
- Slide 7: CTA (save, share, or shop)

Write the exact on-slide text for each slide (short, punchy — this isn't a caption, it's what's shown on screen).$c$,
 array['product','customer_problem','unique_selling_point','marketing_context'],
 array['beginner','content','carousel'],
 array[]::text[], array[]::text[], array[]::text[], array['content_creation']::text[],
 true, 3);

-- Module 8: SEO (channel: seo)
insert into public.prompt_templates
  (id, module_id, title, description, objective, difficulty, content, required_variables, tags, business_types, channels, goals, problems, premium, sort_order)
values
('00000000-0000-0000-0002-000000000030', '00000000-0000-0000-0000-000000000008',
 'SEO Keyword Research',
 'Find the terms your customers are actually searching for.',
 'A keyword list grouped by intent, ready to prioritize.',
 'beginner',
$c$Act as an SEO strategist for e-commerce sites.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Suggest a keyword research plan for "{{product}}" in the "{{niche}}" niche, targeting {{target_country}} in {{target_language}}.

Provide:
1. 10 likely high-intent "buyer" keywords (people ready to purchase)
2. 10 informational keywords (people researching "{{customer_problem}}")
3. 5 long-tail keyword ideas that are probably lower competition
4. For each group, note what kind of page should target it (product page, collection, blog article)

Note: these are hypotheses to verify in a real keyword tool (e.g. search volume, difficulty) before committing.$c$,
 array['product','niche','target_country','target_language','customer_problem','business_summary'],
 array['beginner','seo','keywords'],
 array[]::text[], array['seo']::text[], array[]::text[], array[]::text[],
 false, 1),

('00000000-0000-0000-0002-000000000031', '00000000-0000-0000-0000-000000000008',
 'SEO Blog Article Outline',
 'Plan a blog post that ranks and drives qualified traffic.',
 'A full article outline optimized around one target keyword.',
 'intermediate',
$c$Act as an SEO content strategist.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Create a blog article outline that would rank for a topic related to "{{customer_problem}}" and naturally lead readers toward "{{product}}".

Provide:
1. A suggested target keyword/topic
2. An SEO-friendly title (under 60 characters)
3. A meta description (under 155 characters)
4. A full H2/H3 outline (6-8 sections) covering the topic thoroughly
5. Where and how to naturally mention "{{product}}" without it reading as an ad
6. An internal linking suggestion (e.g. link to product/collection page)$c$,
 array['product','customer_problem','business_summary'],
 array['intermediate','seo','content','blog'],
 array[]::text[], array['seo']::text[], array[]::text[], array[]::text[],
 true, 2),

('00000000-0000-0000-0002-000000000032', '00000000-0000-0000-0000-000000000008',
 'SEO-Optimized Product Description',
 'A product description that sells AND ranks.',
 'A product page description balancing SEO and persuasive copy.',
 'intermediate',
$c$Act as an e-commerce SEO copywriter.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Write an SEO-optimized product description for "{{product}}" in the "{{niche}}" niche.

Requirements:
1. Natural inclusion of likely target keywords (infer 3-5 relevant terms based on the product and niche)
2. Still persuasive and benefit-led — never keyword-stuffed
3. Include a short paragraph and a bulleted feature/benefit list
4. Suggest an SEO title tag (under 60 characters) and meta description (under 155 characters) for this product page$c$,
 array['product','niche','business_summary'],
 array['intermediate','seo','product-page'],
 array[]::text[], array['seo']::text[], array[]::text[], array[]::text[],
 true, 3);

-- Module 9: Email (channel: email)
insert into public.prompt_templates
  (id, module_id, title, description, objective, difficulty, content, required_variables, tags, business_types, channels, goals, problems, premium, sort_order)
values
('00000000-0000-0000-0002-000000000033', '00000000-0000-0000-0000-000000000009',
 'Welcome Email Sequence',
 'Turn new subscribers into buyers with a 4-email welcome flow.',
 'A 4-email welcome sequence with subject lines and full copy.',
 'beginner',
$c$Act as an e-commerce email marketing strategist.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Write a 4-email welcome sequence for new subscribers, introducing "{{product}}".

For each email, provide:
1. Send timing (e.g. immediately, day 2, day 4, day 6)
2. Subject line + preview text
3. Full email body (short, skimmable, one clear CTA)

Sequence arc: Email 1 — welcome + brand story; Email 2 — educate on "{{customer_problem}}"; Email 3 — social proof / why "{{unique_selling_point}}" matters; Email 4 — soft offer or incentive to purchase.$c$,
 array['product','customer_problem','unique_selling_point','business_summary'],
 array['beginner','email','sequence'],
 array[]::text[], array['email']::text[], array[]::text[], array[]::text[],
 false, 1),

('00000000-0000-0000-0002-000000000034', '00000000-0000-0000-0000-000000000009',
 'Abandoned Cart Sequence',
 'Recover lost sales with a 3-email cart recovery flow.',
 'A 3-email abandoned cart sequence built to recover revenue.',
 'intermediate',
$c$Act as an e-commerce lifecycle email specialist.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Write a 3-email abandoned cart sequence for "{{product}}".

For each email, provide send timing, subject line, and full body copy:
1. Email 1 (1 hour later) — friendly reminder, no pressure, restate "{{unique_selling_point}}"
2. Email 2 (24 hours later) — address the likely objection ("{{main_objection}}") directly, add social proof
3. Email 3 (48-72 hours later) — final nudge with a light incentive or urgency element (something realistic, not fake scarcity)

Keep subject lines under 50 characters and each email short enough to read in 15 seconds.$c$,
 array['product','unique_selling_point','main_objection','business_summary'],
 array['intermediate','email','sequence','recovery'],
 array[]::text[], array['email']::text[], array['increase_revenue']::text[], array['conversion']::text[],
 true, 2),

('00000000-0000-0000-0002-000000000035', '00000000-0000-0000-0000-000000000009',
 'Post-Purchase & Win-Back Sequence',
 'Increase repeat purchases and re-engage lapsed customers.',
 'A post-purchase nurture flow plus a win-back sequence for lapsed buyers.',
 'advanced',
$c$Act as a retention and lifecycle marketing expert for e-commerce.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Design two short email flows for "{{product}}" customers:

A) Post-purchase (3 emails): order confirmation/thank you with usage tips, a check-in asking for feedback/review, and an upsell or complementary product suggestion.

B) Win-back (2 emails) for customers who haven't purchased again in a while: a "we miss you" email with a reason to return, and a final email with a modest incentive.

For all 5 emails, give: send timing, subject line, and full body copy. Keep the tone warm, not desperate.$c$,
 array['product','business_summary'],
 array['advanced','email','retention'],
 array[]::text[], array['email']::text[], array['increase_revenue']::text[], array[]::text[],
 true, 3);

-- Module 10: Store Optimization
insert into public.prompt_templates
  (id, module_id, title, description, objective, difficulty, content, required_variables, tags, business_types, channels, goals, problems, premium, sort_order)
values
('00000000-0000-0000-0002-000000000036', '00000000-0000-0000-0000-000000000010',
 'Store UX & Conversion Audit',
 'A structured checklist to audit your store like a CRO expert would.',
 'A self-audit checklist covering the highest-impact conversion factors.',
 'beginner',
$c$Act as a conversion rate optimization (CRO) consultant for e-commerce.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Give me a structured self-audit checklist to review my own store for "{{product}}", focused on the areas that most affect conversion.

Organize it into sections:
1. Homepage clarity (can a visitor tell what you sell and why in 5 seconds?)
2. Product page trust (reviews, guarantees, clear pricing, answering "{{main_objection}}")
3. Navigation & findability
4. Mobile experience
5. Checkout friction

For each section, give 3-5 specific yes/no questions I should honestly answer about my own store, plus what to fix if the answer is "no".$c$,
 array['product','main_objection','business_summary'],
 array['beginner','cro','audit','store'],
 array[]::text[], array[]::text[], array[]::text[], array['conversion']::text[],
 false, 1),

('00000000-0000-0000-0002-000000000037', '00000000-0000-0000-0000-000000000010',
 'Homepage Optimization Plan',
 'Make your homepage sell in the first 5 seconds.',
 'A section-by-section homepage rebuild plan.',
 'intermediate',
$c$Act as an e-commerce homepage conversion specialist.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Give me a section-by-section plan to optimize my homepage around "{{product}}" and {{target_customer}}.

For each section (hero, value props, social proof, featured products, how-it-works, guarantee/trust, footer CTA), specify:
1. What it should communicate
2. Suggested headline/copy direction (tie the hero to "{{customer_problem}}" and "{{unique_selling_point}}")
3. What "good" looks like vs. a common mistake to avoid in that section$c$,
 array['product','target_customer','customer_problem','unique_selling_point','business_summary'],
 array['intermediate','cro','homepage'],
 array[]::text[], array[]::text[], array[]::text[], array['conversion']::text[],
 true, 2),

('00000000-0000-0000-0002-000000000038', '00000000-0000-0000-0000-000000000010',
 'Checkout Friction Audit',
 'Find and fix the reasons people abandon at checkout.',
 'A checklist of common checkout friction points to review.',
 'intermediate',
$c$Act as a checkout optimization specialist for e-commerce.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Give me a checklist to audit checkout friction for my store selling "{{product}}" at {{average_price}}.

Cover:
1. Number of steps and information asked for (what's truly necessary vs. nice-to-have)
2. Payment options and trust signals visible at checkout
3. Shipping cost/timing transparency (relevant for {{target_country}})
4. Guest checkout availability
5. Error handling and form clarity

For each area, give a quick "check this" question and the most common fix when something's wrong.$c$,
 array['product','average_price','target_country','business_summary'],
 array['intermediate','cro','checkout'],
 array[]::text[], array[]::text[], array[]::text[], array['conversion']::text[],
 true, 3);

-- Module 11: Competitor Analysis
insert into public.prompt_templates
  (id, module_id, title, description, objective, difficulty, content, required_variables, tags, business_types, channels, goals, problems, premium, sort_order)
values
('00000000-0000-0000-0002-000000000039', '00000000-0000-0000-0000-000000000011',
 'Competitor Teardown',
 'A structured framework to analyze any competitor in your niche.',
 'A repeatable teardown framework you can run on any competitor.',
 'beginner',
$c$Act as a competitive intelligence analyst for e-commerce.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Give me a structured framework to analyze a competitor selling a product similar to "{{product}}" in the "{{niche}}" niche.

For me to fill in per competitor, structure sections for:
1. Positioning & messaging (what do they claim, what angle do they lead with?)
2. Offer (pricing, bundles, guarantees compared to mine at {{average_price}})
3. Product page structure (what do they include that I might be missing?)
4. Apparent traffic sources (organic, paid, influencer — based on visible signals)
5. Weaknesses I could exploit given my "{{unique_selling_point}}"

Give me the framework as a fill-in template, plus 3 example questions per section to guide the analysis.$c$,
 array['product','niche','average_price','unique_selling_point','business_summary'],
 array['beginner','competitors','research'],
 array[]::text[], array[]::text[], array[]::text[], array['positioning']::text[],
 false, 1),

('00000000-0000-0000-0002-000000000040', '00000000-0000-0000-0000-000000000011',
 'Competitive Positioning Map',
 'See exactly where you fit versus competitors — and where the gap is.',
 'A positioning map plus the open gap you can own.',
 'intermediate',
$c$Act as a brand positioning strategist.

BUSINESS CONTEXT
{{business_summary}}

OBJECTIVE
Help me map out competitive positioning for "{{product}}" in the "{{niche}}" niche.

Provide:
1. Two positioning axes that matter most in this niche (e.g. price vs. quality, or convenience vs. customization) and why
2. Where 2-3 typical competitor archetypes would sit on that map (described generically since I may not know exact names)
3. Where I should position "{{product}}" given "{{unique_selling_point}}", and why that spot is defensible
4. The one-sentence positioning gap I can own that competitors are ignoring$c$,
 array['product','niche','unique_selling_point','business_summary'],
 array['intermediate','competitors','positioning'],
 array[]::text[], array[]::text[], array['grow_brand']::text[], array['positioning']::text[],
 true, 2),

('00000000-0000-0000-0002-000000000041', '00000000-0000-0000-0000-000000000011',
 'Steal-Worthy Ad Angles from Competitors',
 'Reverse-engineer what''s probably working for others in your space.',
 'A list of likely-effective angles competitors use, adapted for you.',
 'intermediate',
$c$Act as a performance marketing analyst.

BUSINESS CONTEXT
{{marketing_context}}

OBJECTIVE
Based on common patterns in the "{{niche}}" niche, suggest 6 ad angles that competitors are likely using successfully — then adapt each one for "{{product}}".

For each angle:
1. The general angle pattern (e.g. "before/after", "expert endorsement", "problem nobody talks about")
2. Why it likely works in this niche
3. How to adapt it authentically for "{{product}}" using "{{unique_selling_point}}" instead of copying directly$c$,
 array['product','niche','unique_selling_point','marketing_context'],
 array['intermediate','competitors','ads'],
 array[]::text[], array[]::text[], array[]::text[], array['acquisition','positioning']::text[],
 true, 3);

-- Module 12: Customer Research
insert into public.prompt_templates
  (id, module_id, title, description, objective, difficulty, content, required_variables, tags, business_types, channels, goals, problems, premium, sort_order)
values
('00000000-0000-0000-0002-000000000042', '00000000-0000-0000-0000-000000000012',
 'Customer Avatar Builder',
 'Turn a vague target market into one specific, vivid person.',
 'A detailed customer avatar you can reference across your marketing.',
 'beginner',
$c$Act as a customer research and persona expert.

BUSINESS CONTEXT
{{customer_summary}}

OBJECTIVE
Build a detailed customer avatar for the person most likely to buy "{{product}}".

Cover:
1. Demographics (age range, life stage — inferred reasonably from {{target_customer}} and {{target_country}})
2. A day in their life relevant to "{{customer_problem}}"
3. Their goals and what success looks like to them
4. Their fears and frustrations related to this problem
5. Where they spend time online (platforms, content types)
6. What would make them trust a new brand like this one, given "{{unique_selling_point}}"

Give the avatar a name and write it as a short narrative profile, not just bullet facts.$c$,
 array['product','target_customer','target_country','customer_problem','unique_selling_point','customer_summary'],
 array['beginner','customer-research','avatar'],
 array[]::text[], array[]::text[], array[]::text[], array[]::text[],
 false, 1),

('00000000-0000-0000-0002-000000000043', '00000000-0000-0000-0000-000000000012',
 'Customer Pain Point Map',
 'Map every pain point around the problem you solve.',
 'A ranked map of pains, ready to fuel offers and messaging.',
 'intermediate',
$c$Act as a customer insight researcher.

BUSINESS CONTEXT
{{customer_summary}}

OBJECTIVE
Map out the pain points {{target_customer}} experiences around "{{customer_problem}}".

Provide:
1. 6-8 specific pain points (go beyond the obvious — surface-level, emotional, and social pains)
2. For each, rate intensity (Low / Medium / High) and how directly "{{product}}" addresses it
3. Group them into 2-3 clusters/themes
4. Identify the single highest-leverage pain point to lead with in messaging, and why$c$,
 array['target_customer','customer_problem','product','customer_summary'],
 array['intermediate','customer-research','pains'],
 array[]::text[], array[]::text[], array[]::text[], array['offer','positioning']::text[],
 true, 2),

('00000000-0000-0000-0002-000000000044', '00000000-0000-0000-0000-000000000012',
 'Voice-of-Customer Language Mining',
 'Write copy that sounds like your customer, not like a brand.',
 'A bank of authentic phrases to reuse across ads, page copy and email.',
 'advanced',
$c$Act as a voice-of-customer research analyst.

BUSINESS CONTEXT
{{customer_summary}}

OBJECTIVE
Generate a bank of authentic-sounding phrases {{target_customer}} would realistically use when describing "{{customer_problem}}" and their experience looking for a solution like "{{product}}".

Provide:
1. 8 phrases describing the problem in their own words (as if complaining to a friend)
2. 5 phrases describing what the ideal solution would do for them
3. 5 phrases expressing skepticism or objections (should echo "{{main_objection}}")
4. A short note on tone/vocabulary patterns I should mirror in my copy (formal vs. casual, slang, emojis, etc.)$c$,
 array['target_customer','customer_problem','product','main_objection','customer_summary'],
 array['advanced','customer-research','voice-of-customer','copywriting'],
 array[]::text[], array[]::text[], array[]::text[], array[]::text[],
 true, 3);

-- ----------------------------------------------------------------------------
-- Workflows
-- ----------------------------------------------------------------------------
insert into public.workflows (id, slug, title, description, icon, business_types, channels, goals, problems, sort_order) values
('00000000-0000-0000-0001-000000000001', 'find-validate-product', 'Find & Validate a Product',
 'Go from "no product yet" to a validated product you''re confident to launch.', 'search',
 array[]::text[], array[]::text[], array['find_product']::text[], array['product']::text[], 1),
('00000000-0000-0000-0001-000000000002', 'build-winning-offer', 'Build a Winning Offer',
 'Turn a product into an offer people feel silly saying no to.', 'gift',
 array[]::text[], array[]::text[], array['launch_store','increase_revenue']::text[], array['offer']::text[], 2),
('00000000-0000-0000-0001-000000000003', 'create-product-page', 'Create a Product Page',
 'Write a complete, high-converting product page from scratch.', 'file-text',
 array[]::text[], array[]::text[], array['launch_store']::text[], array['conversion']::text[], 3),
('00000000-0000-0000-0001-000000000004', 'launch-tiktok-content', 'Launch TikTok Content',
 'Plan and script your first wave of TikTok content.', 'video',
 array[]::text[], array['tiktok']::text[], array[]::text[], array['content_creation']::text[], 4),
('00000000-0000-0000-0001-000000000005', 'create-meta-ads', 'Create Meta Ads',
 'Build your first (or next) Meta Ads campaign from angle to retargeting.', 'megaphone',
 array[]::text[], array['meta_ads']::text[], array[]::text[], array['acquisition','ads']::text[], 5);

-- ----------------------------------------------------------------------------
-- Workflow steps
-- ----------------------------------------------------------------------------

-- Find & Validate a Product
insert into public.workflow_steps (workflow_id, template_id, title, description, sort_order) values
('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0002-000000000002', 'Analyze your product', 'Get a full breakdown before you commit.', 1),
('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0002-000000000003', 'Research the market', 'Check how real and how big the demand is.', 2),
('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0002-000000000004', 'Find your marketing angles', 'Uncover the different ways you can sell it.', 3),
('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0002-000000000005', 'Run the validation checklist', 'Score the product before investing further.', 4),
('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0002-000000000006', 'Map risks & objections', 'Know every reason someone wouldn''t buy.', 5),
('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0002-000000000007', 'Define your differentiation', 'Nail down why you, not a competitor.', 6);

-- Build a Winning Offer
insert into public.workflow_steps (workflow_id, template_id, title, description, sort_order) values
('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0002-000000000043', 'Identify customer pain points', 'Map what really hurts for your customer.', 1),
('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0002-000000000013', 'Create the value proposition', 'Turn the product into a clear promise.', 2),
('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0002-000000000014', 'Build the offer', 'Design bundle, pricing and upsell structure.', 3),
('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0002-000000000015', 'Create bonuses', 'Add perceived value without hurting margin.', 4),
('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0002-000000000016', 'Create your guarantee', 'Remove the last reason not to buy.', 5),
('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0002-000000000017', 'Write the final offer messaging', 'Package it all into one clear pitch.', 6);

-- Create a Product Page
insert into public.workflow_steps (workflow_id, template_id, title, description, sort_order) values
('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0002-000000000008', 'Write title & subtitle', 'Hook and clarify in one glance.', 1),
('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0002-000000000009', 'Write the description', 'Turn features into benefits.', 2),
('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0002-000000000010', 'Write the FAQ', 'Answer the questions that stop clicks.', 3),
('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0002-000000000011', 'Handle objections', 'Pre-empt the #1 reason people bounce.', 4),
('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0002-000000000012', 'Write CTA & urgency copy', 'Close the page with confidence.', 5);

-- Launch TikTok Content
insert into public.workflow_steps (workflow_id, template_id, title, description, sort_order) values
('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0002-000000000023', 'Find video ideas', 'Never run out of things to film.', 1),
('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0002-000000000024', 'Write your hooks', 'Stop the scroll in the first 2 seconds.', 2),
('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0002-000000000025', 'Write full scripts', 'Turn hooks into shot-by-shot scripts.', 3),
('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0002-000000000027', 'Plan your content calendar', 'Map 30 days of consistent posting.', 4),
('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0002-000000000026', 'Brief a UGC creator', 'Hand off a ready-to-use creative brief.', 5);

-- Create Meta Ads
insert into public.workflow_steps (workflow_id, template_id, title, description, sort_order) values
('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0002-000000000018', 'Brainstorm ad angles', 'Find distinct angles worth testing.', 1),
('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0002-000000000019', 'Write primary text & headlines', 'Ready-to-launch ad copy sets.', 2),
('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0002-000000000020', 'Write video hook scripts', 'Scripts built for the first 3 seconds.', 3),
('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0002-000000000021', 'Plan creative testing', 'Structure a disciplined testing process.', 4),
('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0002-000000000022', 'Plan retargeting', 'Turn warm traffic into buyers.', 5);
