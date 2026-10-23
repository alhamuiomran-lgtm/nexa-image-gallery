# Compatibility — declarations and executed scope

Stage8 acceptance is recorded in [RELEASE_PLAN.md](RELEASE_PLAN.md) and [evidence/phase8/closeout.json](evidence/phase8/closeout.json). This matrix supersedes the earlier NOT RUN entries without relabelling their historical receipts. It is not final1.0.0 commercial-package acceptance.

Both products declare WordPress>=6.6 and PHP>=8.1. Theme Tested up to7.1 corresponds to actual7.1.3 testing. Final installed QA source is `83b74b7c7054102794b7cce6cab951cda04e5958`, semantically equivalent to functional/browser/performance source `41dfbadacdc75ed64412a4268b3f87bf2c593c6d` by the two-file format-only qualification; earlier source bindings remain explicit in the retained runtime/browser evidence.

| Environment | Executed scope and limits |
|---|---|
| WordPress7.1.3 / PHP8.3.35 / MariaDB11.4 | Installed ZIP parity1013files; seven demos, native requests, Arabic frontend/editor/Studio, actual three-engine responsive/control tests and measured performance. Not a final sales ZIP. |
| WordPress6.6 / PHP8.3.35 | Fresh isolated minimum-version native install/import and36render probes; malformed className root fix387checks with Companion/377without. Existing valid363patterns unchanged; no saved customer data normalization. |
| PHP8.1.34,8.2.34,8.4.27,8.5.12 × WordPress6.6/7.1.3 | Eight actual HTTP/REST/Studio/Gutenberg save/reopen pairs plus387normalizer checks each, sourcecb3319. New later PHP uses established WordPress APIs and passed changed-source8.1–8.5compatibility scan; this does not claim every page/action on every pair. |
| WordPress6.6 + PHP8.5.12 | Functional tests passed, but upstream Core theme.json null-array-offset deprecations are retained. Prefer current WordPress with current PHP; this old/new pair is not advertised as diagnostic-free. |
| MariaDB11.4 | Actual shared QA database engine. MySQL8 and other engines not executed. |
| Chromium151.0.7922.173 / Firefox157.0 / LinuxWPE WebKit27.2 | Actual engine launches and public/admin/editor/control runs. Widths320/390/768/1024/1440; noJS320/1440; Arabic/mixed text; keyboard, focus, dialogs, forms and reduced motion. WPE is not real Safari. |
| Android/iPhone emulation | Fourteen actual touch/coarse-pointer/normal-motion cases across seven demos; Chromium Android and WPE iPhone descriptors at390. No physical-device, OS or realSafari certification. |
| Arabic | Official core Arabic installed on main7.1.3lab.105assigned-menu cases;42accepted editor width/engine cases including21native RichText keyboard save/reopen operations;30current Studio/Library cases and actual Arabic actions4+3. Partial catalogs58theme/177Companion; demo marketing copy and some UI remain English. Bundled theme binary is `languages/ar.mo`; translation output must follow WordPress locale naming. POT extraction audit remained enabled. |
| Accessibility |336baseline cases,28Axe scans with no observed violations; contrast incompletes retained and triaged using actual images/source.18affected contrast cases/210ratio checks, minimum4.67545; native200%zoom on seven demos, corrected full-viewport captures, actual keyboard dialogs/forms and noJS navigation. No screen-reader session or fullWCAG2.2AA certification. |
| Performance |33Lighthouse runs:21seven-demo baseline plus12affected runs only. Median scores95–99, CLS0; after-change medianTBT0–11ms. LCP reference2.5s remains exceeded on Climate/CODALINE/SOLSTICE as explicitP2. No fieldINP or public-hosting speed guarantee. |

| Free integration / exact version | Actual scope |
|---|---|
| Contact Form7 6.2.3 | Independently activated; actual shortcode form and accessible invalid-field validation, frontend/REST/Studio/editor coexistence. External mail delivery not tested. |
| Yoast SEO28.7 | Independently active with Companion; frontend SEO markup/canonical and native editor/Studio/REST. Not active simultaneously with RankMath. |
| RankMath1.0.280 | Its registration gate initially disabled frontend SEO. Native offline skip handler used with rendered genuine nonce and capabilities; synthetic custom title/description/canonical verified, then Studio/Gutenberg. Account/cloud services not connected; API-assisted setup, not a complete wizard UI certification. |
| WP Mail SMTP4.10.3 | Native activation and expected first-run wizard; default-provider frontend/REST/Studio/editor coexistence. Authorized external transport absent: **BLOCKED BY OWNER**, no claim of external delivery. |
| LiteSpeed Cache7.9.2 | Plugin coexistence on Apache only. LiteSpeed-server page caching and QUIC.cloud **NOT TESTED / server unavailable**. |
| WP Super Cache3.1.4 | Native settings with pretty-permalink prerequisite and correctly placed WP_CACHE/WPCACHEHOME; anonymous cached HTML byte-equal to actual saved cachefile. Configuration/rewrite options restored exactly. Earlier broad-marker falsePASS is explicitly rejected in qualification receipt. Generated dropins retained privately after testing so baseline stays uncached. |
| Limit Login Attempts Reloaded3.3.10 | Native activation, successful real administrator login, public/editor/Studio/REST coexistence. No intentional account lockout/cloud service tests. |
| UpdraftPlus1.26.13 | Native activation and public/login/editor/Studio/REST coexistence. No shared-database backup/restore operation; separate upgrade/rollback gate remains. |

These are bounded integration results, not an obligation to install all plugins or a claim that every plugin feature was certified. No official WooCommerce/Elementor/WPBakery/WPML/Polylang/WP Rocket or paid-plugin support is added. Existing core-without-Companion and security/import evidence remains attributed to its actual source and scope.
