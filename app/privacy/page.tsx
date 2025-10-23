import { Shield, Lock, Eye, Database } from "lucide-react";
import { Container } from "@/components/ui/Container";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/20">
      <Container className="max-w-5xl">
        <div className="py-20 space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-2">
              🔒 Your Privacy Matters
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
              Privacy
              <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Privacy Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-xl">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">No Tracking</h3>
                  <p className="text-xs text-slate-600">We don't track your activity</p>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-xl">
                    <Lock className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Secure</h3>
                  <p className="text-xs text-slate-600">Your data is protected</p>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-xl">
                    <Eye className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Transparent</h3>
                  <p className="text-xs text-slate-600">Clear privacy practices</p>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-xl">
                    <Database className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Minimal Data</h3>
                  <p className="text-xs text-slate-600">We collect only what's needed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Content */}
          <div className="space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    PSU Campus Navigator is designed with privacy in mind. We collect minimal information to provide you with the best campus navigation experience:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Search Queries:</strong> Your search terms are processed to help you find locations on campus</li>
                    <li><strong>Usage Data:</strong> Anonymous analytics to understand which features are most helpful</li>
                    <li><strong>Technical Data:</strong> Browser type and device information to optimize the user experience</li>
                  </ul>
                  <p className="text-sm text-slate-600 mt-4">
                    We do not collect personally identifiable information unless you contact us via email.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    The information we collect is used solely to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide accurate search results and navigation assistance</li>
                    <li>Improve our service and user experience</li>
                    <li>Monitor and analyze usage patterns to enhance functionality</li>
                    <li>Fix technical issues and maintain service reliability</li>
                  </ul>
                  <p className="mt-4">
                    We <strong>never</strong> sell, rent, or share your information with third parties for marketing purposes.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies and Tracking</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    We use minimal cookies and tracking technologies:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                    <li><strong>Analytics:</strong> Anonymous usage data to improve our service</li>
                  </ul>
                  <p className="mt-4">
                    You can disable cookies in your browser settings, though this may affect some functionality.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    We take data security seriously and implement industry-standard measures to protect your information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Secure HTTPS encryption for all data transmission</li>
                    <li>Regular security audits and updates</li>
                    <li>Limited access to any collected data</li>
                    <li>Secure hosting infrastructure</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access any personal information we may hold</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of analytics and non-essential cookies</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    If you have any questions or concerns about our privacy practices, please contact us at:
                  </p>
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <p className="font-semibold text-slate-900">PSU Campus Navigator Team</p>
                    <a href="mailto:222211578@psu.edu.sa" className="text-green-600 hover:text-green-700 transition-colors">
                      222211578@psu.edu.sa
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

