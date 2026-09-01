import './Results.css';

export default function Help() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2>Help & Support</h2>
        <p>Get assistance with portal issues.</p>
      </div>

      <div className="help-grid">
        <div className="content-card">
          <h3 className="card-title">Frequently Asked Questions</h3>
          <div className="faq-list">
            <div className="faq-item">
              <h4>How do I reset my portal password?</h4>
              <p>Go to the Settings page and select 'Change Password', or contact the ICT admin.</p>
            </div>
            <div className="faq-item">
              <h4>Why is my course registration locked?</h4>
              <p>Ensure all outstanding school fees for the current semester are paid in full.</p>
            </div>
          </div>
        </div>

        <div className="content-card contact-card">
          <h3 className="card-title">Contact ICT Center</h3>
          <p>For urgent technical issues, reach out to support.</p>
          <div className="contact-methods">
            <div className="contact-pill">📧 support@eduportal.edu.ng</div>
            <div className="contact-pill">📞 +234 800 000 0000</div>
          </div>
        </div>
      </div>
    </div>
  );
}