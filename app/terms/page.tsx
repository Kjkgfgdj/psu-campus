import { FileText, AlertCircle, CheckCircle, Scale } from "lucide-react";
import { Container } from "@/components/ui/Container";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/20">
      <Container className="max-w-5xl">
        <div className="py-20 space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-2">
              📋 Terms & Conditions
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
              Terms of
              <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Terms Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-xl">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Clear Terms</h3>
                  <p className="text-xs text-slate-600">Easy to understand</p>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-xl">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Fair Use</h3>
                  <p className="text-xs text-slate-600">Reasonable policies</p>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-xl">
                    <AlertCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">User Safety</h3>
                  <p className="text-xs text-slate-600">Protected experience</p>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-xl">
                    <Scale className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Legal Rights</h3>
                  <p className="text-xs text-slate-600">Your rights protected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Acceptance of Terms</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    By accessing and using PSU Campus Navigator ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service.
                  </p>
                  <p>
                    This Service is provided by students of Prince Sultan University for the benefit of the PSU community.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Use of Service</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    PSU Campus Navigator is designed to help students, staff, and visitors navigate Prince Sultan University campus. You agree to use the Service:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>For lawful purposes only</li>
                    <li>In a manner consistent with these terms and applicable laws</li>
                    <li>Without attempting to disrupt or interfere with the Service</li>
                    <li>Without attempting to gain unauthorized access to any systems or data</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Service Availability</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    We strive to provide reliable and accurate information, but please note:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>The Service is provided "as is" without warranties of any kind</li>
                    <li>We do not guarantee uninterrupted or error-free service</li>
                    <li>Campus information may change, and we cannot guarantee real-time accuracy</li>
                    <li>We reserve the right to modify or discontinue the Service at any time</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Intellectual Property</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    All content, features, and functionality of PSU Campus Navigator are owned by the creators and are protected by international copyright, trademark, and other intellectual property laws.
                  </p>
                  <p>
                    You may not:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Copy, modify, or distribute content from the Service without permission</li>
                    <li>Use automated systems to access or scrape the Service</li>
                    <li>Remove or alter any copyright, trademark, or other proprietary notices</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Accuracy of Information</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    While we make every effort to ensure the accuracy of campus location information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Building layouts and room numbers may change over time</li>
                    <li>We recommend verifying critical information with official PSU sources</li>
                    <li>The Service should be used as a guide, not as the sole source of navigation</li>
                    <li>We are not responsible for any consequences resulting from inaccurate information</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitation of Liability</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    To the fullest extent permitted by law, PSU Campus Navigator and its creators shall not be liable for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Any indirect, incidental, special, or consequential damages</li>
                    <li>Loss of data, profits, or business opportunities</li>
                    <li>Delays or inability to use the Service</li>
                    <li>Errors or inaccuracies in the information provided</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Links</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    The Service may contain links to third-party websites or services. We are not responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>The content or privacy practices of third-party sites</li>
                    <li>Any damage or loss caused by use of third-party services</li>
                    <li>The availability or accuracy of external resources</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to Terms</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to this page. Your continued use of the Service after any changes constitutes acceptance of the new terms.
                  </p>
                  <p>
                    We encourage you to review these terms periodically to stay informed of any updates.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Governing Law</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    These terms shall be governed by and construed in accordance with the laws of the Kingdom of Saudi Arabia, without regard to its conflict of law provisions.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-10"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Information</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    If you have any questions about these Terms of Service, please contact us:
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
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Acknowledgment</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    By using PSU Campus Navigator, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                  </p>
                  <p className="text-sm text-slate-600 italic">
                    Thank you for using PSU Campus Navigator. We hope it makes your campus experience better!
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

