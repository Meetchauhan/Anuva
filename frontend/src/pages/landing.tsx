import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3">
                <CheckCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">AnuvaConnect</h1>
            </div>
            <Link href="/auth">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Create your <span className="text-primary">Connected Care</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your personal care companion platform for comprehensive brain
            healthcare and recovery management. Track symptoms, complete
            assessments, and collaborate with your care team.
          </p>
          <Link href="/auth">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
            >
              Get Started Today
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-8 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Symptom Tracking
              </h3>
              <p className="text-gray-600">
                Monitor symptoms, track recovery progress, and visualize your
                neurological health data with comprehensive analytics.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Secure & Private
              </h3>
              <p className="text-gray-600">
                Your health information is protected with enterprise-grade
                security and HIPAA-compliant data handling practices.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Care Coordination
              </h3>
              <p className="text-gray-600">
                Connect your brain care team including specialists, trainers,
                and family for comprehensive brain health management.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Complete Brain Healthcare at Your Fingertips
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Complete Baseline & Assessment Forms
                    </h4>
                    <p className="text-gray-600">
                      Fill out neuro-assessments and symptom tracking forms
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Monitor Neurological Symptoms
                    </h4>
                    <p className="text-gray-600">
                      Track headaches, cognitive function, and recovery progress
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Access Test Results
                    </h4>
                    <p className="text-gray-600">
                      View brain health scores, imaging results, and cognitive
                      assessments
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Coordinate with Care Team
                    </h4>
                    <p className="text-gray-600">
                      Connect with neurologists, trainers, and specialists
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="from-blue-500 to-blue-600 rounded-xl p-8 text-white text-center bg-[#1F5A42]">
              <h4 className="text-2xl font-bold mb-4">Ready to get started?</h4>
              <p className="text-blue-100 mb-6">
                Join athletes, patients, & family members who trust AnuvaConnect
                for comprehensive personal brain healthcare.
              </p>
              <Button
                onClick={() => (window.location.href = "/api/login")}
                variant="secondary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
              >
                Sign In Now
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-[#1F5A42]">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              AnuvaConnect
            </span>
          </div>
          <p className="text-gray-600">
            Secure, HIPAA-compliant patient portal for comprehensive
            neurological care and concussion management.
          </p>
        </div>
      </footer>
    </div>
  );
}
