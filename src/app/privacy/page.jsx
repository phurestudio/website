export const metadata = {
  title: "Privacy Policy | Phure Studios",
};

const partnerExamples = [
  "Analytics: Unity Analytics (not currently used, may be used in future)",
  "Ads: Unity Ads (not currently used, may be used in future)",
  "Ads: Apple iAds (not currently used, may be used in future)",
  "Ads/Analytics: Google AdMob / Google Analytics",
  "Gaming services: Google Play Games",
  "Gaming services: Apple Game Center",
];

export default function PrivacyPage() {
  return (
    <div className="section" style={{ gap: 12, maxWidth: 960, margin: "0 auto" }}>
      <section className="card" style={{ display: "grid", gap: 8 }}>
        <h1 style={{ margin: 0 }}>Privacy Policy</h1>
        <p style={{ margin: 0, fontWeight: 600 }}>Last updated: June 30, 2018</p>
        <p style={{ margin: "4px 0 0 0" }}>
          This page explains Phure Studios' privacy policy for our games and website. We do not
          collect personally identifiable information when you browse our site.
        </p>
      </section>

      <section className="card" style={{ display: "grid", gap: 8 }}>
        <h2 style={{ margin: 0 }}>What information do we collect?</h2>
        <p style={{ margin: 0 }}>
          Phure Studios does not collect personally identifiable information. Some games may collect
          anonymous usage statistics (for example time spent in levels, scores, or similar gameplay
          analytics) to help us improve the experience.
        </p>
      </section>

      <section className="card" style={{ display: "grid", gap: 8 }}>
        <h2 style={{ margin: 0 }}>What do trusted partners collect?</h2>
        <p style={{ margin: 0 }}>
          Our games are mainly supported by ads. Partners may collect non-personal data (such as
          device model or broad country/continent location) to serve relevant ads.
        </p>
        <p style={{ margin: 0 }}>
          For social features like leaderboards, achievements, or sharing, partners may collect the
          data needed to provide those services. This is not personally identifiable unless you
          explicitly register or log in (for example with email).
        </p>
        <div style={{ display: "grid", gap: 6 }}>
          <h3 style={{ margin: 0 }}>Partners (examples)</h3>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {partnerExamples.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p style={{ margin: 0 }}>
            Apart from these trusted partners, no information is shared with third parties.
          </p>
        </div>
      </section>

      <section className="card" style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>Third-party links</h2>
        <p style={{ margin: 0 }}>
          Our website may include links to third-party products or services. Those sites have
          separate privacy policies and we are not responsible for their content or activities. We
          welcome feedback to help protect the integrity of our site.
        </p>
      </section>

      <section className="card" style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>GDPR (General Data Protection Regulation)</h2>
        <p style={{ margin: 0 }}>
          We respect your privacy and take precautions to comply with the GDPR. We will not
          distribute personal information to outside parties without your consent.
        </p>
      </section>

      <section className="card" style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>COPPA (Children's Online Privacy Protection Act)</h2>
        <p style={{ margin: 0 }}>
          We comply with COPPA and do not knowingly collect information from anyone under 13. Our
          products and services are intended for people aged 13 and older.
        </p>
      </section>

      <section className="card" style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>Your consent</h2>
        <p style={{ margin: 0 }}>
          By using our games or website, you consent to the terms in this privacy policy.
        </p>
      </section>

      <section className="card" style={{ display: "grid", gap: 8 }}>
        <h2 style={{ margin: 0 }}>Opt-out of targeted advertising</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>iOS: limit ad tracking in device settings.</li>
          <li>Android: opt out of interest-based ads in device settings.</li>
          <li>Use tools such as the Digital Advertising Alliance's AppChoices app.</li>
        </ul>
      </section>

      <section className="card" style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>Changes to this policy</h2>
        <p style={{ margin: 0 }}>
          We may change this policy at any time. If we do, we will update the modification date in
          this document. This policy was last modified on June 30th, 2018.
        </p>
      </section>

      <section className="card" style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>Contacting us</h2>
        <p style={{ margin: 0 }}>If you have questions about this policy, contact us:</p>
        <div style={{ display: "grid", gap: 4 }}>
          <p style={{ margin: 0 }}>
            <strong>Phure Studios</strong>
          </p>
          <p style={{ margin: 0 }}>Van Cronenburchstraat 46, 8921 AP Leeuwarden</p>
          <p style={{ margin: 0 }}>Phone: 058 2038378</p>
          <p style={{ margin: 0 }}>Email: info@phurestudios.com</p>
          <p style={{ margin: 0 }}>KvK number: 01149677</p>
        </div>
      </section>
    </div>
  );
}
