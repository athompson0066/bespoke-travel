
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="material-icons text-white text-sm">auto_awesome</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">BESPOKE <span className="text-primary">AI</span></span>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            The premier AI automation suite designed exclusively for luxury travel experts across the globe.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a className="hover:text-primary transition-colors" href="#"><span className="material-icons">facebook</span></a>
            <a className="hover:text-primary transition-colors" href="#"><span className="material-icons">alternate_email</span></a>
            <a className="hover:text-primary transition-colors" href="#"><span className="material-icons">public</span></a>
          </div>
        </div>

        {[
          { title: 'Platform', links: ['AI Generator', 'Email Builder', 'Advisor Dashboard', 'Template Library'] },
          { title: 'Company', links: ['About Us', 'Careers', 'Press Kit', 'Contact'] },
          { title: 'Support', links: ['Help Center', 'API Documentation', 'Security', 'Privacy Policy'] },
        ].map((section, idx) => (
          <div key={idx}>
            <h4 className="text-white font-bold mb-6">{section.title}</h4>
            <ul className="space-y-4 text-sm">
              {section.links.map((link) => (
                <li key={link}><a className="hover:text-white transition-colors" href="#">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between gap-4 text-center md:text-left">
        <p className="text-xs">© 2024 Bespoke AI Automation.</p>
        <div className="flex flex-wrap justify-center gap-8 text-xs">
          <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-white transition-colors" href="#">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
